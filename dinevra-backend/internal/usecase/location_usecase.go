package usecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
)

type LocationUsecase interface {
	CreateLocation(ctx context.Context, location *domain.Location) error
	GetLocationByID(ctx context.Context, id uuid.UUID) (*domain.Location, error)
	GetLocationsByOrg(ctx context.Context, orgID uuid.UUID) ([]*domain.Location, error)
}

type locationUsecase struct {
	repo domain.LocationRepository
}

func NewLocationUsecase(repo domain.LocationRepository) LocationUsecase {
	return &locationUsecase{repo: repo}
}

func (u *locationUsecase) CreateLocation(ctx context.Context, loc *domain.Location) error {
	loc.ID = uuid.New()
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
