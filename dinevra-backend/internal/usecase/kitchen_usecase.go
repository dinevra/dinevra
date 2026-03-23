package usecase

import (
	"context"
	"errors"
	"time"

	"github.com/google/uuid"
	"dinevra-backend/internal/domain"
)

type KitchenUsecase interface {
	CreateKitchen(ctx context.Context, req *domain.CreateKitchenRequest) (*domain.Kitchen, error)
	GetKitchenByID(ctx context.Context, id uuid.UUID) (*domain.Kitchen, error)
	GetKitchensByLocation(ctx context.Context, locationID uuid.UUID) ([]*domain.Kitchen, error)
	UpdateKitchen(ctx context.Context, id uuid.UUID, req *domain.UpdateKitchenRequest) (*domain.Kitchen, error)
	DeleteKitchen(ctx context.Context, id uuid.UUID) error
	UpdateKitchenConfig(ctx context.Context, config *domain.KitchenConfiguration) error
	ToggleKitchenStatus(ctx context.Context, kitchenID uuid.UUID, isOpen bool) error
}

type kitchenUsecase struct {
	repo     domain.KitchenRepository
	location domain.LocationRepository
}

func NewKitchenUsecase(repo domain.KitchenRepository, location domain.LocationRepository) KitchenUsecase {
	return &kitchenUsecase{repo: repo, location: location}
}

func (u *kitchenUsecase) CreateKitchen(ctx context.Context, req *domain.CreateKitchenRequest) (*domain.Kitchen, error) {
	// 1. Validate Location exists
	loc, err := u.location.GetByID(ctx, req.LocationID)
	if err != nil {
		return nil, err
	}
	if loc == nil {
		return nil, errors.New("location not found")
	}

	// 2. Validate Code uniqueness within location
	if req.Code != "" {
		existing, err := u.repo.GetByCode(ctx, req.LocationID, req.Code)
		if err != nil {
			return nil, err
		}
		if existing != nil {
			return nil, errors.New("kitchen code already exists in this location")
		}
	}

	kitchen := &domain.Kitchen{
		ID:                       uuid.New(),
		LocationID:               req.LocationID,
		Name:                     req.Name,
		Code:                     &req.Code,
		DisplayName:              &req.DisplayName,
		Type:                     &req.Type,
		PrepType:                 &req.PrepType,
		CapacityPerSlot:          req.CapacityPerSlot,
		AvgPrepTimeMins:          req.AvgPrepTimeMins,
		BufferTimeMins:           req.BufferTimeMins,
		MaxConcurrentOrders:      req.MaxConcurrentOrders,
		Priority:                 0,
		SupportsPickup:           true,
		SupportsDelivery:         false,
		SupportsDineIn:           true,
		SupportsScheduledOrders:  false,
		SupportsInstantOrders:    true,
		VisibleToCustomers:       true,
		InternalOnly:             false,
		KitchenLoginEnabled:      true,
		RequirePinLogin:          false,
		DeviceRestrictionEnabled: false,
		Status:                   "active",
		CreatedAt:                time.Now(),
		UpdatedAt:                time.Now(),
	}

	if req.Priority != nil {
		kitchen.Priority = *req.Priority
	}
	if req.SupportsPickup != nil {
		kitchen.SupportsPickup = *req.SupportsPickup
	}
	if req.SupportsDelivery != nil {
		kitchen.SupportsDelivery = *req.SupportsDelivery
	}
	if req.SupportsDineIn != nil {
		kitchen.SupportsDineIn = *req.SupportsDineIn
	}
	if req.SupportsScheduledOrders != nil {
		kitchen.SupportsScheduledOrders = *req.SupportsScheduledOrders
	}
	if req.SupportsInstantOrders != nil {
		kitchen.SupportsInstantOrders = *req.SupportsInstantOrders
	}
	if req.VisibleToCustomers != nil {
		kitchen.VisibleToCustomers = *req.VisibleToCustomers
	}
	if req.InternalOnly != nil {
		kitchen.InternalOnly = *req.InternalOnly
	}
	if req.KitchenLoginEnabled != nil {
		kitchen.KitchenLoginEnabled = *req.KitchenLoginEnabled
	}
	if req.RequirePinLogin != nil {
		kitchen.RequirePinLogin = *req.RequirePinLogin
	}
	if req.DeviceRestrictionEnabled != nil {
		kitchen.DeviceRestrictionEnabled = *req.DeviceRestrictionEnabled
	}

	if err := u.repo.Create(ctx, kitchen); err != nil {
		return nil, err
	}
	return kitchen, nil
}

