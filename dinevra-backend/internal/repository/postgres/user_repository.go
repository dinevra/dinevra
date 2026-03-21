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

type userRepository struct {
	pool *pgxpool.Pool
}

func NewUserRepository(pool *pgxpool.Pool) domain.UserRepository {
	return &userRepository{pool: pool}
}

func (r *userRepository) GetByID(ctx context.Context, id uuid.UUID) (*domain.User, error) {
	query := `SELECT id, org_id, email, name, role, password_hash, pin_hash, last_login_at, created_at
	          FROM users WHERE id = $1`
	var user domain.User
	err := r.pool.QueryRow(ctx, query, id).Scan(
		&user.ID, &user.OrganizationID, &user.Email, &user.Name, &user.Role,
		&user.PasswordHash, &user.PinHash, &user.LastLoginAt, &user.CreatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) GetByEmail(ctx context.Context, email string) (*domain.User, error) {
	query := `SELECT id, org_id, email, name, role, password_hash, pin_hash, last_login_at, created_at
	          FROM users WHERE email = $1`
	var user domain.User
	err := r.pool.QueryRow(ctx, query, email).Scan(
		&user.ID, &user.OrganizationID, &user.Email, &user.Name, &user.Role,
		&user.PasswordHash, &user.PinHash, &user.LastLoginAt, &user.CreatedAt,
	)
	if errors.Is(err, pgx.ErrNoRows) {
		return nil, nil
	}
	if err != nil {
		return nil, err
	}
	return &user, nil
}

func (r *userRepository) Create(ctx context.Context, user *domain.User) error {
	query := `INSERT INTO users (id, org_id, email, name, role, password_hash, pin_hash, created_at)
			  VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`
	_, err := r.pool.Exec(ctx, query,
		user.ID, user.OrganizationID, user.Email, user.Name, user.Role,
		user.PasswordHash, user.PinHash, user.CreatedAt,
	)
	return err
}

func (r *userRepository) UpdateLastLogin(ctx context.Context, id uuid.UUID) error {
	_, err := r.pool.Exec(ctx,
		`UPDATE users SET last_login_at = $1 WHERE id = $2`,
		time.Now(), id,
	)
	return err
}
