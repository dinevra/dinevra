-- Drop existing to ensure clean state
DROP TABLE IF EXISTS kitchen_configurations CASCADE;
DROP TABLE IF EXISTS kitchens CASCADE;
DROP TABLE IF EXISTS locations CASCADE;

-- Locations Table
CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    type TEXT,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    landmark TEXT,
    city TEXT NOT NULL,
    state TEXT,
    postal_code TEXT,
    country TEXT NOT NULL,
    timezone TEXT,
    currency TEXT,
    languages TEXT[],
    date_format TEXT,
    time_format TEXT,
    week_start_day INTEGER,
    contact_name TEXT,
    contact_email TEXT,
    contact_phone TEXT,
    opening_date DATE,
    tax_region TEXT,
    supports_pickup BOOLEAN DEFAULT TRUE,
    supports_delivery BOOLEAN DEFAULT FALSE,
    supports_dine_in BOOLEAN DEFAULT TRUE,
    supports_pre_order BOOLEAN DEFAULT FALSE,
    supports_same_day_ordering BOOLEAN DEFAULT TRUE,
    latitude NUMERIC(10,8),
    longitude NUMERIC(11,8),
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kitchens Table
CREATE TABLE kitchens (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    code TEXT,
    display_name TEXT,
    type TEXT,
    prep_type TEXT,
    capacity_per_slot INTEGER DEFAULT 0,
    avg_prep_time_mins INTEGER DEFAULT 15,
    buffer_time_mins INTEGER DEFAULT 5,
    max_concurrent_orders INTEGER DEFAULT 10,
    priority INTEGER DEFAULT 0,
    supports_pickup BOOLEAN DEFAULT TRUE,
    supports_delivery BOOLEAN DEFAULT FALSE,
    supports_dine_in BOOLEAN DEFAULT TRUE,
    supports_scheduled_orders BOOLEAN DEFAULT FALSE,
    supports_instant_orders BOOLEAN DEFAULT TRUE,
    visible_to_customers BOOLEAN DEFAULT TRUE,
    internal_only BOOLEAN DEFAULT FALSE,
    kitchen_login_enabled BOOLEAN DEFAULT TRUE,
    require_pin_login BOOLEAN DEFAULT FALSE,
    device_restriction_enabled BOOLEAN DEFAULT FALSE,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Kitchen Configurations
CREATE TABLE kitchen_configurations (
    kitchen_id UUID PRIMARY KEY REFERENCES kitchens(id) ON DELETE CASCADE,
    is_open BOOLEAN DEFAULT FALSE,
    cart_message TEXT,
    currency TEXT,
    timezone TEXT,
    language TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
