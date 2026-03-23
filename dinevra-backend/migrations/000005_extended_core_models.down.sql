DROP TABLE IF EXISTS kitchen_meal_plans CASCADE;
DROP TABLE IF EXISTS kitchen_wallet_config CASCADE;
DROP TABLE IF EXISTS kitchen_token_config CASCADE;

ALTER TABLE kitchens
DROP COLUMN code,
DROP COLUMN display_name,
DROP COLUMN type,
DROP COLUMN prep_type,
DROP COLUMN capacity_per_slot,
DROP COLUMN avg_prep_time_mins,
DROP COLUMN buffer_time_mins,
DROP COLUMN max_concurrent_orders,
DROP COLUMN priority,
DROP COLUMN supports_pickup,
DROP COLUMN supports_delivery,
DROP COLUMN supports_dine_in,
DROP COLUMN supports_scheduled_orders,
DROP COLUMN supports_instant_orders,
DROP COLUMN visible_to_customers,
DROP COLUMN internal_only,
DROP COLUMN kitchen_login_enabled,
DROP COLUMN require_pin_login,
DROP COLUMN device_restriction_enabled,
DROP COLUMN status,
DROP COLUMN updated_at;

ALTER TABLE locations
DROP COLUMN code,
DROP COLUMN type,
DROP COLUMN address_line2,
DROP COLUMN landmark,
DROP COLUMN state,
DROP COLUMN postal_code,
DROP COLUMN timezone,
DROP COLUMN currency,
DROP COLUMN languages,
DROP COLUMN date_format,
DROP COLUMN time_format,
DROP COLUMN week_start_day,
DROP COLUMN contact_name,
DROP COLUMN contact_email,
DROP COLUMN contact_phone,
DROP COLUMN opening_date,
DROP COLUMN tax_region,
DROP COLUMN supports_pickup,
DROP COLUMN supports_delivery,
DROP COLUMN supports_dine_in,
DROP COLUMN supports_pre_order,
DROP COLUMN supports_same_day_ordering,
DROP COLUMN latitude,
DROP COLUMN longitude,
DROP COLUMN status;

ALTER TABLE organizations
DROP COLUMN legal_name,
DROP COLUMN brand_name,
DROP COLUMN business_type,
DROP COLUMN default_country,
DROP COLUMN default_currency,
DROP COLUMN default_timezone,
DROP COLUMN default_language,
DROP COLUMN is_multilanguage_enabled,
DROP COLUMN status;
