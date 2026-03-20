package domain

import (
	"time"

	"github.com/google/uuid"
)

type Order struct {
	ID          uuid.UUID   `json:"id" db:"id"`
	UnitID      *uuid.UUID  `json:"unit_id" db:"unit_id"`
	DeviceID    *uuid.UUID  `json:"device_id" db:"device_id"`
	UserID      *uuid.UUID  `json:"user_id" db:"user_id"`
	Status      string      `json:"status" db:"status"` // 'new', 'preparing', 'ready', 'completed', 'cancelled'
	TotalAmount float64     `json:"total_amount" db:"total_amount"`
	CreatedAt   time.Time   `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time   `json:"updated_at" db:"updated_at"`
	Items       []OrderItem `json:"items,omitempty"`
}

type OrderItem struct {
	ID        uuid.UUID `json:"id" db:"id"`
	OrderID   uuid.UUID `json:"order_id" db:"order_id"`
	ItemID    uuid.UUID `json:"item_id" db:"item_id"`
	Quantity  int       `json:"quantity" db:"quantity"`
	UnitPrice float64   `json:"unit_price" db:"unit_price"`
	Notes     string    `json:"notes" db:"notes"`
}
