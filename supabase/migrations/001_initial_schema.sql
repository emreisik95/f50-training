-- F50 Gym Management System - Initial Schema
-- Migration 001: Core Tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE user_role AS ENUM ('member', 'front_desk', 'coach', 'admin');
CREATE TYPE membership_status AS ENUM ('active', 'frozen', 'cancelled', 'expired');
CREATE TYPE plan_type AS ENUM ('day_pass', 'entry_pack', 'monthly', 'quarterly', 'yearly');
CREATE TYPE payment_method AS ENUM ('cash', 'card', 'bank_transfer');
CREATE TYPE checkin_result AS ENUM ('allowed', 'denied');
CREATE TYPE booking_status AS ENUM ('booked', 'waitlist', 'cancelled', 'noshow');
CREATE TYPE class_status AS ENUM ('scheduled', 'cancelled', 'completed');
CREATE TYPE device_status AS ENUM ('active', 'inactive', 'maintenance');

-- ============================================
-- STAFF USERS TABLE
-- ============================================
CREATE TABLE staff_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  role user_role NOT NULL DEFAULT 'front_desk',
  full_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  phone TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEMBERS TABLE
-- ============================================
CREATE TABLE members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  date_of_birth DATE,
  gender TEXT,
  address TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  profile_photo_url TEXT,
  internal_notes TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

-- ============================================
-- PLANS TABLE
-- ============================================
CREATE TABLE plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type plan_type NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  validity_days INTEGER NOT NULL,
  daily_checkin_limit INTEGER DEFAULT 1,
  total_credits INTEGER,
  includes_classes BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- MEMBERSHIPS TABLE
-- ============================================
CREATE TABLE memberships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES plans(id) ON DELETE RESTRICT,
  status membership_status DEFAULT 'active',
  start_at TIMESTAMPTZ NOT NULL,
  end_at TIMESTAMPTZ NOT NULL,
  remaining_credits INTEGER,
  freeze_count INTEGER DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES staff_users(id)
);

-- ============================================
-- PAYMENTS TABLE
-- ============================================
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  membership_id UUID NOT NULL REFERENCES memberships(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  payment_method payment_method NOT NULL,
  payment_date TIMESTAMPTZ DEFAULT NOW(),
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  created_by UUID REFERENCES staff_users(id)
);

-- ============================================
-- DEVICES TABLE (Kiosk Registry)
-- ============================================
CREATE TABLE devices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  status device_status DEFAULT 'active',
  last_seen_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHECKINS TABLE
-- ============================================
CREATE TABLE checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  scanned_at TIMESTAMPTZ DEFAULT NOW(),
  result checkin_result NOT NULL,
  reason TEXT,
  token_jti UUID NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CHECKIN TOKEN USES (Replay Protection)
-- ============================================
CREATE TABLE checkin_token_uses (
  jti UUID PRIMARY KEY,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  device_id UUID NOT NULL REFERENCES devices(id) ON DELETE RESTRICT,
  used_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ NOT NULL
);

-- ============================================
-- CLASSES TABLE
-- ============================================
CREATE TABLE classes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  coach_id UUID NOT NULL REFERENCES staff_users(id) ON DELETE RESTRICT,
  branch_id UUID,
  title TEXT NOT NULL,
  description TEXT,
  starts_at TIMESTAMPTZ NOT NULL,
  duration_min INTEGER NOT NULL CHECK (duration_min > 0),
  capacity INTEGER NOT NULL CHECK (capacity > 0),
  status class_status DEFAULT 'scheduled',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- CLASS BOOKINGS TABLE
-- ============================================
CREATE TABLE class_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  class_id UUID NOT NULL REFERENCES classes(id) ON DELETE CASCADE,
  member_id UUID NOT NULL REFERENCES members(id) ON DELETE CASCADE,
  status booking_status DEFAULT 'booked',
  booked_at TIMESTAMPTZ DEFAULT NOW(),
  cancelled_at TIMESTAMPTZ,
  waitlist_position INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, member_id)
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_staff_users_role ON staff_users(role);
CREATE INDEX idx_staff_users_active ON staff_users(is_active);
CREATE INDEX idx_members_email ON members(email);
CREATE INDEX idx_members_phone ON members(phone);
CREATE INDEX idx_members_active ON members(is_active) WHERE deleted_at IS NULL;
CREATE INDEX idx_members_deleted_at ON members(deleted_at);
CREATE INDEX idx_memberships_member ON memberships(member_id);
CREATE INDEX idx_memberships_status ON memberships(status);
CREATE INDEX idx_memberships_dates ON memberships(start_at, end_at);
CREATE INDEX idx_payments_member ON payments(member_id);
CREATE INDEX idx_payments_membership ON payments(membership_id);
CREATE INDEX idx_payments_date ON payments(payment_date);
CREATE INDEX idx_checkins_member ON checkins(member_id);
CREATE INDEX idx_checkins_device ON checkins(device_id);
CREATE INDEX idx_checkins_scanned_at ON checkins(scanned_at DESC);
CREATE INDEX idx_token_uses_expires_at ON checkin_token_uses(expires_at);
CREATE INDEX idx_classes_starts_at ON classes(starts_at);
CREATE INDEX idx_classes_coach ON classes(coach_id);
CREATE INDEX idx_classes_status ON classes(status);
CREATE INDEX idx_class_bookings_class ON class_bookings(class_id);
CREATE INDEX idx_class_bookings_member ON class_bookings(member_id);
CREATE INDEX idx_class_bookings_status ON class_bookings(status);

-- ============================================
-- UPDATED_AT TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_staff_users_updated_at
  BEFORE UPDATE ON staff_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_members_updated_at
  BEFORE UPDATE ON members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_plans_updated_at
  BEFORE UPDATE ON plans
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_memberships_updated_at
  BEFORE UPDATE ON memberships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_devices_updated_at
  BEFORE UPDATE ON devices
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_classes_updated_at
  BEFORE UPDATE ON classes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_class_bookings_updated_at
  BEFORE UPDATE ON class_bookings
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
