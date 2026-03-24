-- Remove operational tracking from kitchen_configurations
ALTER TABLE kitchen_configurations 
DROP COLUMN IF EXISTS close_reason,
DROP COLUMN IF EXISTS last_state_change_at,
DROP COLUMN IF EXISTS last_state_change_by;

DROP INDEX IF EXISTS idx_kitchen_config_state;
