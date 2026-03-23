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

func (r *kitchenRepository) Create(ctx context.Context, kitchen *domain.Kitchen) error {
	query := `INSERT INTO kitchens (id, location_id, name, created_at)
			  VALUES ($1, $2, $3, $4)`
	_, err := r.pool.Exec(ctx, query, kitchen.ID, kitchen.LocationID, kitchen.Name, kitchen.CreatedAt)
	return err
}

func (r *kitchenRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Kitchen, error) {
	query := `SELECT id, location_id, name, created_at FROM kitchens WHERE id = $1`
	var k domain.Kitchen
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&k.ID, &k.LocationID, &k.Name, &k.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &k, nil
}

func (r *kitchenRepository) GetByLocationID(ctx context.Context, locationID uuid.UUID) ([]*domain.Kitchen, error) {
	query := `SELECT id, location_id, name, created_at FROM kitchens WHERE location_id = $1 ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, query, locationID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var kitchens []*domain.Kitchen
	for rows.Next() {
		var k domain.Kitchen
		if err := rows.Scan(&k.ID, &k.LocationID, &k.Name, &k.CreatedAt); err != nil {
			return nil, err
		}
		kitchens = append(kitchens, &k)
	}
	return kitchens, nil
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
