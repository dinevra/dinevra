package domain

import (
	"context"

	"github.com/google/uuid"
)

type UserRepository interface {
	GetByID(ctx context.Context, id uuid.UUID) (*User, error)
	GetByEmail(ctx context.Context, email string) (*User, error)
	Create(ctx context.Context, user *User) error
	UpdateLastLogin(ctx context.Context, id uuid.UUID) error
}

type OrderRepository interface {
	GetByID(ctx context.Context, id uuid.UUID) (*Order, error)
	GetByKitchenID(ctx context.Context, kitchenID uuid.UUID) ([]*Order, error)
	Create(ctx context.Context, order *Order) error
	UpdateStatus(ctx context.Context, id uuid.UUID, status string) error
}

type DeviceRepository interface {
	GetByID(ctx context.Context, id uuid.UUID) (*Device, error)
	Create(ctx context.Context, device *Device) error
	UpdateCurrentKitchen(ctx context.Context, id uuid.UUID, kitchenID uuid.UUID) error
}

type OrganizationRepository interface {
	Create(ctx context.Context, org *Organization) error
	GetByID(ctx context.Context, id uuid.UUID) (*Organization, error)
}
