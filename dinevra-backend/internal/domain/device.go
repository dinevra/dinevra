package domain

import (
	"time"

	"github.com/google/uuid"
)

type Device struct {
	ID               uuid.UUID  `json:"id" db:"id"`
	OrganizationID   uuid.UUID  `json:"org_id" db:"org_id"`
	Mode             string     `json:"mode" db:"mode"` // 'fixed' or 'flexible'
	FixedKitchenID   *uuid.UUID `json:"fixed_kitchen_id" db:"fixed_kitchen_id"`
	CurrentKitchenID *uuid.UUID `json:"current_kitchen_id" db:"current_kitchen_id"`
	Status           string     `json:"status" db:"status"` // 'offline', 'online'
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
}
