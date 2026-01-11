-- F50 Gym Management System - Row Level Security Policies
-- Migration 002: RLS Policies

-- ============================================
-- ENABLE RLS ON ALL TABLES
-- ============================================
ALTER TABLE staff_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
ALTER TABLE plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE devices ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE checkin_token_uses ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_bookings ENABLE ROW LEVEL SECURITY;

-- ============================================
-- HELPER FUNCTIONS
-- ============================================

-- Get current user's role
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID)
RETURNS user_role AS $$
  SELECT role FROM staff_users WHERE id = user_id AND is_active = true;
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is staff (any role except member)
CREATE OR REPLACE FUNCTION is_staff(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_users
    WHERE id = user_id AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_id UUID)
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM staff_users
    WHERE id = user_id
    AND role = 'admin'
    AND is_active = true
  );
$$ LANGUAGE SQL SECURITY DEFINER;

-- Get member ID for current user
CREATE OR REPLACE FUNCTION get_member_id(user_id UUID)
RETURNS UUID AS $$
  SELECT id FROM members WHERE user_id = user_id AND deleted_at IS NULL;
$$ LANGUAGE SQL SECURITY DEFINER;

-- ============================================
-- STAFF_USERS POLICIES
-- ============================================
CREATE POLICY "Staff can view all staff"
  ON staff_users FOR SELECT
  TO authenticated
  USING (is_staff(auth.uid()));

CREATE POLICY "Admins can insert staff"
  ON staff_users FOR INSERT
  TO authenticated
  WITH CHECK (is_admin(auth.uid()));

CREATE POLICY "Admins can update staff"
  ON staff_users FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

CREATE POLICY "Admins can delete staff"
  ON staff_users FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- MEMBERS POLICIES
-- ============================================
CREATE POLICY "Staff can view active members"
  ON members FOR SELECT
  TO authenticated
  USING (is_staff(auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Members can view own profile"
  ON members FOR SELECT
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Staff can create members"
  ON members FOR INSERT
  TO authenticated
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update members"
  ON members FOR UPDATE
  TO authenticated
  USING (is_staff(auth.uid()) AND deleted_at IS NULL);

CREATE POLICY "Members can update own profile"
  ON members FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid() AND deleted_at IS NULL);

CREATE POLICY "Admins can soft delete members"
  ON members FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- PLANS POLICIES
-- ============================================
CREATE POLICY "Anyone can view active plans"
  ON plans FOR SELECT
  TO authenticated
  USING (is_active = true OR is_staff(auth.uid()));

CREATE POLICY "Admins can manage plans"
  ON plans FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ============================================
-- MEMBERSHIPS POLICIES
-- ============================================
CREATE POLICY "Staff can view all memberships"
  ON memberships FOR SELECT
  TO authenticated
  USING (is_staff(auth.uid()));

CREATE POLICY "Members can view own memberships"
  ON memberships FOR SELECT
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can create memberships"
  ON memberships FOR INSERT
  TO authenticated
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Staff can update memberships"
  ON memberships FOR UPDATE
  TO authenticated
  USING (is_staff(auth.uid()));

CREATE POLICY "Admins can delete memberships"
  ON memberships FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- PAYMENTS POLICIES
-- ============================================
CREATE POLICY "Staff can view all payments"
  ON payments FOR SELECT
  TO authenticated
  USING (is_staff(auth.uid()));

CREATE POLICY "Members can view own payments"
  ON payments FOR SELECT
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can record payments"
  ON payments FOR INSERT
  TO authenticated
  WITH CHECK (is_staff(auth.uid()));

CREATE POLICY "Admins can update payments"
  ON payments FOR UPDATE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- DEVICES POLICIES
-- ============================================
CREATE POLICY "Staff can view devices"
  ON devices FOR SELECT
  TO authenticated
  USING (is_staff(auth.uid()));

CREATE POLICY "Admins can manage devices"
  ON devices FOR ALL
  TO authenticated
  USING (is_admin(auth.uid()))
  WITH CHECK (is_admin(auth.uid()));

-- ============================================
-- CHECKINS POLICIES
-- ============================================
CREATE POLICY "Staff can view all checkins"
  ON checkins FOR SELECT
  TO authenticated
  USING (is_staff(auth.uid()));

CREATE POLICY "Members can view own checkins"
  ON checkins FOR SELECT
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

-- Service role handles inserts via Edge Functions
CREATE POLICY "Service can insert checkins"
  ON checkins FOR INSERT
  TO service_role
  WITH CHECK (true);

-- ============================================
-- CHECKIN TOKEN USES POLICIES
-- ============================================
-- Only service role manages token uses
CREATE POLICY "Service can manage token uses"
  ON checkin_token_uses FOR ALL
  TO service_role
  USING (true)
  WITH CHECK (true);

-- ============================================
-- CLASSES POLICIES
-- ============================================
CREATE POLICY "Anyone can view scheduled classes"
  ON classes FOR SELECT
  TO authenticated
  USING (status IN ('scheduled', 'completed'));

CREATE POLICY "Coaches can create classes"
  ON classes FOR INSERT
  TO authenticated
  WITH CHECK (
    is_staff(auth.uid()) AND
    get_user_role(auth.uid()) IN ('coach', 'admin')
  );

CREATE POLICY "Coaches can update own classes"
  ON classes FOR UPDATE
  TO authenticated
  USING (
    is_admin(auth.uid()) OR coach_id = auth.uid()
  );

CREATE POLICY "Admins can delete classes"
  ON classes FOR DELETE
  TO authenticated
  USING (is_admin(auth.uid()));

-- ============================================
-- CLASS BOOKINGS POLICIES
-- ============================================
CREATE POLICY "Staff can view all bookings"
  ON class_bookings FOR SELECT
  TO authenticated
  USING (is_staff(auth.uid()));

CREATE POLICY "Members can view own bookings"
  ON class_bookings FOR SELECT
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can create bookings"
  ON class_bookings FOR INSERT
  TO authenticated
  WITH CHECK (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Members can cancel own bookings"
  ON class_bookings FOR UPDATE
  TO authenticated
  USING (
    member_id IN (
      SELECT id FROM members WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Staff can update bookings"
  ON class_bookings FOR UPDATE
  TO authenticated
  USING (is_staff(auth.uid()));
