-- Add 'already_paid' as a valid package_type
-- Drop the existing constraint and recreate with new value

ALTER TABLE toddler_registrations
DROP CONSTRAINT IF EXISTS toddler_registrations_package_type_check;

ALTER TABLE toddler_registrations
ADD CONSTRAINT toddler_registrations_package_type_check
CHECK (package_type IN ('single', 'bundle', 'already_paid'));
