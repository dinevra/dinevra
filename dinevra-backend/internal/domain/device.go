package domain

import (
	"time"

	"github.com/google/uuid"
)

type Device struct {
	ID               uuid.UUID  `json:"id" db:"id"`
	OrganizationID   uuid.UUID  `json:"org_id" db:"org_id"`
	Mode             string     `json:"mode" db:"mode"` // 'fixed' or 'flexible'
	FixedUnitID   *uuid.UUID `json:"fixed_unit_id" db:"fixed_unit_id"`
	CurrentUnitID *uuid.UUID `json:"current_unit_id" db:"current_unit_id"`
	Status           string     `json:"status" db:"status"` // 'offline', 'online'
	CreatedAt        time.Time  `json:"created_at" db:"created_at"`
}
