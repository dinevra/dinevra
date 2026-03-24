-- Seed Organization
INSERT INTO organizations (id, name, facility_type, brand_name, default_country, default_currency, status)
VALUES (
    '00000000-0000-0000-0000-000000000001', 
    'Dinevra Campus', 
    'CAMPUS', 
    'Dinevra', 
    'US', 
    'USD', 
    'active'
) ON CONFLICT (id) DO NOTHING;

-- Seed Admin User (password is 'password123' hashed)
INSERT INTO users (id, org_id, email, password_hash, role, created_at)
VALUES (
    uuid_generate_v4(), 
    '00000000-0000-0000-0000-000000000001', 
    'admin@dinevra.com', 
    '$2a$10$LIRvgZ2yfbCi.yihH8TqY.8essF4ZlnKcAmy//DzHRarc4F61tyuW',
    'admin',
    NOW()
) ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash, role = 'admin';

-- Seed Location
INSERT INTO locations (id, organization_id, name, code, address_line1, city, country, status, created_at)
VALUES (
    '00000000-0000-0000-0000-000000000100',
    '00000000-0000-0000-0000-000000000001',
    'Main Campus Center',
    'MCC-01',
    '123 University Ave',
    'Stanford',
    'US',
    'active',
    NOW()
) ON CONFLICT (id) DO NOTHING;
