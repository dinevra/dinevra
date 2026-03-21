package domain

import (
	"time"

	"github.com/google/uuid"
)

type User struct {
	ID             uuid.UUID  `json:"id" db:"id"`
	OrganizationID uuid.UUID  `json:"org_id" db:"org_id"`
	Email          string     `json:"email" db:"email"`
	Name           string     `json:"name" db:"name"`
	Role           string     `json:"role" db:"role"` // 'admin', 'manager', 'staff'
	PasswordHash   string     `json:"-" db:"password_hash"`
	PinHash        string     `json:"-" db:"pin_hash"`
	LastLoginAt    *time.Time `json:"last_login_at,omitempty" db:"last_login_at"`
	CreatedAt      time.Time  `json:"created_at" db:"created_at"`
}

type UserUnitAccess struct {
	UserID uuid.UUID `json:"user_id" db:"user_id"`
	UnitID uuid.UUID `json:"unit_id" db:"unit_id"`
	Role   string    `json:"role" db:"role"`
}
