package usecase

import (
	"context"
	"fmt"
	"time"

	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
)

type OrderUsecase interface {
	CreateOrder(ctx context.Context, order *domain.Order) error
	GetOrdersByKitchen(ctx context.Context, kitchenID uuid.UUID) ([]*domain.Order, error)
	AdvanceOrderStatus(ctx context.Context, orderID uuid.UUID) error
}

type orderUsecase struct {
	orderRepo   domain.OrderRepository
	broadcaster EventBroadcaster
}

func NewOrderUsecase(orderRepo domain.OrderRepository, broadcaster EventBroadcaster) OrderUsecase {
	return &orderUsecase{
		orderRepo:   orderRepo,
		broadcaster: broadcaster,
	}
}

func (u *orderUsecase) CreateOrder(ctx context.Context, order *domain.Order) error {
	order.ID = uuid.New()
	order.Status = "new"
	order.CreatedAt = time.Now()
	order.UpdatedAt = time.Now()

	// Simple validation
	if order.TotalAmount <= 0 {
		return fmt.Errorf("order amount must be greater than 0")
	}

	if err := u.orderRepo.Create(ctx, order); err != nil {
		return err
	}

	// Broadcast the new order to KDS devices in real-time
	if u.broadcaster != nil && order.KitchenID != nil {
		_ = u.broadcaster.BroadcastOrderCreated(ctx, *order.KitchenID, order.ID)
	}
	return nil
}

func (u *orderUsecase) GetOrdersByKitchen(ctx context.Context, kitchenID uuid.UUID) ([]*domain.Order, error) {
	return u.orderRepo.GetByKitchenID(ctx, kitchenID)
}

func (u *orderUsecase) AdvanceOrderStatus(ctx context.Context, orderID uuid.UUID) error {
	order, err := u.orderRepo.GetByID(ctx, orderID)
	if err != nil {
		return fmt.Errorf("failed to get order: %w", err)
	}
	if order == nil {
		return fmt.Errorf("order not found")
	}

	var nextStatus string
	switch order.Status {
	case "new":
		nextStatus = "preparing"
	case "preparing":
		nextStatus = "ready"
	case "ready":
		nextStatus = "completed"
	default:
		return fmt.Errorf("cannot advance order in status: %s", order.Status)
	}

	if err := u.orderRepo.UpdateStatus(ctx, orderID, nextStatus); err != nil {
		return err
	}

	if u.broadcaster != nil && order.KitchenID != nil {
		_ = u.broadcaster.BroadcastOrderStatusUpdated(ctx, *order.KitchenID, order.ID, nextStatus)
	}
	return nil
}
