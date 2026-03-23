-- ORGANIZATIONS EXTENSION
ALTER TABLE organizations
ADD COLUMN legal_name TEXT,
ADD COLUMN brand_name TEXT,
ADD COLUMN business_type TEXT,
ADD COLUMN default_country TEXT,
ADD COLUMN default_currency TEXT,
ADD COLUMN default_timezone TEXT,
ADD COLUMN default_language TEXT,
ADD COLUMN is_multilanguage_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN status TEXT DEFAULT 'active';

-- LOCATIONS EXTENSION
ALTER TABLE locations
ADD COLUMN code TEXT,
ADD COLUMN type TEXT,
ADD COLUMN address_line2 TEXT,
ADD COLUMN landmark TEXT,
ADD COLUMN state TEXT,
ADD COLUMN postal_code TEXT,
ADD COLUMN timezone TEXT,
ADD COLUMN currency TEXT,
ADD COLUMN languages TEXT[],
ADD COLUMN date_format TEXT,
ADD COLUMN time_format TEXT,
ADD COLUMN week_start_day INT, -- 0-6
ADD COLUMN contact_name TEXT,
ADD COLUMN contact_email TEXT,
ADD COLUMN contact_phone TEXT,
ADD COLUMN opening_date DATE,
ADD COLUMN tax_region TEXT,
ADD COLUMN supports_pickup BOOLEAN DEFAULT TRUE,
ADD COLUMN supports_delivery BOOLEAN DEFAULT FALSE,
ADD COLUMN supports_dine_in BOOLEAN DEFAULT TRUE,
ADD COLUMN supports_pre_order BOOLEAN DEFAULT FALSE,
ADD COLUMN supports_same_day_ordering BOOLEAN DEFAULT TRUE,
ADD COLUMN latitude DECIMAL(10, 8),
ADD COLUMN longitude DECIMAL(11, 8),
ADD COLUMN status TEXT DEFAULT 'active';

-- KITCHENS EXTENSION
ALTER TABLE kitchens
ADD COLUMN code TEXT,
ADD COLUMN display_name TEXT,
ADD COLUMN type TEXT,
ADD COLUMN prep_type TEXT,
ADD COLUMN capacity_per_slot INT,
ADD COLUMN avg_prep_time_mins INT,
ADD COLUMN buffer_time_mins INT,
ADD COLUMN max_concurrent_orders INT,
ADD COLUMN priority INT DEFAULT 0,
ADD COLUMN supports_pickup BOOLEAN DEFAULT TRUE,
ADD COLUMN supports_delivery BOOLEAN DEFAULT FALSE,
ADD COLUMN supports_dine_in BOOLEAN DEFAULT TRUE,
ADD COLUMN supports_scheduled_orders BOOLEAN DEFAULT FALSE,
ADD COLUMN supports_instant_orders BOOLEAN DEFAULT TRUE,
ADD COLUMN visible_to_customers BOOLEAN DEFAULT TRUE,
ADD COLUMN internal_only BOOLEAN DEFAULT FALSE,
ADD COLUMN kitchen_login_enabled BOOLEAN DEFAULT TRUE,
ADD COLUMN require_pin_login BOOLEAN DEFAULT FALSE,
ADD COLUMN device_restriction_enabled BOOLEAN DEFAULT FALSE,
ADD COLUMN status TEXT DEFAULT 'active',
ADD COLUMN updated_at TIMESTAMPTZ DEFAULT NOW();

-- KITCHEN BASED MODULES (Relationships)

CREATE TABLE kitchen_meal_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kitchen_id UUID NOT NULL REFERENCES kitchens(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    validity_days INT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kitchen_wallet_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kitchen_id UUID NOT NULL REFERENCES kitchens(id) ON DELETE CASCADE UNIQUE,
    is_wallet_enabled BOOLEAN DEFAULT TRUE,
    max_balance DECIMAL(10, 2),
    min_reload DECIMAL(10, 2),
    max_reload DECIMAL(10, 2),
    bonus_percentage DECIMAL(5, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE kitchen_token_config (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    kitchen_id UUID NOT NULL REFERENCES kitchens(id) ON DELETE CASCADE UNIQUE,
    are_tokens_enabled BOOLEAN DEFAULT TRUE,
    token_currency_name TEXT DEFAULT 'Token',
    exchange_rate DECIMAL(10, 2) DEFAULT 1.0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
