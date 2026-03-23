package postgres

import (
	"context"
	"fmt"

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

func (r *locationRepository) Create(ctx context.Context, loc *domain.Location) error {
	query := `INSERT INTO locations (
		id, organization_id, name, code, type, address_line1, address_line2, landmark, city, state, postal_code, country, 
		timezone, currency, languages, date_format, time_format, week_start_day, contact_name, contact_email, contact_phone, 
		opening_date, tax_region, supports_pickup, supports_delivery, supports_dine_in, supports_pre_order, supports_same_day_ordering, 
		latitude, longitude, status, created_at, updated_at
	) VALUES (
		$1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22, $23, $24, $25, $26, $27, $28, $29, $30, $31, $32, $33
	)`
	_, err := r.pool.Exec(ctx, query,
		loc.ID, loc.OrganizationID, loc.Name, loc.Code, loc.Type, loc.AddressLine1, loc.AddressLine2, loc.Landmark, loc.City, loc.State, loc.PostalCode, loc.Country,
		loc.Timezone, loc.Currency, loc.Languages, loc.DateFormat, loc.TimeFormat, loc.WeekStartDay, loc.ContactName, loc.ContactEmail, loc.ContactPhone,
		loc.OpeningDate, loc.TaxRegion, loc.SupportsPickup, loc.SupportsDelivery, loc.SupportsDineIn, loc.SupportsPreOrder, loc.SupportsSameDayOrdering,
		loc.Latitude, loc.Longitude, loc.Status, loc.CreatedAt, loc.UpdatedAt,
	)
	return err
}

func (r *locationRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.Location, error) {
	query := `SELECT 
		id, organization_id, name, code, type, address_line1, address_line2, landmark, city, state, postal_code, country, 
		timezone, currency, languages, date_format, time_format, week_start_day, contact_name, contact_email, contact_phone, 
		opening_date, tax_region, supports_pickup, supports_delivery, supports_dine_in, supports_pre_order, supports_same_day_ordering, 
		latitude, longitude, status, created_at, updated_at 
	FROM locations WHERE id = $1`
	var loc domain.Location
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&loc.ID, &loc.OrganizationID, &loc.Name, &loc.Code, &loc.Type, &loc.AddressLine1, &loc.AddressLine2, &loc.Landmark, &loc.City, &loc.State, &loc.PostalCode, &loc.Country,
		&loc.Timezone, &loc.Currency, &loc.Languages, &loc.DateFormat, &loc.TimeFormat, &loc.WeekStartDay, &loc.ContactName, &loc.ContactEmail, &loc.ContactPhone,
		&loc.OpeningDate, &loc.TaxRegion, &loc.SupportsPickup, &loc.SupportsDelivery, &loc.SupportsDineIn, &loc.SupportsPreOrder, &loc.SupportsSameDayOrdering,
		&loc.Latitude, &loc.Longitude, &loc.Status, &loc.CreatedAt, &loc.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &loc, nil
}

func (r *locationRepository) GetByOrganizationID(ctx context.Context, orgID uuid.UUID) ([]*domain.Location, error) {
	return r.List(ctx, orgID, "", "", "")
}

func (r *locationRepository) Update(ctx context.Context, loc *domain.Location) error {
	query := `UPDATE locations SET 
		name=$1, code=$2, type=$3, address_line1=$4, address_line2=$5, landmark=$6, city=$7, state=$8, postal_code=$9, country=$10, 
		timezone=$11, currency=$12, languages=$13, date_format=$14, time_format=$15, week_start_day=$16, contact_name=$17, contact_email=$18, contact_phone=$19, 
		opening_date=$20, tax_region=$21, supports_pickup=$22, supports_delivery=$23, supports_dine_in=$24, supports_pre_order=$25, supports_same_day_ordering=$26, 
		latitude=$27, longitude=$28, status=$29, updated_at=$30 
	WHERE id = $31`
	_, err := r.pool.Exec(ctx, query,
		loc.Name, loc.Code, loc.Type, loc.AddressLine1, loc.AddressLine2, loc.Landmark, loc.City, loc.State, loc.PostalCode, loc.Country,
		loc.Timezone, loc.Currency, loc.Languages, loc.DateFormat, loc.TimeFormat, loc.WeekStartDay, loc.ContactName, loc.ContactEmail, loc.ContactPhone,
		loc.OpeningDate, loc.TaxRegion, loc.SupportsPickup, loc.SupportsDelivery, loc.SupportsDineIn, loc.SupportsPreOrder, loc.SupportsSameDayOrdering,
		loc.Latitude, loc.Longitude, loc.Status, loc.UpdatedAt, loc.ID,
	)
	return err
}

func (r *locationRepository) Delete(ctx context.Context, id uuid.UUID) error {
	query := `UPDATE locations SET status = 'inactive', updated_at = NOW() WHERE id = $1`
	_, err := r.pool.Exec(ctx, query, id)
	return err
}

func (r *locationRepository) List(ctx context.Context, orgID uuid.UUID, country, city, status string) ([]*domain.Location, error) {
	query := `SELECT 
		id, organization_id, name, code, type, address_line1, address_line2, landmark, city, state, postal_code, country, 
		timezone, currency, languages, date_format, time_format, week_start_day, contact_name, contact_email, contact_phone, 
		opening_date, tax_region, supports_pickup, supports_delivery, supports_dine_in, supports_pre_order, supports_same_day_ordering, 
		latitude, longitude, status, created_at, updated_at 
	FROM locations WHERE organization_id = $1`
	
	args := []interface{}{orgID}
	placeholderIdx := 2

	if country != "" {
		query += fmt.Sprintf(" AND country = $%d", placeholderIdx)
		args = append(args, country)
		placeholderIdx++
	}
	if city != "" {
		query += fmt.Sprintf(" AND city = $%d", placeholderIdx)
		args = append(args, city)
		placeholderIdx++
	}
	if status != "" {
		query += fmt.Sprintf(" AND status = $%d", placeholderIdx)
		args = append(args, status)
		placeholderIdx++
	}

	query += ` ORDER BY created_at DESC`

	rows, err := r.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var locations []*domain.Location
	for rows.Next() {
		var loc domain.Location
		err := rows.Scan(
			&loc.ID, &loc.OrganizationID, &loc.Name, &loc.Code, &loc.Type, &loc.AddressLine1, &loc.AddressLine2, &loc.Landmark, &loc.City, &loc.State, &loc.PostalCode, &loc.Country,
			&loc.Timezone, &loc.Currency, &loc.Languages, &loc.DateFormat, &loc.TimeFormat, &loc.WeekStartDay, &loc.ContactName, &loc.ContactEmail, &loc.ContactPhone,
			&loc.OpeningDate, &loc.TaxRegion, &loc.SupportsPickup, &loc.SupportsDelivery, &loc.SupportsDineIn, &loc.SupportsPreOrder, &loc.SupportsSameDayOrdering,
			&loc.Latitude, &loc.Longitude, &loc.Status, &loc.CreatedAt, &loc.UpdatedAt,
		)
		if err != nil {
			return nil, err
		}
		locations = append(locations, &loc)
	}
	return locations, nil
}

func (r *locationRepository) GetByCode(ctx context.Context, orgID uuid.UUID, code string) (*domain.Location, error) {
	query := `SELECT 
		id, organization_id, name, code, type, address_line1, address_line2, landmark, city, state, postal_code, country, 
		timezone, currency, languages, date_format, time_format, week_start_day, contact_name, contact_email, contact_phone, 
		opening_date, tax_region, supports_pickup, supports_delivery, supports_dine_in, supports_pre_order, supports_same_day_ordering, 
		latitude, longitude, status, created_at, updated_at 
	FROM locations WHERE organization_id = $1 AND code = $2`
	var loc domain.Location
	err := r.pool.QueryRow(ctx, query, orgID, code).Scan(
		&loc.ID, &loc.OrganizationID, &loc.Name, &loc.Code, &loc.Type, &loc.AddressLine1, &loc.AddressLine2, &loc.Landmark, &loc.City, &loc.State, &loc.PostalCode, &loc.Country,
		&loc.Timezone, &loc.Currency, &loc.Languages, &loc.DateFormat, &loc.TimeFormat, &loc.WeekStartDay, &loc.ContactName, &loc.ContactEmail, &loc.ContactPhone,
		&loc.OpeningDate, &loc.TaxRegion, &loc.SupportsPickup, &loc.SupportsDelivery, &loc.SupportsDineIn, &loc.SupportsPreOrder, &loc.SupportsSameDayOrdering,
		&loc.Latitude, &loc.Longitude, &loc.Status, &loc.CreatedAt, &loc.UpdatedAt,
	)
	if err != nil {
		return nil, err
	}
	return &loc, nil
}
