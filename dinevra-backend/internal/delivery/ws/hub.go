package ws

import (
	"context"
	"encoding/json"
	"log"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type Hub struct {
	UnitClients map[uuid.UUID]map[*Client]bool
	Register    chan *Client
	Unregister  chan *Client
	Broadcast   chan []byte
	RedisClient *redis.Client
}

func NewHub(redisClient *redis.Client) *Hub {
	return &Hub{
		UnitClients: make(map[uuid.UUID]map[*Client]bool),
		Register:    make(chan *Client),
		Unregister:  make(chan *Client),
		Broadcast:   make(chan []byte),
		RedisClient: redisClient,
	}
}

func (h *Hub) Run(ctx context.Context) {
	// Start listening to Redis pubsub if needed, or handle it per unit
	for {
		select {
		case client := <-h.Register:
			if _, ok := h.UnitClients[client.UnitID]; !ok {
				h.UnitClients[client.UnitID] = make(map[*Client]bool)
				// Subscribe to Redis channel for this unit
				go h.SubscribeToUnitChannel(ctx, client.UnitID)
			}
			h.UnitClients[client.UnitID][client] = true
			log.Printf("Client registered to unit: %s", client.UnitID)

		case client := <-h.Unregister:
			if clients, ok := h.UnitClients[client.UnitID]; ok {
				if _, ok := clients[client]; ok {
					delete(clients, client)
					close(client.Send)
					if len(clients) == 0 {
						delete(h.UnitClients, client.UnitID)
						// Unsubscribe from Redis channel
					}
					log.Printf("Client unregistered from unit: %s", client.UnitID)
				}
			}

		case message := <-h.Broadcast:
			// In a real scenario, this message would contain the target unitID
			// and we would broadcast it via Redis to all instances.
			_ = message
		}
	}
}

// PublishEvent sends a message to the Redis Pub/Sub channel for a specific unit
func (h *Hub) PublishEvent(ctx context.Context, unitID uuid.UUID, eventType string, payload interface{}) error {
	channel := "channel:unit:" + unitID.String() + ":events"

	msg := map[string]interface{}{
		"type":    eventType,
		"payload": payload,
	}
	data, err := json.Marshal(msg)
	if err != nil {
		return err
	}

	return h.RedisClient.Publish(ctx, channel, data).Err()
}

// SubscribeToUnitChannel listens for messages on a Redis channel and forwards them to local connected WS clients
func (h *Hub) SubscribeToUnitChannel(ctx context.Context, unitID uuid.UUID) {
	channel := "channel:unit:" + unitID.String() + ":events"
	pubsub := h.RedisClient.Subscribe(ctx, channel)
	defer pubsub.Close()

	ch := pubsub.Channel()

	for msg := range ch {
		clients, ok := h.UnitClients[unitID]
		if ok {
			for client := range clients {
				select {
				case client.Send <- []byte(msg.Payload):
				default:
					close(client.Send)
					delete(clients, client)
				}
			}
		}
	}
}
