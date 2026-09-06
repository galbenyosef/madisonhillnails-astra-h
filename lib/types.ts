export type Service = {
  id: string;
  name: string;
  category: string;
  description: string;
  duration_minutes: number;
  buffer_minutes: number;
  price_cents: number | null;
  active: boolean;
};
export type Technician = { id: string; name: string; active: boolean };
export type Appointment = {
  id: string;
  customer_id: string | null;
  customer_name: string;
  customer_email: string | null;
  customer_phone: string;
  service_id: string;
  service_name: string;
  technician_id: string;
  technician_name: string;
  start_at: string;
  end_at: string;
  status: "confirmed" | "canceled" | "completed" | "no_show";
  source: "online" | "admin";
  notes: string;
  revision: number;
  price_cents: number | null;
  cancellation_reason: string | null;
  cancellation_hours_snapshot: number;
  policy_text_snapshot: string;
};
export type TimeBlock = {
  id: string;
  technician_id: string;
  start_at: string;
  end_at: string;
  reason: string;
};
export type Slot = {
  start_at: string;
  technician_id: string;
  technician_name: string;
};
export type BookingSettings = {
  online_booking_enabled: boolean;
  capacity_confirmed: boolean;
  lead_hours: number;
  horizon_days: number;
  max_upcoming: number;
  cancellation_hours: number;
  policy_text: string;
};
export type ActionResult = { ok: boolean; message: string; id?: string };
