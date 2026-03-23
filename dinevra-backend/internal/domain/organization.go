package domain

import (
	"time"

	"github.com/google/uuid"
)

// Organization represents the highest level multi-tenant entity
type Organization struct {
	ID                     uuid.UUID `json:"id" db:"id"`
	Name                   string    `json:"name" db:"name"`
	LegalName              *string   `json:"legal_name,omitempty" db:"legal_name"`
	BrandName              *string   `json:"brand_name,omitempty" db:"brand_name"`
	BusinessType           *string   `json:"business_type,omitempty" db:"business_type"`
	FacilityType           string    `json:"facility_type" db:"facility_type"` 
	DefaultCountry         *string   `json:"default_country,omitempty" db:"default_country"`
	DefaultCurrency        *string   `json:"default_currency,omitempty" db:"default_currency"`
	DefaultTimezone        *string   `json:"default_timezone,omitempty" db:"default_timezone"`
	DefaultLanguage        *string   `json:"default_language,omitempty" db:"default_language"`
	IsMultilanguageEnabled bool      `json:"is_multilanguage_enabled" db:"is_multilanguage_enabled"`
	Status                 string    `json:"status" db:"status"` // e.g., 'active', 'suspended'
	CreatedAt              time.Time `json:"created_at" db:"created_at"`
	UpdatedAt              time.Time `json:"updated_at" db:"updated_at"`
}

// CreateOrganizationRequest validates incoming REST payloads
type CreateOrganizationRequest struct {
	Name                   string  `json:"name" binding:"required"`
	LegalName              string  `json:"legal_name"`
	BrandName              string  `json:"brand_name"`
	BusinessType           string  `json:"business_type" binding:"required"`
	FacilityType           string  `json:"facility_type" binding:"required"`
	DefaultCountry         string  `json:"default_country" binding:"required"`
	DefaultCurrency        string  `json:"default_currency" binding:"required"`
	DefaultTimezone        string  `json:"default_timezone" binding:"required"`
	DefaultLanguage        string  `json:"default_language"`
	IsMultilanguageEnabled bool    `json:"is_multilanguage_enabled"`
}

// UpdateOrganizationRequest validates PATCH requests safely
type UpdateOrganizationRequest struct {
	Name                   *string `json:"name"`
	LegalName              *string `json:"legal_name"`
	BrandName              *string `json:"brand_name"`
	BusinessType           *string `json:"business_type"`
	DefaultCountry         *string `json:"default_country"`
	DefaultCurrency        *string `json:"default_currency"`
	DefaultTimezone        *string `json:"default_timezone"`
	DefaultLanguage        *string `json:"default_language"`
	IsMultilanguageEnabled *bool   `json:"is_multilanguage_enabled"`
	Status                 *string `json:"status"`
}
