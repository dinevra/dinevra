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

type LocationRepository interface {
	Create(ctx context.Context, location *Location) error
	GetByID(ctx context.Context, id uuid.UUID) (*Location, error)
	GetByOrganizationID(ctx context.Context, orgID uuid.UUID) ([]*Location, error)
	Update(ctx context.Context, location *Location) error
	Delete(ctx context.Context, id uuid.UUID) error
	List(ctx context.Context, orgID uuid.UUID, country, city, status string) ([]*Location, error)
	GetByCode(ctx context.Context, orgID uuid.UUID, code string) (*Location, error)
}

type KitchenRepository interface {
	Create(ctx context.Context, kitchen *Kitchen) error
	GetByID(ctx context.Context, id uuid.UUID) (*Kitchen, error)
	GetByLocationID(ctx context.Context, locationID uuid.UUID) ([]*Kitchen, error)
	Update(ctx context.Context, kitchen *Kitchen) error
	Delete(ctx context.Context, id uuid.UUID) error
	GetByCode(ctx context.Context, locationID uuid.UUID, code string) (*Kitchen, error)
	
	// Configuration
	UpdateConfiguration(ctx context.Context, config *KitchenConfiguration) error
	GetConfiguration(ctx context.Context, kitchenID uuid.UUID) (*KitchenConfiguration, error)
	UpdateStatus(ctx context.Context, kitchenID uuid.UUID, isOpen bool, reason *string, changedBy uuid.UUID) error
}
