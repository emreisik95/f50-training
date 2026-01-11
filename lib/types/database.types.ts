export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "member" | "front_desk" | "coach" | "admin";
export type MembershipStatus = "active" | "frozen" | "cancelled" | "expired";
export type PlanType = "day_pass" | "entry_pack" | "monthly" | "quarterly" | "yearly";
export type PaymentMethod = "cash" | "card" | "bank_transfer";
export type CheckinResult = "allowed" | "denied";
export type BookingStatus = "booked" | "waitlist" | "cancelled" | "noshow";
export type ClassStatus = "scheduled" | "cancelled" | "completed";
export type DeviceStatus = "active" | "inactive" | "maintenance";

export interface Database {
  public: {
    Tables: {
      staff_users: {
        Row: {
          id: string;
          role: UserRole;
          full_name: string;
          email: string;
          phone: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          role?: UserRole;
          full_name: string;
          email: string;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          role?: UserRole;
          full_name?: string;
          email?: string;
          phone?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      members: {
        Row: {
          id: string;
          user_id: string | null;
          full_name: string;
          email: string;
          phone: string;
          date_of_birth: string | null;
          gender: string | null;
          address: string | null;
          emergency_contact_name: string | null;
          emergency_contact_phone: string | null;
          profile_photo_url: string | null;
          internal_notes: string | null;
          is_active: boolean;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          full_name: string;
          email: string;
          phone: string;
          date_of_birth?: string | null;
          gender?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          profile_photo_url?: string | null;
          internal_notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          user_id?: string | null;
          full_name?: string;
          email?: string;
          phone?: string;
          date_of_birth?: string | null;
          gender?: string | null;
          address?: string | null;
          emergency_contact_name?: string | null;
          emergency_contact_phone?: string | null;
          profile_photo_url?: string | null;
          internal_notes?: string | null;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          type: PlanType;
          description: string | null;
          price: number;
          validity_days: number;
          daily_checkin_limit: number;
          total_credits: number | null;
          includes_classes: boolean;
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: PlanType;
          description?: string | null;
          price: number;
          validity_days: number;
          daily_checkin_limit?: number;
          total_credits?: number | null;
          includes_classes?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: PlanType;
          description?: string | null;
          price?: number;
          validity_days?: number;
          daily_checkin_limit?: number;
          total_credits?: number | null;
          includes_classes?: boolean;
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
      memberships: {
        Row: {
          id: string;
          member_id: string;
          plan_id: string;
          status: MembershipStatus;
          start_at: string;
          end_at: string;
          remaining_credits: number | null;
          freeze_count: number;
          notes: string | null;
          created_at: string;
          updated_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          member_id: string;
          plan_id: string;
          status?: MembershipStatus;
          start_at: string;
          end_at: string;
          remaining_credits?: number | null;
          freeze_count?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          member_id?: string;
          plan_id?: string;
          status?: MembershipStatus;
          start_at?: string;
          end_at?: string;
          remaining_credits?: number | null;
          freeze_count?: number;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
        };
      };
      payments: {
        Row: {
          id: string;
          membership_id: string;
          member_id: string;
          amount: number;
          payment_method: PaymentMethod;
          payment_date: string;
          reference_number: string | null;
          notes: string | null;
          created_at: string;
          created_by: string | null;
        };
        Insert: {
          id?: string;
          membership_id: string;
          member_id: string;
          amount: number;
          payment_method: PaymentMethod;
          payment_date?: string;
          reference_number?: string | null;
          notes?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
        Update: {
          id?: string;
          membership_id?: string;
          member_id?: string;
          amount?: number;
          payment_method?: PaymentMethod;
          payment_date?: string;
          reference_number?: string | null;
          notes?: string | null;
          created_at?: string;
          created_by?: string | null;
        };
      };
      devices: {
        Row: {
          id: string;
          name: string;
          status: DeviceStatus;
          last_seen_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          status?: DeviceStatus;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          status?: DeviceStatus;
          last_seen_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      checkins: {
        Row: {
          id: string;
          member_id: string;
          device_id: string;
          scanned_at: string;
          result: CheckinResult;
          reason: string | null;
          token_jti: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          member_id: string;
          device_id: string;
          scanned_at?: string;
          result: CheckinResult;
          reason?: string | null;
          token_jti: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          member_id?: string;
          device_id?: string;
          scanned_at?: string;
          result?: CheckinResult;
          reason?: string | null;
          token_jti?: string;
          created_at?: string;
        };
      };
      checkin_token_uses: {
        Row: {
          jti: string;
          member_id: string;
          device_id: string;
          used_at: string;
          expires_at: string;
        };
        Insert: {
          jti: string;
          member_id: string;
          device_id: string;
          used_at?: string;
          expires_at: string;
        };
        Update: {
          jti?: string;
          member_id?: string;
          device_id?: string;
          used_at?: string;
          expires_at?: string;
        };
      };
      classes: {
        Row: {
          id: string;
          coach_id: string;
          branch_id: string | null;
          title: string;
          description: string | null;
          starts_at: string;
          duration_min: number;
          capacity: number;
          status: ClassStatus;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          coach_id: string;
          branch_id?: string | null;
          title: string;
          description?: string | null;
          starts_at: string;
          duration_min: number;
          capacity: number;
          status?: ClassStatus;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          coach_id?: string;
          branch_id?: string | null;
          title?: string;
          description?: string | null;
          starts_at?: string;
          duration_min?: number;
          capacity?: number;
          status?: ClassStatus;
          created_at?: string;
          updated_at?: string;
        };
      };
      class_bookings: {
        Row: {
          id: string;
          class_id: string;
          member_id: string;
          status: BookingStatus;
          booked_at: string;
          cancelled_at: string | null;
          waitlist_position: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          class_id: string;
          member_id: string;
          status?: BookingStatus;
          booked_at?: string;
          cancelled_at?: string | null;
          waitlist_position?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          class_id?: string;
          member_id?: string;
          status?: BookingStatus;
          booked_at?: string;
          cancelled_at?: string | null;
          waitlist_position?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
    Enums: {
      user_role: UserRole;
      membership_status: MembershipStatus;
      plan_type: PlanType;
      payment_method: PaymentMethod;
      checkin_result: CheckinResult;
      booking_status: BookingStatus;
      class_status: ClassStatus;
      device_status: DeviceStatus;
    };
  };
}
