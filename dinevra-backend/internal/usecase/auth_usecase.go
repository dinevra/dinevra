package usecase

import (
	"context"
	"errors"
	"os"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/google/uuid"
	"golang.org/x/crypto/bcrypt"

	"dinevra-backend/internal/domain"
)

type authUsecase struct {
	userRepo domain.UserRepository
	orgRepo  domain.OrganizationRepository
}

func NewAuthUsecase(userRepo domain.UserRepository, orgRepo domain.OrganizationRepository) domain.AuthUsecase {
	return &authUsecase{
		userRepo: userRepo,
		orgRepo:  orgRepo,
	}
}

func (u *authUsecase) Signup(ctx context.Context, req *domain.SignupRequest) (*domain.AuthResponse, error) {
	// Check if email already exists
	existing, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if existing != nil {
		return nil, errors.New("email already in use")
	}

	// Create organization
	org := &domain.Organization{
		ID:           uuid.New(),
		Name:         req.OrganizationName,
		FacilityType: req.FacilityType,
		CreatedAt:    time.Now(),
		UpdatedAt:    time.Now(),
	}
	if err := u.orgRepo.Create(ctx, org); err != nil {
		return nil, err
	}

	// Hash password
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}

	// Create user — first user is admin
	user := &domain.User{
		ID:             uuid.New(),
		OrganizationID: org.ID,
		Email:          req.Email,
		Name:           req.Name,
		Role:           "admin",
		PasswordHash:   string(hash),
		CreatedAt:      time.Now(),
	}
	if err := u.userRepo.Create(ctx, user); err != nil {
		return nil, err
	}

	token, err := generateToken(user)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponse{Token: token, User: user}, nil
}

func (u *authUsecase) Login(ctx context.Context, req *domain.LoginRequest) (*domain.AuthResponse, error) {
	user, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	// Record last login time (non-blocking — ignore error)
	_ = u.userRepo.UpdateLastLogin(ctx, user.ID)

	token, err := generateToken(user)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponse{Token: token, User: user}, nil
}

func generateToken(user *domain.User) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dinevra-dev-secret-change-in-production"
	}

	claims := jwt.MapClaims{
		"sub":    user.ID.String(),
		"org_id": user.OrganizationID.String(),
		"email":  user.Email,
		"name":   user.Name,
		"role":   user.Role,
		"exp":    time.Now().Add(7 * 24 * time.Hour).Unix(),
		"iat":    time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}

func (u *authUsecase) KitchenLogin(ctx context.Context, req *domain.KitchenLoginRequest) (*domain.AuthResponse, error) {
	user, err := u.userRepo.GetByEmail(ctx, req.Email)
	if err != nil {
		return nil, err
	}
	if user == nil {
		return nil, errors.New("invalid credentials")
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		return nil, errors.New("invalid credentials")
	}

	_ = u.userRepo.UpdateLastLogin(ctx, user.ID)

	token, err := generateKitchenToken(user, req.KitchenID)
	if err != nil {
		return nil, err
	}

	return &domain.AuthResponse{Token: token, User: user}, nil
}

func generateKitchenToken(user *domain.User, kitchenID string) (string, error) {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		secret = "dinevra-dev-secret-change-in-production"
	}

	claims := jwt.MapClaims{
		"sub":        user.ID.String(),
		"org_id":     user.OrganizationID.String(),
		"kitchen_id": kitchenID,
		"email":      user.Email,
		"name":       user.Name,
		"role":       "kitchen_staff",
		"exp":        time.Now().Add(7 * 24 * time.Hour).Unix(),
		"iat":        time.Now().Unix(),
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	return token.SignedString([]byte(secret))
}
