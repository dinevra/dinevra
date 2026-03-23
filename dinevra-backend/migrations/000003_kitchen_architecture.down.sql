-- Revert Migration 003

DROP TABLE IF EXISTS kitchen_timings;
DROP TABLE IF EXISTS kitchen_configurations;

-- Re-add generic 'type' column
ALTER TABLE kitchens ADD COLUMN type TEXT NOT NULL DEFAULT 'KITCHEN';

-- Revert columns
ALTER TABLE devices RENAME COLUMN fixed_kitchen_id TO fixed_unit_id;
ALTER TABLE devices RENAME COLUMN current_kitchen_id TO current_unit_id;
ALTER TABLE orders RENAME COLUMN kitchen_id TO unit_id;
ALTER TABLE user_kitchen_access RENAME COLUMN kitchen_id TO unit_id;

-- Revert tables
ALTER TABLE user_kitchen_access RENAME TO user_unit_access;
ALTER TABLE kitchens RENAME TO units;
