-- Migration 003: Kitchen Architecture Alignment

-- Rename units to kitchens
ALTER TABLE units RENAME TO kitchens;
ALTER TABLE user_unit_access RENAME TO user_kitchen_access;

-- Rename unit_id columns to kitchen_id
ALTER TABLE user_kitchen_access RENAME COLUMN unit_id TO kitchen_id;
ALTER TABLE orders RENAME COLUMN unit_id TO kitchen_id;
ALTER TABLE devices RENAME COLUMN fixed_unit_id TO fixed_kitchen_id;
ALTER TABLE devices RENAME COLUMN current_unit_id TO current_kitchen_id;

-- Drop the generic 'type' column since this table now exclusively represents kitchens
ALTER TABLE kitchens DROP COLUMN IF EXISTS type;

-- Create operational configuration table for Kitchens
CREATE TABLE kitchen_configurations (
    kitchen_id UUID PRIMARY KEY REFERENCES kitchens(id) ON DELETE CASCADE,
    is_open BOOLEAN DEFAULT false,
    cart_message TEXT,
    currency TEXT DEFAULT 'USD',
    timezone TEXT DEFAULT 'UTC',
    language TEXT DEFAULT 'en',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create table for day-wise kitchen timings with multiple slots
-- day_of_week mapping: 0=Sunday, 1=Monday, ..., 6=Saturday
CREATE TABLE kitchen_timings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
    day_of_week INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6),
    slot_name TEXT, -- e.g., 'Breakfast', 'Lunch', 'Dinner'
    open_time TIME NOT NULL,
    close_time TIME NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
