-- Add traffic source tracking columns to registrations table
ALTER TABLE registrations
ADD COLUMN IF NOT EXISTS utm_source TEXT,
ADD COLUMN IF NOT EXISTS utm_medium TEXT,
ADD COLUMN IF NOT EXISTS utm_campaign TEXT,
ADD COLUMN IF NOT EXISTS utm_content TEXT,
ADD COLUMN IF NOT EXISTS utm_term TEXT,
ADD COLUMN IF NOT EXISTS referrer TEXT,
ADD COLUMN IF NOT EXISTS landing_page TEXT;

-- Add comment for documentation
COMMENT ON COLUMN registrations.utm_source IS 'Traffic source (e.g., google, facebook, instagram)';
COMMENT ON COLUMN registrations.utm_medium IS 'Traffic medium (e.g., cpc, organic, social)';
COMMENT ON COLUMN registrations.utm_campaign IS 'Campaign name';
COMMENT ON COLUMN registrations.referrer IS 'Document referrer URL';
COMMENT ON COLUMN registrations.landing_page IS 'Initial landing page path';
