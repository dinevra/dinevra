package domain

import (
	"time"

	"github.com/google/uuid"
)

type Organization struct {
	ID        uuid.UUID `json:"id" db:"id"`
	Name      string    `json:"name" db:"name"`
	Sector    string    `json:"sector" db:"sector"` // 'RESTAURANT', 'CAMPUS', 'HEALTHCARE', 'GYM', 'CORPORATE'
	CreatedAt time.Time `json:"created_at" db:"created_at"`
	UpdatedAt time.Time `json:"updated_at" db:"updated_at"`
}

type Location struct {
	ID             uuid.UUID `json:"id" db:"id"`
	OrganizationID uuid.UUID `json:"org_id" db:"org_id"`
	Name           string    `json:"name" db:"name"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
}

type Unit struct {
	ID         uuid.UUID `json:"id" db:"id"`
	LocationID uuid.UUID `json:"location_id" db:"location_id"`
	Name       string    `json:"name" db:"name"`
	Type       string    `json:"type" db:"type"` // 'KITCHEN', 'BAR', 'RECEPTION', 'PHARMACY', etc.
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}