func (u *kitchenUsecase) GetKitchenByID(ctx context.Context, id uuid.UUID) (*domain.Kitchen, error) {
	return u.repo.GetByID(ctx, id)
}

func (u *kitchenUsecase) GetKitchensByLocation(ctx context.Context, locationID uuid.UUID) ([]*domain.Kitchen, error) {
	return u.repo.GetByLocationID(ctx, locationID)
}

func (u *kitchenUsecase) UpdateKitchen(ctx context.Context, id uuid.UUID, req *domain.UpdateKitchenRequest) (*domain.Kitchen, error) {
	kitchen, err := u.repo.GetByID(ctx, id)
	if err != nil {
		return nil, err
	}

	if req.Name != nil {
		kitchen.Name = *req.Name
	}
	if req.Code != nil {
		// Validate new code uniqueness if changed
		if *req.Code != "" && (kitchen.Code == nil || *kitchen.Code != *req.Code) {
			existing, err := u.repo.GetByCode(ctx, kitchen.LocationID, *req.Code)
			if err != nil {
				return nil, err
			}
			if existing != nil && existing.ID != kitchen.ID {
				return nil, errors.New("kitchen code already exists in this location")
			}
		}
		kitchen.Code = req.Code
	}
	if req.DisplayName != nil {
		kitchen.DisplayName = req.DisplayName
	}
	if req.Type != nil {
		kitchen.Type = req.Type
	}
	if req.PrepType != nil {
		kitchen.PrepType = req.PrepType
	}
	if req.CapacityPerSlot != nil {
		kitchen.CapacityPerSlot = req.CapacityPerSlot
	}
	if req.AvgPrepTimeMins != nil {
		kitchen.AvgPrepTimeMins = req.AvgPrepTimeMins
	}
	if req.BufferTimeMins != nil {
		kitchen.BufferTimeMins = req.BufferTimeMins
	}
	if req.MaxConcurrentOrders != nil {
		kitchen.MaxConcurrentOrders = req.MaxConcurrentOrders
	}
	if req.Priority != nil {
		kitchen.Priority = *req.Priority
	}
	if req.SupportsPickup != nil {
		kitchen.SupportsPickup = *req.SupportsPickup
	}
	if req.SupportsDelivery != nil {
		kitchen.SupportsDelivery = *req.SupportsDelivery
	}
	if req.SupportsDineIn != nil {
		kitchen.SupportsDineIn = *req.SupportsDineIn
	}
	if req.SupportsScheduledOrders != nil {
		kitchen.SupportsScheduledOrders = *req.SupportsScheduledOrders
	}
	if req.SupportsInstantOrders != nil {
		kitchen.SupportsInstantOrders = *req.SupportsInstantOrders
	}
	if req.VisibleToCustomers != nil {
		kitchen.VisibleToCustomers = *req.VisibleToCustomers
	}
	if req.InternalOnly != nil {
		kitchen.InternalOnly = *req.InternalOnly
	}
	if req.KitchenLoginEnabled != nil {
		kitchen.KitchenLoginEnabled = *req.KitchenLoginEnabled
	}
	if req.RequirePinLogin != nil {
		kitchen.RequirePinLogin = *req.RequirePinLogin
	}
	if req.DeviceRestrictionEnabled != nil {
		kitchen.DeviceRestrictionEnabled = *req.DeviceRestrictionEnabled
	}
	if req.Status != nil {
		kitchen.Status = *req.Status
	}

	if err := u.repo.Update(ctx, kitchen); err != nil {
		return nil, err
	}
	return kitchen, nil
}

func (u *kitchenUsecase) DeleteKitchen(ctx context.Context, id uuid.UUID) error {
	return u.repo.Delete(ctx, id)
}

func (u *kitchenUsecase) UpdateKitchenConfig(ctx context.Context, config *domain.KitchenConfiguration) error {
	return u.repo.UpdateConfiguration(ctx, config)
}

func (u *kitchenUsecase) ToggleKitchenStatus(ctx context.Context, kitchenID uuid.UUID, isOpen bool) error {
	return u.repo.UpdateStatus(ctx, kitchenID, isOpen)
}
