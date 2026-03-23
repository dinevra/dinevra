package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
)

type LocationUsecase interface {
	CreateLocation(ctx context.Context, loc *domain.Location) error
	GetLocationByID(ctx context.Context, id uuid.UUID) (*domain.Location, error)
	GetLocationsByOrg(ctx context.Context, orgID uuid.UUID) ([]*domain.Location, error)
	UpdateLocation(ctx context.Context, loc *domain.Location) error
	DeleteLocation(ctx context.Context, id uuid.UUID) error
	ListLocations(ctx context.Context, orgID uuid.UUID, country, city, status string) ([]*domain.Location, error)
}

type locationUsecase struct {
	repo domain.LocationRepository
}

func NewLocationUsecase(repo domain.LocationRepository) LocationUsecase {
	return &locationUsecase{repo: repo}
}

func (u *locationUsecase) CreateLocation(ctx context.Context, loc *domain.Location) error {
	// Check for duplicate code under the same organization
	if loc.Code != nil && *loc.Code != "" {
		existing, _ := u.repo.GetByCode(ctx, loc.OrganizationID, *loc.Code)
		if existing != nil {
			return errors.New("location with this code already exists in your organization")
		}
	}

	loc.ID = uuid.New()
	if loc.Status == "" {
		loc.Status = "active"
	}
	loc.CreatedAt = time.Now()
	loc.UpdatedAt = time.Now()
	return u.repo.Create(ctx, loc)
}

func (u *locationUsecase) GetLocationByID(ctx context.Context, id uuid.UUID) (*domain.Location, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *locationUsecase) GetLocationsByOrg(ctx context.Context, orgID uuid.UUID) ([]*domain.Location, error) {
	return u.repo.GetByOrganizationID(ctx, orgID)
}

func (u *locationUsecase) UpdateLocation(ctx context.Context, loc *domain.Location) error {
	existing, err := u.repo.GetByID(ctx, loc.ID)
	if err != nil {
		return errors.New("location not found")
	}

	// Check for duplicate code if it's being changed
	if loc.Code != nil && *loc.Code != "" && (existing.Code == nil || *existing.Code != *loc.Code) {
		dup, _ := u.repo.GetByCode(ctx, loc.OrganizationID, *loc.Code)
		if dup != nil && dup.ID != loc.ID {
			return errors.New("location with this code already exists in your organization")
		}
	}

	loc.UpdatedAt = time.Now()
	return u.repo.Update(ctx, loc)
}

func (u *locationUsecase) DeleteLocation(ctx context.Context, id uuid.UUID) error {
	return u.repo.Delete(ctx, id)
}

func (u *locationUsecase) ListLocations(ctx context.Context, orgID uuid.UUID, country, city, status string) ([]*domain.Location, error) {
	return u.repo.List(ctx, orgID, country, city, status)
}
