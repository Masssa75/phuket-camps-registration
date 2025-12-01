-- Toddler Class Tables Migration
-- Created: 2025-12-02
-- Description: Add tables for toddler class registrations (1-hour weekly sessions)

-- ============================================
-- 1. TODDLER SESSIONS TABLE
-- Stores available class sessions (admin manages these)
-- ============================================
CREATE TABLE IF NOT EXISTS toddler_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_date DATE NOT NULL,
  session_time TIME DEFAULT '10:00',
  capacity INTEGER DEFAULT 15,
  current_bookings INTEGER DEFAULT 0,
  status TEXT DEFAULT 'open' CHECK (status IN ('open', 'full', 'cancelled')),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for querying upcoming sessions
CREATE INDEX idx_toddler_sessions_date ON toddler_sessions(session_date);
CREATE INDEX idx_toddler_sessions_status ON toddler_sessions(status);

-- ============================================
-- 2. TODDLER REGISTRATIONS TABLE
-- Parent/family registration with package info
-- ============================================
CREATE TABLE IF NOT EXISTS toddler_registrations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  -- Parent/Guardian Info
  parent_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT NOT NULL,

  -- Returning family
  is_returning BOOLEAN DEFAULT false,
  how_did_you_find TEXT,

  -- Package Selection
  package_type TEXT NOT NULL CHECK (package_type IN ('single', 'bundle')),
  sessions_purchased INTEGER NOT NULL, -- 1 for single, 12 for bundle
  sessions_remaining INTEGER NOT NULL, -- Decrements with attendance

  -- Payment
  payment_status TEXT DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')),
  payment_amount DECIMAL(10,2),
  payment_date TIMESTAMPTZ,
  payment_method TEXT,
  payment_reference TEXT,

  -- Permissions
  photo_permission BOOLEAN DEFAULT false,
  terms_acknowledged BOOLEAN DEFAULT false,

  -- Admin
  admin_notes TEXT
);

-- Indexes for common queries
CREATE INDEX idx_toddler_registrations_email ON toddler_registrations(email);
CREATE INDEX idx_toddler_registrations_created_at ON toddler_registrations(created_at DESC);
CREATE INDEX idx_toddler_registrations_payment_status ON toddler_registrations(payment_status);

-- ============================================
-- 3. TODDLER CHILDREN TABLE
-- One parent can register multiple children
-- ============================================
CREATE TABLE IF NOT EXISTS toddler_children (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES toddler_registrations(id) ON DELETE CASCADE,
  child_name TEXT NOT NULL,
  date_of_birth DATE NOT NULL,
  gender TEXT CHECK (gender IN ('Boy', 'Girl')),
  nationality TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for looking up children by registration
CREATE INDEX idx_toddler_children_registration ON toddler_children(registration_id);

-- ============================================
-- 4. TODDLER SESSION BOOKINGS TABLE
-- Links registrations to specific sessions
-- ============================================
CREATE TABLE IF NOT EXISTS toddler_session_bookings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  registration_id UUID NOT NULL REFERENCES toddler_registrations(id) ON DELETE CASCADE,
  session_id UUID NOT NULL REFERENCES toddler_sessions(id) ON DELETE CASCADE,
  attended BOOLEAN DEFAULT false,
  attended_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  -- Prevent double-booking same session
  UNIQUE(registration_id, session_id)
);

-- Index for looking up bookings
CREATE INDEX idx_toddler_bookings_registration ON toddler_session_bookings(registration_id);
CREATE INDEX idx_toddler_bookings_session ON toddler_session_bookings(session_id);

-- ============================================
-- 5. RLS POLICIES
-- ============================================
ALTER TABLE toddler_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE toddler_registrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE toddler_children ENABLE ROW LEVEL SECURITY;
ALTER TABLE toddler_session_bookings ENABLE ROW LEVEL SECURITY;

-- Public can view open sessions
CREATE POLICY "Anyone can view open sessions" ON toddler_sessions
  FOR SELECT USING (status = 'open');

-- Public can create registrations
CREATE POLICY "Anyone can create registrations" ON toddler_registrations
  FOR INSERT WITH CHECK (true);

-- Public can add children to their registration
CREATE POLICY "Anyone can add children" ON toddler_children
  FOR INSERT WITH CHECK (true);

-- Public can create bookings
CREATE POLICY "Anyone can create bookings" ON toddler_session_bookings
  FOR INSERT WITH CHECK (true);

-- Service role can do everything (for admin operations)
CREATE POLICY "Service role full access sessions" ON toddler_sessions
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access registrations" ON toddler_registrations
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access children" ON toddler_children
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access bookings" ON toddler_session_bookings
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================
-- 6. FUNCTION: Update session booking count
-- Auto-updates current_bookings when bookings change
-- ============================================
CREATE OR REPLACE FUNCTION update_session_booking_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE toddler_sessions
    SET current_bookings = current_bookings + 1,
        status = CASE WHEN current_bookings + 1 >= capacity THEN 'full' ELSE status END
    WHERE id = NEW.session_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE toddler_sessions
    SET current_bookings = GREATEST(current_bookings - 1, 0),
        status = CASE WHEN current_bookings - 1 < capacity THEN 'open' ELSE status END
    WHERE id = OLD.session_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_session_count
AFTER INSERT OR DELETE ON toddler_session_bookings
FOR EACH ROW EXECUTE FUNCTION update_session_booking_count();

-- ============================================
-- 7. FUNCTION: Decrement sessions on attendance
-- Auto-decrements sessions_remaining when marked attended
-- ============================================
CREATE OR REPLACE FUNCTION decrement_sessions_on_attendance()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.attended = true AND (OLD.attended = false OR OLD.attended IS NULL) THEN
    UPDATE toddler_registrations
    SET sessions_remaining = GREATEST(sessions_remaining - 1, 0),
        updated_at = NOW()
    WHERE id = NEW.registration_id;

    NEW.attended_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_decrement_sessions
BEFORE UPDATE ON toddler_session_bookings
FOR EACH ROW EXECUTE FUNCTION decrement_sessions_on_attendance();

-- ============================================
-- 8. SEED: Generate sessions for next 3 months
-- Tuesdays and Thursdays at 10:00 AM
-- ============================================
INSERT INTO toddler_sessions (session_date, session_time, capacity)
SELECT
  d::date,
  '10:00'::time,
  15
FROM generate_series(
  CURRENT_DATE,
  CURRENT_DATE + INTERVAL '3 months',
  INTERVAL '1 day'
) d
WHERE EXTRACT(DOW FROM d) IN (2, 4) -- Tuesday = 2, Thursday = 4
ON CONFLICT DO NOTHING;
