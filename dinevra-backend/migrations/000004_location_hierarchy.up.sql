CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    address_line1 TEXT,
    city TEXT,
    country TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- The kitchens table inherited a raw 'location_id' column previously. Adding proper referential integrity constraint.
ALTER TABLE kitchens
ADD CONSTRAINT fk_kitchens_location
FOREIGN KEY (location_id) REFERENCES locations(id) ON DELETE CASCADE;
