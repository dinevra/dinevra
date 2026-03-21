-- Migration 002: Auth & Facility Type schema hardening
-- Adds missing fields on users, adds facility_type CHECK constraint,
-- adds user_sessions table for token/session management.

-- Add missing fields to users table
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS name TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'admin', -- 'admin', 'manager', 'staff'
  ADD COLUMN IF NOT EXISTS last_login_at TIMESTAMPTZ;

-- Enforce facility_type values at DB level
ALTER TABLE organizations
  ADD CONSTRAINT organizations_facility_type_check
  CHECK (facility_type IN ('RESTAURANT', 'CAMPUS', 'HEALTHCARE', 'GYM', 'CORPORATE'));

-- Sessions table: tracks active JWT / refresh tokens per user per device
CREATE TABLE IF NOT EXISTS user_sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,           -- SHA-256 hash of JWT/refresh token
    device_info TEXT,                          -- User agent or device name
    ip_address TEXT,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ                     -- NULL means active
);

CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token_hash ON user_sessions(token_hash);
