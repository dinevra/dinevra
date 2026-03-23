package ws

import (
	"context"
	"encoding/json"
	"log"

	"github.com/google/uuid"
	"github.com/redis/go-redis/v9"
)

type Hub struct {
	KitchenClients map[uuid.UUID]map[*Client]bool
	Register    chan *Client
	Unregister  chan *Client
	Broadcast   chan []byte
	RedisClient *redis.Client
}

func NewHub(redisClient *redis.Client) *Hub {
	return &Hub{
		KitchenClients: make(map[uuid.UUID]map[*Client]bool),
		Register:    make(chan *Client),
		Unregister:  make(chan *Client),
		Broadcast:   make(chan []byte),
		RedisClient: redisClient,
	}
}

func (h *Hub) Run(ctx context.Context) {
	// Start listening to Redis pubsub if needed, or handle it per kitchen
	for {
		select {
		case client := <-h.Register:
			if _, ok := h.KitchenClients[client.KitchenID]; !ok {
				h.KitchenClients[client.KitchenID] = make(map[*Client]bool)
				// Subscribe to Redis channel for this kitchen
				go h.SubscribeToKitchenChannel(ctx, client.KitchenID)
			}
			h.KitchenClients[client.KitchenID][client] = true
			log.Printf("Client registered to kitchen: %s", client.KitchenID)

		case client := <-h.Unregister:
			if clients, ok := h.KitchenClients[client.KitchenID]; ok {
				if _, ok := clients[client]; ok {
					delete(clients, client)
					close(client.Send)
					if len(clients) == 0 {
						delete(h.KitchenClients, client.KitchenID)
						// Unsubscribe from Redis channel
					}
					log.Printf("Client unregistered from kitchen: %s", client.KitchenID)
				}
			}

		case message := <-h.Broadcast:
			// In a real scenario, this message would contain the target kitchenID
			// and we would broadcast it via Redis to all instances.
			_ = message
		}
	}
}

// PublishEvent sends a message to the Redis Pub/Sub channel for a specific kitchen
func (h *Hub) PublishEvent(ctx context.Context, kitchenID uuid.UUID, eventType string, payload interface{}) error {
	channel := "channel:kitchen:" + kitchenID.String() + ":events"

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

// SubscribeToKitchenChannel listens for messages on a Redis channel and forwards them to local connected WS clients
func (h *Hub) SubscribeToKitchenChannel(ctx context.Context, kitchenID uuid.UUID) {
	channel := "channel:kitchen:" + kitchenID.String() + ":events"
	pubsub := h.RedisClient.Subscribe(ctx, channel)
	defer pubsub.Close()

	ch := pubsub.Channel()

	for msg := range ch {
		clients, ok := h.KitchenClients[kitchenID]
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
