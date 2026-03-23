package domain

import (
	"time"

	"github.com/google/uuid"
)

type Kitchen struct {
	ID         uuid.UUID `json:"id" db:"id"`
	LocationID uuid.UUID `json:"location_id" db:"location_id"`
	Name       string    `json:"name" db:"name"`
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

type KitchenConfiguration struct {
	KitchenID   uuid.UUID `json:"kitchen_id" db:"kitchen_id"`
	IsOpen      bool      `json:"is_open" db:"is_open"`
	CartMessage string    `json:"cart_message" db:"cart_message"`
	Currency    string    `json:"currency" db:"currency"`
	Timezone    string    `json:"timezone" db:"timezone"`
	Language    string    `json:"language" db:"language"`
	CreatedAt   time.Time `json:"created_at" db:"created_at"`
	UpdatedAt   time.Time `json:"updated_at" db:"updated_at"`
}

type KitchenTiming struct {
	ID         uuid.UUID `json:"id" db:"id"`
	KitchenID  uuid.UUID `json:"kitchen_id" db:"kitchen_id"`
	DayOfWeek  int       `json:"day_of_week" db:"day_of_week"`
	SlotName   string    `json:"slot_name" db:"slot_name"`
	OpenTime   string    `json:"open_time" db:"open_time"`   // stored as TIME
	CloseTime  string    `json:"close_time" db:"close_time"` // stored as TIME
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}
