package usecase

import (
	"context"

	"github.com/google/uuid"
)

type EventBroadcaster interface {
	BroadcastOrderCreated(ctx context.Context, kitchenID uuid.UUID, orderID uuid.UUID) error
	BroadcastOrderStatusUpdated(ctx context.Context, kitchenID uuid.UUID, orderID uuid.UUID, status string) error
}
