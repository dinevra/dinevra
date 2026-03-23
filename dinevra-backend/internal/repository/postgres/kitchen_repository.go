package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"dinevra-backend/internal/domain"
)

type kitchenRepository struct {
	pool *pgxpool.Pool
}

func NewKitchenRepository(pool *pgxpool.Pool) domain.KitchenRepository {
	return &kitchenRepository{pool: pool}
}

func (r *kitchenRepository) Create(ctx context.Context, k *domain.Kitchen) error {
	query := `INSERT INTO kitchens (
		id, location_id, name, code, display_name, type, prep_type, 
		capacity_per_slot, avg_prep_time_mins, buffer_time_mins, max_concurrent_orders, 
		priority, supports_pickup, supports_delivery, supports_dine_in, 
		supports_scheduled_orders, supports_instant_orders, visible_to_customers, 
		internal_only, kitchen_login_enabled, require_pin_login, 
		device_restriction_enabled, status, created_at, updated_at
	) VALUES (
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, 
		$18, $19, $20, $21, $22, $23, $24, $25
	)`
	_, err := r.pool.Exec(ctx, query,
		k.ID, k.LocationID, k.Name, k.Code, k.DisplayName, k.Type, k.PrepType,
		k.CapacityPerSlot, k.AvgPrepTimeMins, k.BufferTimeMins, k.MaxConcurrentOrders,
		k.Priority, k.SupportsPickup, k.SupportsDelivery, k.SupportsDineIn,
		k.SupportsScheduledOrders, k.SupportsInstantOrders, k.VisibleToCustomers,
		k.InternalOnly, k.KitchenLoginEnabled, k.RequirePinLogin,
		k.DeviceRestrictionEnabled, k.Status, k.CreatedAt, k.UpdatedAt,
	)
	return err
}

func (r *kitchenRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Kitchen, error) {
	query := `SELECT 
		id, location_id, name, code, display_name, type, prep_type, 
		capacity_per_slot, avg_prep_time_mins, buffer_time_mins, max_concurrent_orders, 
		priority, supports_pickup, supports_delivery, supports_dine_in, 
		supports_scheduled_orders, supports_instant_orders, visible_to_customers, 
		internal_only, kitchen_login_enabled, require_pin_login, 
		device_restriction_enabled, status, created_at, updated_at
	FROM kitchens WHERE id = $1`
	
	var k domain.Kitchen
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&k.ID, &k.LocationID, &k.Name, &k.Code, &k.DisplayName, &k.Type, &k.PrepType,
		&k.CapacityPerSlot, &k.AvgPrepTimeMins, &k.BufferTimeMins, &k.MaxConcurrentOrders,
		&k.Priority, &k.SupportsPickup, &k.SupportsDelivery, &k.SupportsDineIn,
		&k.SupportsScheduledOrders, &k.SupportsInstantOrders, &k.VisibleToCustomers,
		&k.InternalOnly, &k.KitchenLoginEnabled, &k.RequirePinLogin,
		&k.DeviceRestrictionEnabled, &k.Status, &k.CreatedAt, &k.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &k, nil
}

