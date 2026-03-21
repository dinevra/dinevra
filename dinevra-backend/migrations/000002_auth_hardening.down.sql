-- Rollback for migration 002
ALTER TABLE users
  DROP COLUMN IF EXISTS name,
  DROP COLUMN IF EXISTS role,
  DROP COLUMN IF EXISTS last_login_at;

ALTER TABLE organizations
  DROP CONSTRAINT IF EXISTS organizations_facility_type_check;

DROP TABLE IF EXISTS user_sessions;
