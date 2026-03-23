package domain

import (
	"time"

	"github.com/google/uuid"
)

// Kitchen represents the functional operational boundary inside a Location
type Kitchen struct {
	ID                       uuid.UUID  `json:"id" db:"id"`
	LocationID               uuid.UUID  `json:"location_id" db:"location_id"`
	Name                     string     `json:"name" db:"name"`
	Code                     *string    `json:"code,omitempty" db:"code"`
	DisplayName              *string    `json:"display_name,omitempty" db:"display_name"`
	Type                     *string    `json:"type,omitempty" db:"type"`
	PrepType                 *string    `json:"prep_type,omitempty" db:"prep_type"`
	CapacityPerSlot          *int       `json:"capacity_per_slot,omitempty" db:"capacity_per_slot"`
	AvgPrepTimeMins          *int       `json:"avg_prep_time_mins,omitempty" db:"avg_prep_time_mins"`
	BufferTimeMins           *int       `json:"buffer_time_mins,omitempty" db:"buffer_time_mins"`
	MaxConcurrentOrders      *int       `json:"max_concurrent_orders,omitempty" db:"max_concurrent_orders"`
	Priority                 int        `json:"priority" db:"priority"`
	SupportsPickup           bool       `json:"supports_pickup" db:"supports_pickup"`
	SupportsDelivery         bool       `json:"supports_delivery" db:"supports_delivery"`
	SupportsDineIn           bool       `json:"supports_dine_in" db:"supports_dine_in"`
	SupportsScheduledOrders  bool       `json:"supports_scheduled_orders" db:"supports_scheduled_orders"`
	SupportsInstantOrders    bool       `json:"supports_instant_orders" db:"supports_instant_orders"`
	VisibleToCustomers       bool       `json:"visible_to_customers" db:"visible_to_customers"`
	InternalOnly             bool       `json:"internal_only" db:"internal_only"`
	KitchenLoginEnabled      bool       `json:"kitchen_login_enabled" db:"kitchen_login_enabled"`
	RequirePinLogin          bool       `json:"require_pin_login" db:"require_pin_login"`
	DeviceRestrictionEnabled bool       `json:"device_restriction_enabled" db:"device_restriction_enabled"`
	Status                   string     `json:"status" db:"status"`
	CreatedAt                time.Time  `json:"created_at" db:"created_at"`
	UpdatedAt                time.Time  `json:"updated_at" db:"updated_at"`
}

// KitchenConfiguration handles the dynamic settings overlay tied 1-1 to a Kitchen
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

// KitchenTimingSlot provides granular sub-day operational windows
type KitchenTimingSlot struct {
	ID         uuid.UUID `json:"id" db:"id"`
	KitchenID  uuid.UUID `json:"kitchen_id" db:"kitchen_id"`
	DayOfWeek  int       `json:"day_of_week" db:"day_of_week"`
	SlotName   string    `json:"slot_name" db:"slot_name"`
	OpenTime   string    `json:"open_time" db:"open_time"`   
	CloseTime  string    `json:"close_time" db:"close_time"` 
	CreatedAt  time.Time `json:"created_at" db:"created_at"`
}

// CreateKitchenRequest validates exact payload for assigning kitchens to locations
type CreateKitchenRequest struct {
	LocationID               uuid.UUID `json:"location_id"`
	Name                     string    `json:"name" binding:"required"`
	Code                     string    `json:"code"`
	DisplayName              string    `json:"display_name"`
	Type                     string    `json:"type"`
	PrepType                 string    `json:"prep_type"`
	CapacityPerSlot          *int      `json:"capacity_per_slot"`
	AvgPrepTimeMins          *int      `json:"avg_prep_time_mins"`
	BufferTimeMins           *int      `json:"buffer_time_mins"`
	MaxConcurrentOrders      *int      `json:"max_concurrent_orders"`
	Priority                 *int      `json:"priority"`
	SupportsPickup           *bool     `json:"supports_pickup"`
	SupportsDelivery         *bool     `json:"supports_delivery"`
	SupportsDineIn           *bool     `json:"supports_dine_in"`
	SupportsScheduledOrders  *bool     `json:"supports_scheduled_orders"`
	SupportsInstantOrders    *bool     `json:"supports_instant_orders"`
	VisibleToCustomers       *bool     `json:"visible_to_customers"`
	InternalOnly             *bool     `json:"internal_only"`
	KitchenLoginEnabled      *bool     `json:"kitchen_login_enabled"`
	RequirePinLogin          *bool     `json:"require_pin_login"`
	DeviceRestrictionEnabled *bool     `json:"device_restriction_enabled"`
}

// UpdateKitchenRequest cleanly handles targeted model overwrites
type UpdateKitchenRequest struct {
	Name                     *string `json:"name"`
	Code                     *string `json:"code"`
	DisplayName              *string `json:"display_name"`
	Type                     *string `json:"type"`
	PrepType                 *string `json:"prep_type"`
	CapacityPerSlot          *int    `json:"capacity_per_slot"`
	AvgPrepTimeMins          *int    `json:"avg_prep_time_mins"`
	BufferTimeMins           *int    `json:"buffer_time_mins"`
	MaxConcurrentOrders      *int    `json:"max_concurrent_orders"`
	Priority                 *int    `json:"priority"`
	SupportsPickup           *bool   `json:"supports_pickup"`
	SupportsDelivery         *bool   `json:"supports_delivery"`
	SupportsDineIn           *bool   `json:"supports_dine_in"`
	SupportsScheduledOrders  *bool   `json:"supports_scheduled_orders"`
	SupportsInstantOrders    *bool   `json:"supports_instant_orders"`
	VisibleToCustomers       *bool   `json:"visible_to_customers"`
	InternalOnly             *bool   `json:"internal_only"`
	KitchenLoginEnabled      *bool   `json:"kitchen_login_enabled"`
	RequirePinLogin          *bool   `json:"require_pin_login"`
	DeviceRestrictionEnabled *bool   `json:"device_restriction_enabled"`
	Status                   *string `json:"status"`
}
