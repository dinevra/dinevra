-- Add operational tracking to kitchen_configurations
ALTER TABLE kitchen_configurations 
ADD COLUMN close_reason TEXT,
ADD COLUMN last_state_change_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN last_state_change_by UUID;

-- Optional: Index for lookup
CREATE INDEX idx_kitchen_config_state ON kitchen_configurations(kitchen_id, is_open);
