package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID             uuid.UUID `json:"id" db:"id"`
	OrganizationID uuid.UUID `json:"org_id" db:"org_id"`
	Email          string    `json:"email" db:"email"`
	PasswordHash   string    `json:"-" db:"password_hash"`
	PinHash        string    `json:"-" db:"pin_hash"`
	CreatedAt      time.Time `json:"created_at" db:"created_at"`
}

type UserKitchenAccess struct {
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	KitchenID uuid.UUID `json:"kitchen_id" db:"kitchen_id"`
	Role      string    `json:"role" db:"role"`
}
