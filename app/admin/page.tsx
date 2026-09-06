export const dynamic = "force-dynamic";
import { requireStaff } from "@/lib/auth";
import { database } from "@/lib/db";
import { settings, dateSchema } from "@/lib/scheduling";
import { today } from "@/lib/format";
import { AdminDashboard, type AdminData } from "@/components/admin-dashboard";
export const metadata = {
  title: "Staff dashboard",
  robots: { index: false, follow: false },
};
export default async function Admin({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | undefined>>;
}) {
  const user = await requireStaff();
  const p = await searchParams;
  const date = dateSchema.safeParse(p.date).success ? p.date! : today();
  const db = database();
  const [
    appointments,
    blocks,
    services,
    technicians,
    cfg,
    audit,
    notifications,
  ] = await Promise.all([
    db.query(
      "select *,start_at>now() is_future from appointments where (start_at at time zone 'America/New_York')::date=$1::date order by start_at",
      [date],
    ),
    db.query(
      "select r.*,t.name technician_name from reservations r join technicians t on t.id=r.technician_id where appointment_id is null and tstzrange(start_at,end_at,'[)') && tstzrange($1::date::timestamp at time zone 'America/New_York',($1::date+1)::timestamp at time zone 'America/New_York','[)') order by start_at",
      [date],
    ),
    db.query("select * from services order by name"),
    db.query(`select t.*,coalesce((select json_agg(service_id) from technician_services where technician_id=t.id),'[]') services,
coalesce((select json_agg(json_build_object('weekday',weekday,'opens',opens,'closes',closes) order by weekday) from working_hours where technician_id=t.id),'[]') hours from technicians t order by name`),
    settings(db),
    db.query(
      "select id,action,entity_id,created_at from audit_log order by created_at desc limit 100",
    ),
    db.query(
      "select id,kind,status,due_at,attempts from notification_jobs order by due_at desc limit 100",
    ),
  ]);
  const data = JSON.parse(
    JSON.stringify({
      appointments: appointments.rows,
      blocks: blocks.rows,
      services: services.rows,
      technicians: technicians.rows,
      settings: cfg,
      audit: audit.rows,
      notifications: notifications.rows,
    }),
  ) as AdminData;
  return (
    <main id="main" className="app-page">
      <AdminDashboard
        data={data}
        date={date}
        user={{ name: user.name, email: user.email }}
      />
    </main>
  );
}
