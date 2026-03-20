package domain

import (
	"time"

	"github.com/google/uuid"
)

type Payment struct {
	ID                  uuid.UUID `json:"id" db:"id"`
	OrderID             uuid.UUID `json:"order_id" db:"order_id"`
	Amount              float64   `json:"amount" db:"amount"`
	Method              string    `json:"method" db:"method"` // 'card', 'dining_dollars', 'meal_plan', 'cash'
	Status              string    `json:"status" db:"status"` // 'pending', 'processing', 'succeeded', 'failed'
	ExternalReferenceID *string   `json:"external_reference_id" db:"external_reference_id"` // Stripe PaymentIntent ID
	CreatedAt           time.Time `json:"created_at" db:"created_at"`
}

type Wallet struct {
	ID        uuid.UUID `json:"id" db:"id"`
	UserID    uuid.UUID `json:"user_id" db:"user_id"`
	Type      string    `json:"type" db:"type"` // 'dining_dollars', 'meal_plan'
	Balance   float64   `json:"balance" db:"balance"`
	CreatedAt time.Time `json:"created_at" db:"created_at"`
}

type Transaction struct {
	ID            uuid.UUID  `json:"id" db:"id"`
	WalletID      uuid.UUID  `json:"wallet_id" db:"wallet_id"`
	Amount        float64    `json:"amount" db:"amount"`
	Type          string     `json:"type" db:"type"`           // 'credit', 'debit'
	ReferenceType string     `json:"reference_type" db:"reference_type"` // 'order', 'reload'
	ReferenceID   *uuid.UUID `json:"reference_id" db:"reference_id"`
	CreatedAt     time.Time  `json:"created_at" db:"created_at"`
}
