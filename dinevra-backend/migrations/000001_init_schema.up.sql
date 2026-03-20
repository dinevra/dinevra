-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core Hierarchy
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    sector TEXT NOT NULL DEFAULT 'RESTAURANT', -- 'RESTAURANT', 'CAMPUS', 'HEALTHCARE', 'GYM', 'CORPORATE'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE units (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    location_id UUID REFERENCES locations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL DEFAULT 'GENERAL', -- 'KITCHEN', 'BAR', 'RECEPTION', 'PHARMACY', etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Users & Access Control
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT,
    pin_hash TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE user_unit_access (
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    unit_id UUID REFERENCES units(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    PRIMARY KEY (user_id, unit_id)
);

-- Device Management
CREATE TABLE devices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    mode TEXT NOT NULL, -- 'fixed' or 'flexible'
    fixed_unit_id UUID REFERENCES units(id),
    current_unit_id UUID REFERENCES units(id),
    status TEXT NOT NULL DEFAULT 'offline',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ordering System
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    unit_id UUID REFERENCES units(id),
    device_id UUID REFERENCES devices(id),
    user_id UUID REFERENCES users(id),
    status TEXT NOT NULL, -- 'new', 'preparing', 'ready', 'completed', 'cancelled'
    total_amount DECIMAL(12, 2) NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE order_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
    item_id UUID NOT NULL,
    quantity INT NOT NULL,
    unit_price DECIMAL(12, 2) NOT NULL,
    notes TEXT
);

-- Payments & Ledger System (Multi-Payment)
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    order_id UUID REFERENCES orders(id),
    amount DECIMAL(12, 2) NOT NULL,
    method TEXT NOT NULL, -- 'card', 'dining_dollars', 'meal_plan', 'cash', 'membership_credit'
    status TEXT NOT NULL, -- 'pending', 'processing', 'succeeded', 'failed'
    external_reference_id TEXT, -- Stripe PaymentIntent ID
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE wallets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type TEXT NOT NULL, -- 'dining_dollars', 'meal_plan', 'credits'
    balance DECIMAL(12, 2) DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    wallet_id UUID REFERENCES wallets(id),
    amount DECIMAL(12, 2) NOT NULL,
    type TEXT NOT NULL, -- 'credit', 'debit'
    reference_type TEXT NOT NULL, -- 'order', 'reload'
    reference_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
