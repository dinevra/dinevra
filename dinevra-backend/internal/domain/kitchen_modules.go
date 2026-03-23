package domain

import (
	"time"

	"github.com/google/uuid"
)

// KitchenMealPlan dictates subscription capabilities strictly confined to a single Kitchen perimeter
type KitchenMealPlan struct {
	ID           uuid.UUID `json:"id" db:"id"`
	KitchenID    uuid.UUID `json:"kitchen_id" db:"kitchen_id"`
	Name         string    `json:"name" db:"name"`
	Description  *string   `json:"description,omitempty" db:"description"`
	Price        float64   `json:"price" db:"price"`
	ValidityDays *int      `json:"validity_days,omitempty" db:"validity_days"`
	Status       string    `json:"status" db:"status"`
	CreatedAt    time.Time `json:"created_at" db:"created_at"`
	UpdatedAt    time.Time `json:"updated_at" db:"updated_at"`
}

// KitchenWalletConfig orchestrates direct cash-load limits and balances per kitchen scope
type KitchenWalletConfig struct {
	ID              uuid.UUID `json:"id" db:"id"`
	KitchenID       uuid.UUID `json:"kitchen_id" db:"kitchen_id"`
	IsWalletEnabled bool      `json:"is_wallet_enabled" db:"is_wallet_enabled"`
	MaxBalance      *float64  `json:"max_balance,omitempty" db:"max_balance"`
	MinReload       *float64  `json:"min_reload,omitempty" db:"min_reload"`
	MaxReload       *float64  `json:"max_reload,omitempty" db:"max_reload"`
	BonusPercentage float64   `json:"bonus_percentage" db:"bonus_percentage"`
	CreatedAt       time.Time `json:"created_at" db:"created_at"`
	UpdatedAt       time.Time `json:"updated_at" db:"updated_at"`
}

// KitchenTokenConfig controls virtualized digital currencies confined securely inside one Kitchen perimeter
type KitchenTokenConfig struct {
	ID                uuid.UUID `json:"id" db:"id"`
	KitchenID         uuid.UUID `json:"kitchen_id" db:"kitchen_id"`
	AreTokensEnabled  bool      `json:"are_tokens_enabled" db:"are_tokens_enabled"`
	TokenCurrencyName string    `json:"token_currency_name" db:"token_currency_name"`
	ExchangeRate      float64   `json:"exchange_rate" db:"exchange_rate"`
	CreatedAt         time.Time `json:"created_at" db:"created_at"`
	UpdatedAt         time.Time `json:"updated_at" db:"updated_at"`
}

// --- DTO Interfaces ---

type CreateKitchenMealPlanRequest struct {
	KitchenID    uuid.UUID `json:"kitchen_id" binding:"required"`
	Name         string    `json:"name" binding:"required"`
	Description  string    `json:"description"`
	Price        float64   `json:"price" binding:"required,min=0"`
	ValidityDays *int      `json:"validity_days" binding:"omitempty,min=1"`
}

type UpdateKitchenWalletConfigRequest struct {
	KitchenID       uuid.UUID `json:"kitchen_id" binding:"required"`
	IsWalletEnabled *bool     `json:"is_wallet_enabled"`
	MaxBalance      *float64  `json:"max_balance"`
	MinReload       *float64  `json:"min_reload"`
	MaxReload       *float64  `json:"max_reload"`
	BonusPercentage *float64  `json:"bonus_percentage"`
}

type UpdateKitchenTokenConfigRequest struct {
	KitchenID         uuid.UUID `json:"kitchen_id" binding:"required"`
	AreTokensEnabled  *bool     `json:"are_tokens_enabled"`
	TokenCurrencyName *string   `json:"token_currency_name"`
	ExchangeRate      *float64  `json:"exchange_rate" binding:"omitempty,min=0.01"`
}
