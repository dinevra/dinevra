package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"dinevra-backend/internal/domain"
)

type deviceRepository struct {
	pool *pgxpool.Pool
}

func NewDeviceRepository(pool *pgxpool.Pool) domain.DeviceRepository {
	return &deviceRepository{pool: pool}
}

func (r *deviceRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Device, error) {
	query := `SELECT id, org_id, mode, fixed_kitchen_id, current_kitchen_id, status, created_at FROM devices WHERE id = $1`
	var dev domain.Device
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&dev.ID, &dev.OrganizationID, &dev.Mode, &dev.FixedKitchenID,
		&dev.CurrentKitchenID, &dev.Status, &dev.CreatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &dev, nil
}

func (r *deviceRepository) Create(ctx context.Context, device *domain.Device) error {
	query := `INSERT INTO devices (id, org_id, mode, fixed_kitchen_id, current_kitchen_id, status, created_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7)`
	_, err := r.pool.Exec(ctx, query, device.ID, device.OrganizationID, device.Mode, device.FixedKitchenID, device.CurrentKitchenID, device.Status, device.CreatedAt)
	return err
}

func (r *deviceRepository) UpdateCurrentKitchen(ctx context.Context, id uuid.UUID, kitchenID uuid.UUID) error {
	query := `UPDATE devices SET current_kitchen_id = $1 WHERE id = $2`
	_, err := r.pool.Exec(ctx, query, kitchenID, id)
	return err
}
