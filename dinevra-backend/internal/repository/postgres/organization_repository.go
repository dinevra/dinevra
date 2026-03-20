package postgres

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
	"dinevra-backend/internal/domain"
)

type organizationRepository struct {
	pool *pgxpool.Pool
}

func NewOrganizationRepository(pool *pgxpool.Pool) domain.OrganizationRepository {
	return &organizationRepository{pool: pool}
}

func (r *organizationRepository) Create(ctx context.Context, org *domain.Organization) error {
	query := `INSERT INTO organizations (id, name, facility_type, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5)`
	_, err := r.pool.Exec(ctx, query, org.ID, org.Name, org.FacilityType, org.CreatedAt, org.UpdatedAt)
	return err
}

func (r *organizationRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Organization, error) {
	query := `SELECT id, name, facility_type, created_at, updated_at FROM organizations WHERE id = $1`
	var org domain.Organization
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&org.ID, &org.Name, &org.FacilityType, &org.CreatedAt, &org.UpdatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &org, nil
}

// Ensure compile (unused field suppression)
var _ = time.Now
