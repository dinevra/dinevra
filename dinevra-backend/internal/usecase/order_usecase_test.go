package usecase_test

import (
	"context"
	"testing"

	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
	"dinevra-backend/internal/usecase"
)

type mockOrderRepo struct {
	orders map[uuid.UUID]*domain.Order
}

func (m *mockOrderRepo) GetByID(ctx context.Context, id uuid.UUID) (*domain.Order, error) {
	return m.orders[id], nil
}

func (m *mockOrderRepo) GetByUnitID(ctx context.Context, unitID uuid.UUID) ([]*domain.Order, error) {
	return nil, nil
}

func (m *mockOrderRepo) Create(ctx context.Context, order *domain.Order) error {
	m.orders[order.ID] = order
	return nil
}

func (m *mockOrderRepo) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	if _, ok := m.orders[id]; !ok {
		return nil
	}
	m.orders[id].Status = status
	return nil
}

type mockBroadcaster struct{}

func (m *mockBroadcaster) BroadcastOrderCreated(ctx context.Context, unitID uuid.UUID, orderID uuid.UUID) error {
	return nil
}

func (m *mockBroadcaster) BroadcastOrderStatusUpdated(ctx context.Context, unitID uuid.UUID, orderID uuid.UUID, status string) error {
	return nil
}

func TestOrderUsecase_CreateOrder(t *testing.T) {
	repo := &mockOrderRepo{orders: make(map[uuid.UUID]*domain.Order)}
	broadcaster := &mockBroadcaster{}
	uc := usecase.NewOrderUsecase(repo, broadcaster)

	unitID := uuid.New()
	order := &domain.Order{
		UnitID:      &unitID,
		TotalAmount: 15.50,
	}

	err := uc.CreateOrder(context.Background(), order)
	if err != nil {
		t.Fatalf("expected no error, got %v", err)
	}

	if order.Status != "new" {
		t.Errorf("expected status new, got %s", order.Status)
	}

	if order.CreatedAt.IsZero() {
		t.Errorf("expected created_at to be set")
	}

	savedOrder := repo.orders[order.ID]
	if savedOrder == nil {
		t.Fatalf("expected order to be saved in repository")
	}
}

func TestOrderUsecase_CreateOrder_InvalidAmount(t *testing.T) {
	repo := &mockOrderRepo{orders: make(map[uuid.UUID]*domain.Order)}
	uc := usecase.NewOrderUsecase(repo, &mockBroadcaster{})

	order := &domain.Order{
		TotalAmount: 0,
	}

	err := uc.CreateOrder(context.Background(), order)
	if err == nil {
		t.Fatalf("expected error for invalid amount, got nil")
	}
}
