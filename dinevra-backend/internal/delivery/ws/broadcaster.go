package ws

import (
	"context"

	"github.com/google/uuid"
)

type RedisBroadcaster struct {
	hub *Hub
}

func NewRedisBroadcaster(hub *Hub) *RedisBroadcaster {
	return &RedisBroadcaster{
		hub: hub,
	}
}

func (r *RedisBroadcaster) BroadcastOrderCreated(ctx context.Context, unitID uuid.UUID, orderID uuid.UUID) error {
	payload := map[string]interface{}{
		"order_id": orderID,
	}
	return r.hub.PublishEvent(ctx, unitID, "ORDER_CREATED", payload)
}

func (r *RedisBroadcaster) BroadcastOrderStatusUpdated(ctx context.Context, unitID uuid.UUID, orderID uuid.UUID, status string) error {
	payload := map[string]interface{}{
		"order_id": orderID,
		"status":   status,
	}
	return r.hub.PublishEvent(ctx, unitID, "ORDER_STATUS_UPDATED", payload)
}
