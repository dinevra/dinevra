package postgres

import (
	"context"

	"github.com/google/uuid"
	"github.com/jackc/pgx/v5/pgxpool"
	"dinevra-backend/internal/domain"
)

type locationRepository struct {
	pool *pgxpool.Pool
}

func NewLocationRepository(pool *pgxpool.Pool) domain.LocationRepository {
	return &locationRepository{pool: pool}
}

func (r *locationRepository) Create(ctx context.Context, location *domain.Location) error {
	query := `INSERT INTO locations (id, organization_id, name, address_line1, city, country, created_at, updated_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := r.pool.Exec(ctx, query, location.ID, location.OrganizationID, location.Name, location.AddressLine1, location.City, location.Country, location.CreatedAt, location.UpdatedAt)
	return err
}

func (r *locationRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Location, error) {
	query := `SELECT id, organization_id, name, address_line1, city, country, created_at, updated_at FROM locations WHERE id = $1`
	var loc domain.Location
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&loc.ID, &loc.OrganizationID, &loc.Name, &loc.AddressLine1, &loc.City, &loc.Country, &loc.CreatedAt, &loc.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &loc, nil
}

func (r *locationRepository) GetByOrganizationID(ctx context.Context, orgID uuid.UUID) ([]*domain.Location, error) {
	query := `SELECT id, organization_id, name, address_line1, city, country, created_at, updated_at FROM locations WHERE organization_id = $1 ORDER BY created_at DESC`
	rows, err := r.pool.Query(ctx, query, orgID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var locations []*domain.Location
	for rows.Next() {
		var loc domain.Location
		if err := rows.Scan(&loc.ID, &loc.OrganizationID, &loc.Name, &loc.AddressLine1, &loc.City, &loc.Country, &loc.CreatedAt, &loc.UpdatedAt); err != nil {
			return nil, err
		}
		locations = append(locations, &loc)
	}
	return locations, nil
}