func (r *kitchenRepository) GetByLocationID(ctx context.Context, locationID uuid.UUID) ([]*domain.Kitchen, error) {
	query := `SELECT 
		id, location_id, name, code, display_name, type, prep_type, 
		capacity_per_slot, avg_prep_time_mins, buffer_time_mins, max_concurrent_orders, 
		priority, supports_pickup, supports_delivery, supports_dine_in, 
		supports_scheduled_orders, supports_instant_orders, visible_to_customers, 
		internal_only, kitchen_login_enabled, require_pin_login, 
		device_restriction_enabled, status, created_at, updated_at
	FROM kitchens WHERE location_id = $1 AND status != 'deleted' ORDER BY priority DESC, name ASC`
	
	rows, err := r.pool.Query(ctx, query, locationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var kitchens []*domain.Kitchen
	for rows.Next() {
		var k domain.Kitchen
		err := rows.Scan(
			&k.ID, &k.LocationID, &k.Name, &k.Code, &k.DisplayName, &k.Type, &k.PrepType,
			&k.CapacityPerSlot, &k.AvgPrepTimeMins, &k.BufferTimeMins, &k.MaxConcurrentOrders,
			&k.Priority, &k.SupportsPickup, &k.SupportsDelivery, &k.SupportsDineIn,
			&k.SupportsScheduledOrders, &k.SupportsInstantOrders, &k.VisibleToCustomers,
			&k.InternalOnly, &k.KitchenLoginEnabled, &k.RequirePinLogin,
			&k.DeviceRestrictionEnabled, &k.Status, &k.CreatedAt, &k.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		kitchens = append(kitchens, &k)
	}
	return kitchens, nil
}

func (r *kitchenRepository) Update(ctx context.Context, k *domain.Kitchen) error {
	query := `UPDATE kitchens SET 
		name = $1, code = $2, display_name = $3, type = $4, prep_type = $5, 
		capacity_per_slot = $6, avg_prep_time_mins = $7, buffer_time_mins = $8, 
		max_concurrent_orders = $9, priority = $10, supports_pickup = $11, 
		supports_delivery = $12, supports_dine_in = $13, supports_scheduled_orders = $14, 
		supports_instant_orders = $15, visible_to_customers = $16, internal_only = $17, 
		kitchen_login_enabled = $18, require_pin_login = $19, 
		device_restriction_enabled = $20, status = $21, updated_at = NOW()
	WHERE id = $22`
	
	_, err := r.pool.Exec(ctx, query,
		k.Name, k.Code, k.DisplayName, k.Type, k.PrepType,
		k.CapacityPerSlot, k.AvgPrepTimeMins, k.BufferTimeMins, k.MaxConcurrentOrders,
		k.Priority, k.SupportsPickup, k.SupportsDelivery, k.SupportsDineIn,
		k.SupportsScheduledOrders, k.SupportsInstantOrders, k.VisibleToCustomers,
		k.InternalOnly, k.KitchenLoginEnabled, k.RequirePinLogin,
		k.DeviceRestrictionEnabled, k.Status, k.ID,
	)
	return err
}

func (r *kitchenRepository) Delete(ctx context.Context, id uuid.UUID) error {
	// Soft delete for kitchens
	query := `UPDATE kitchens SET status = 'inactive', updated_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, query, id)
	return err
}

func (r *kitchenRepository) GetByCode(ctx context.Context, locationID uuid.UUID, code string) (*domain.Kitchen, error) {
	query := `SELECT id, location_id, name, code, status FROM kitchens WHERE location_id = $1 AND code = $2`
	var k domain.Kitchen
	err := r.pool.QueryRow(ctx, query, locationID, code).Scan(
		&k.ID, &k.LocationID, &k.Name, &k.Code, &k.Status,
	)
	if err != nil {
		if err.Error() == "no rows in result set" {
			return nil, nil
		}
		return nil, err
	}
	return &k, nil
}

func (r *kitchenRepository) UpdateConfiguration(ctx context.Context, config *domain.KitchenConfiguration) error {
	query := `
		INSERT INTO kitchen_configurations (kitchen_id, is_open, cart_message, currency, timezone, language, created_at, updated_at)
		VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
		ON CONFLICT (kitchen_id) 
		DO UPDATE SET 
			is_open = EXCLUDED.is_open,
			cart_message = EXCLUDED.cart_message,
			currency = EXCLUDED.currency,
			timezone = EXCLUDED.timezone,
			language = EXCLUDED.language,
			updated_at = NOW()
	`
	_, err := r.pool.Exec(ctx, query, config.KitchenID, config.IsOpen, config.CartMessage, config.Currency, config.Timezone, config.Language)
	return err
}

func (r *kitchenRepository) UpdateStatus(ctx context.Context, kitchenID uuid.UUID, isOpen bool) error {
	query := `
		UPDATE kitchen_configurations 
		SET is_open = $1, updated_at = NOW() 
		WHERE kitchen_id = $2
	`
	_, err := r.pool.Exec(ctx, query, isOpen, kitchenID)
	return err
}
