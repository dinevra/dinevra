package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"dinevra-backend/internal/domain"
)

type orderRepository struct {
	pool *pgxpool.Pool
}

func NewOrderRepository(pool *pgxpool.Pool) domain.OrderRepository {
	return &orderRepository{pool: pool}
}

func (r *orderRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Order, error) {
	query := `SELECT id, kitchen_id, device_id, user_id, status, total_amount, created_at, updated_at FROM orders WHERE id = $1`
	var order domain.Order
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&order.ID, &order.KitchenID, &order.DeviceID, &order.UserID,
		&order.Status, &order.TotalAmount, &order.CreatedAt, &order.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &order, nil
}

func (r *orderRepository) GetByKitchenID(ctx context.Context, kitchenID uuid.UUID) ([]*domain.Order, error) {
	query := `SELECT id, kitchen_id, device_id, user_id, status, total_amount, created_at, updated_at FROM orders WHERE kitchen_id = $1 ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, query, kitchenID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var orders []*domain.Order
	for rows.Next() {
		var o domain.Order
		err := rows.Scan(
			&o.ID, &o.KitchenID, &o.DeviceID, &o.UserID,
			&o.Status, &o.TotalAmount, &o.CreatedAt, &o.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		orders = append(orders, &o)
	}
	return orders, nil
}

func (r *orderRepository) Create(ctx context.Context, order *domain.Order) error {
	query := `INSERT INTO orders (id, kitchen_id, device_id, user_id, status, total_amount, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := r.pool.Exec(ctx, query, order.ID, order.KitchenID, order.DeviceID, order.UserID, order.Status, order.TotalAmount, order.CreatedAt, order.UpdatedAt)
	return err
}

func (r *orderRepository) UpdateStatus(ctx context.Context, id uuid.UUID, status string) error {
	query := `UPDATE orders SET status = $1, updated_at = NOW() WHERE id = $2`
	_, err := r.pool.Exec(ctx, query, status, id)
	return err
}
