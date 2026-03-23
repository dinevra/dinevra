package usecase

import (
	"context"
	"time"

	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
)

type KitchenUsecase interface {
	CreateKitchen(ctx context.Context, kitchen *domain.Kitchen) error
	GetKitchenByID(ctx context.Context, id uuid.UUID) (*domain.Kitchen, error)
	GetKitchensByLocation(ctx context.Context, locationID uuid.UUID) ([]*domain.Kitchen, error)
	UpdateKitchenConfig(ctx context.Context, config *domain.KitchenConfiguration) error
	ToggleKitchenStatus(ctx context.Context, kitchenID uuid.UUID, isOpen bool) error
}

type kitchenUsecase struct {
	repo domain.KitchenRepository
}

func NewKitchenUsecase(repo domain.KitchenRepository) KitchenUsecase {
	return &kitchenUsecase{repo: repo}
}

func (u *kitchenUsecase) CreateKitchen(ctx context.Context, kitchen *domain.Kitchen) error {
	kitchen.ID = uuid.New()
	kitchen.CreatedAt = time.Now()
	return u.repo.Create(ctx, kitchen)
}

func (u *kitchenUsecase) GetKitchenByID(ctx context.Context, id uuid.UUID) (*domain.Kitchen, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *kitchenUsecase) GetKitchensByLocation(ctx context.Context, locationID uuid.UUID) ([]*domain.Kitchen, error) {
	return u.repo.GetByLocationID(ctx, locationID)
}

func (u *kitchenUsecase) UpdateKitchenConfig(ctx context.Context, config *domain.KitchenConfiguration) error {
	return u.repo.UpdateConfiguration(ctx, config)
}

func (u *kitchenUsecase) ToggleKitchenStatus(ctx context.Context, kitchenID uuid.UUID, isOpen bool) error {
	return u.repo.UpdateStatus(ctx, kitchenID, isOpen)
}
