package domain

import (
	"time"

	"github.com/google/uuid"
)

// Location defines a physical regional entity bound to an Organization
type Location struct {
	ID                      uuid.UUID  `json:"id" db:"id"`
	OrganizationID          uuid.UUID  `json:"organization_id" db:"organization_id"`
	Name                    string     `json:"name" db:"name"`
	Code                    *string    `json:"code,omitempty" db:"code"`
	Type                    *string    `json:"type,omitempty" db:"type"`
	AddressLine1            string     `json:"address_line1" db:"address_line1"`
	AddressLine2            *string    `json:"address_line2,omitempty" db:"address_line2"`
	Landmark                *string    `json:"landmark,omitempty" db:"landmark"`
	City                    string     `json:"city" db:"city"`
	State                   *string    `json:"state,omitempty" db:"state"`
	PostalCode              *string    `json:"postal_code,omitempty" db:"postal_code"`
	Country                 string     `json:"country" db:"country"`
	Timezone                *string    `json:"timezone,omitempty" db:"timezone"`
	Currency                *string    `json:"currency,omitempty" db:"currency"`
	Languages               []string   `json:"languages,omitempty" db:"languages"`
	DateFormat              *string    `json:"date_format,omitempty" db:"date_format"`
	TimeFormat              *string    `json:"time_format,omitempty" db:"time_format"`
	WeekStartDay            *int       `json:"week_start_day,omitempty" db:"week_start_day"` // 0 = Sunday, 1 = Monday
	ContactName             *string    `json:"contact_name,omitempty" db:"contact_name"`
	ContactEmail            *string    `json:"contact_email,omitempty" db:"contact_email"`
	ContactPhone            *string    `json:"contact_phone,omitempty" db:"contact_phone"`
	OpeningDate             *time.Time `json:"opening_date,omitempty" db:"opening_date"`
	TaxRegion               *string    `json:"tax_region,omitempty" db:"tax_region"`
	SupportsPickup          bool       `json:"supports_pickup" db:"supports_pickup"`
	SupportsDelivery        bool       `json:"supports_delivery" db:"supports_delivery"`
	SupportsDineIn          bool       `json:"supports_dine_in" db:"supports_dine_in"`
	SupportsPreOrder        bool       `json:"supports_pre_order" db:"supports_pre_order"`
	SupportsSameDayOrdering bool       `json:"supports_same_day_ordering" db:"supports_same_day_ordering"`
	Latitude                *float64   `json:"latitude,omitempty" db:"latitude"`
	Longitude               *float64   `json:"longitude,omitempty" db:"longitude"`
	Status                  string     `json:"status" db:"status"`
	CreatedAt               time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt               time.Time  `json:"updated_at" db:"updated_at"`
}

// CreateLocationRequest handles standard POST requests safely validating needed keys
type CreateLocationRequest struct {
	OrganizationID          uuid.UUID  `json:"organization_id" binding:"required"`
	Name                    string     `json:"name" binding:"required"`
	Code                    string     `json:"code"`
	Type                    string     `json:"type"`
	AddressLine1            string     `json:"address_line1" binding:"required"`
	AddressLine2            string     `json:"address_line2"`
	Landmark                string     `json:"landmark"`
	City                    string     `json:"city" binding:"required"`
	State                   string     `json:"state"`
	PostalCode              string     `json:"postal_code"`
	Country                 string     `json:"country" binding:"required"`
	Timezone                string     `json:"timezone"`
	Currency                string     `json:"currency"`
	Languages               []string   `json:"languages"`
	DateFormat              string     `json:"date_format"`
	TimeFormat              string     `json:"time_format"`
	WeekStartDay            *int       `json:"week_start_day"`
	ContactName             string     `json:"contact_name"`
	ContactEmail            string     `json:"contact_email" binding:"omitempty,email"`
	ContactPhone            string     `json:"contact_phone"`
	OpeningDate             *time.Time `json:"opening_date"`
	TaxRegion               string     `json:"tax_region"`
	SupportsPickup          *bool      `json:"supports_pickup"`
	SupportsDelivery        *bool      `json:"supports_delivery"`
	SupportsDineIn          *bool      `json:"supports_dine_in"`
	SupportsPreOrder        *bool      `json:"supports_pre_order"`
	SupportsSameDayOrdering *bool      `json:"supports_same_day_ordering"`
	Latitude                *float64   `json:"latitude"`
	Longitude               *float64   `json:"longitude"`
}

// UpdateLocationRequest validates PATCH style requests modifying explicit location criteria
type UpdateLocationRequest struct {
	Name                    *string    `json:"name"`
	Code                    *string    `json:"code"`
	Type                    *string    `json:"type"`
	AddressLine1            *string    `json:"address_line1"`
	AddressLine2            *string    `json:"address_line2"`
	Landmark                *string    `json:"landmark"`
	City                    *string    `json:"city"`
	State                   *string    `json:"state"`
	PostalCode              *string    `json:"postal_code"`
	Country                 *string    `json:"country"`
	Timezone                *string    `json:"timezone"`
	Currency                *string    `json:"currency"`
	Languages               []string   `json:"languages"`
	DateFormat              *string    `json:"date_format"`
	TimeFormat              *string    `json:"time_format"`
	WeekStartDay            *int       `json:"week_start_day"`
	ContactName             *string    `json:"contact_name"`
	ContactEmail            *string    `json:"contact_email" binding:"omitempty,email"`
	ContactPhone            *string    `json:"contact_phone"`
	OpeningDate             *time.Time `json:"opening_date"`
	TaxRegion               *string    `json:"tax_region"`
	SupportsPickup          *bool      `json:"supports_pickup"`
	SupportsDelivery        *bool      `json:"supports_delivery"`
	SupportsDineIn          *bool      `json:"supports_dine_in"`
	SupportsPreOrder        *bool      `json:"supports_pre_order"`
	SupportsSameDayOrdering *bool      `json:"supports_same_day_ordering"`
	Latitude                *float64   `json:"latitude"`
	Longitude               *float64   `json:"longitude"`
	Status                  *string    `json:"status"`
}
