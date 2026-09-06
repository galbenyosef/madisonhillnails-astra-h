"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  Appointment,
  BookingSettings,
  Service,
  Technician,
  TimeBlock,
} from "@/lib/types";
import { BookingForm, CancelButton, mutate } from "./booking-form";
import { SignOut } from "./auth-forms";
import { localToUTC, salonDate, money } from "@/lib/format";
type TeamMember = Technician & {
  services: string[];
  hours: { weekday: number; opens: string; closes: string }[];
};
export type AdminData = {
  appointments: (Appointment & { is_future: boolean })[];
  blocks: (TimeBlock & { technician_name: string })[];
  services: Service[];
  technicians: TeamMember[];
  settings: BookingSettings & { capacity_confirmed: boolean };
  audit: {
    id: string;
    action: string;
    entity_id: string;
    created_at: string;
  }[];
  notifications: {
    id: string;
    kind: string;
    status: string;
    due_at: string;
    attempts: number;
  }[];
};
export function AdminDashboard({
  data,
  date,
  user,
}: {
  data: AdminData;
  date: string;
  user: { name: string; email: string };
}) {
  const router = useRouter();
  const [tab, setTab] = useState("Calendar");
  const [editing, setEditing] = useState<Appointment | null>(null);
  const [service, setService] = useState<Service | null>(null);
  const [tech, setTech] = useState<TeamMember | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const refresh = () => {
    setEditing(null);
    setTab("Calendar");
    setMessage("Saved. The shared calendar is up to date.");
    router.refresh();
  };
  async function save(action: string, payload: unknown) {
    setBusy(true);
    setMessage("");
    try {
      await mutate(action, payload);
      setMessage("Saved successfully.");
      router.refresh();
      return true;
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Please try again.");
      return false;
    } finally {
      setBusy(false);
    }
  }
  const catalog = {
    services: data.services.filter((s) => s.active),
    technicians: data.technicians.filter((t) => t.active),
    settings: data.settings,
  };
  return (
    <>
      <div className="app-heading">
        <div>
          <span className="eyebrow">MADISON HILL / STAFF WORKSPACE</span>
          <h1>A good day, planned.</h1>
          <p>
            Hello, {user.name}. Online booking is{" "}
            <strong>
              {data.settings.online_booking_enabled ? "open" : "closed"}
            </strong>
            .
          </p>
        </div>
        <SignOut />
      </div>
      <nav className="tabs" aria-label="Dashboard sections">
        {[
          "Calendar",
          "Add appointment",
          "Time blocks",
          "Services",
          "Team",
          "Settings",
          "Activity",
        ].map((t) => (
          <button
            key={t}
            aria-pressed={tab === t}
            onClick={() => {
              setTab(t);
              setEditing(null);
              setMessage("");
            }}
          >
            {t}
          </button>
        ))}
      </nav>
      {message && (
        <div className="notice" role="status">
          {message}
        </div>
      )}
      {tab === "Calendar" && !editing && (
        <>
          <div className="admin-toolbar">
            <label className="field">
              Calendar date
              <input
                type="date"
                value={date}
                onChange={(e) => {
                  if (e.target.value)
                    router.push(`/admin?date=${e.target.value}`);
                }}
              />
            </label>
            <p className="muted">
              {data.appointments.filter((a) => a.status === "confirmed").length}{" "}
              confirmed · {data.blocks.length} time blocks · Eastern Time
            </p>
            <button
              className="button"
              onClick={() => setTab("Add appointment")}
            >
              + Add appointment
            </button>
          </div>
          <div className="appointment-list">
            {!data.appointments.length && (
              <div className="empty">
                <h2>A little breathing room.</h2>
                <p>No appointments on this date.</p>
              </div>
            )}
            {data.appointments.map((a) => (
              <article key={a.id} className="panel appointment-card">
                <div>
                  <span className={`badge ${a.status}`}>
                    {a.status.replace("_", " ")}
                  </span>
                  <h3>
                    {salonDate(a.start_at, "h:mm a")} · {a.customer_name}
                  </h3>
                  <p>
                    {a.service_name} · With {a.technician_name}
                  </p>
                  <p>
                    {a.customer_phone}
                    {a.customer_email ? ` · ${a.customer_email}` : ""}
                  </p>
                  <p className="muted">
                    {a.source === "admin" ? "Staff-entered" : "Online booking"}{" "}
                    · {money(a.price_cents)}
                  </p>
                  {a.notes && <p>Staff note: {a.notes}</p>}
                </div>
                {a.status === "confirmed" && (
                  <div>
                    <div className="actions">
                      <button
                        className="button secondary"
                        onClick={() => setEditing(a)}
                      >
                        Modify
                      </button>
                      <CancelButton appointment={a} onSaved={refresh} />
                    </div>
                    {!a.is_future && (
                      <div className="actions">
                        <button
                          className="link-button"
                          disabled={busy}
                          onClick={() =>
                            save("status", {
                              id: a.id,
                              revision: a.revision,
                              status: "completed",
                            })
                          }
                        >
                          Mark completed
                        </button>
                        <button
                          className="link-button"
                          disabled={busy}
                          onClick={() =>
                            save("status", {
                              id: a.id,
                              revision: a.revision,
                              status: "no_show",
                            })
                          }
                        >
                          Mark no-show
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
          {data.blocks.length > 0 && (
            <div className="notice">
              <strong>Blocked time</strong>
              {data.blocks.map((b) => (
                <p key={b.id}>
                  {salonDate(b.start_at)}–{salonDate(b.end_at)} ·{" "}
                  {b.technician_name} · {b.reason}
                </p>
              ))}
            </div>
          )}
        </>
      )}
      {(tab === "Add appointment" || editing) && (
        <div>
          {editing && (
            <div className="actions" style={{ marginBottom: 20 }}>
              <button className="link-button" onClick={() => setEditing(null)}>
                ← Back to calendar
              </button>
            </div>
          )}
          {!catalog.services.length || !catalog.technicians.length ? (
            <div className="notice">
              Add services, eligible technicians, and working hours before
              creating appointments.
            </div>
          ) : (
            <BookingForm
              key={editing?.id || "new"}
              catalog={catalog}
              user={user}
              original={editing ?? undefined}
              admin
              onSaved={refresh}
            />
          )}
        </div>
      )}
      {tab === "Time blocks" && (
        <div className="admin-split">
          <form
            className="panel"
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const f = new FormData(form);
              try {
                const success = await save("block", {
                  technician_id: f.get("technician_id"),
                  start_at: localToUTC(String(f.get("start"))),
                  end_at: localToUTC(String(f.get("end"))),
                  reason: f.get("reason"),
                });
                if (success) form.reset();
              } catch {
                setMessage("Enter valid start and end times.");
              }
            }}
          >
            <h3>Protect time on the calendar.</h3>
            <p className="muted" style={{ marginBottom: 20 }}>
              Breaks, time off, and closures block online and manual
              appointments. Times are Eastern.
            </p>
            <div className="form-grid">
              <label className="field full">
                Technician
                <select name="technician_id" required>
                  {data.technicians.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </label>
              <label className="field">
                Starts
                <input name="start" type="datetime-local" required />
              </label>
              <label className="field">
                Ends
                <input name="end" type="datetime-local" required />
              </label>
              <label className="field full">
                Reason
                <input name="reason" required minLength={2} maxLength={200} />
              </label>
            </div>
            <div className="form-actions">
              <button
                className="button"
                disabled={busy || !data.technicians.length}
              >
                Block time
              </button>
            </div>
          </form>
          <div className="panel">
            <h3>Blocks on {date}</h3>
            <p className="muted">
              Change the calendar date to view another day.
            </p>
            <div className="compact-list">
              {data.blocks.map((b) => (
                <div key={b.id}>
                  <strong>{b.technician_name}</strong>
                  <p>
                    {salonDate(b.start_at)} – {salonDate(b.end_at)}
                  </p>
                  <p>{b.reason}</p>
                  <button
                    className="link-button"
                    disabled={busy}
                    onClick={() => save("unblock", { id: b.id })}
                  >
                    Remove this block
                  </button>
                </div>
              ))}
              {!data.blocks.length && (
                <p className="muted">No blocks on this date.</p>
              )}
            </div>
          </div>
        </div>
      )}
      {tab === "Services" && (
        <div className="admin-split">
          <form
            className="panel"
            key={service?.id || "new-service"}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const f = new FormData(form);
              const price = String(f.get("price"));
              const ok = await save("service", {
                id: service?.id,
                name: f.get("name"),
                category: f.get("category"),
                description: f.get("description"),
                duration_minutes: Number(f.get("duration")),
                buffer_minutes: Number(f.get("buffer")),
                price_cents:
                  price === "" ? null : Math.round(Number(price) * 100),
                active: f.get("active") === "on",
              });
              if (ok) {
                setService(null);
                form.reset();
              }
            }}
          >
            <h3>{service ? "Edit service" : "Add a service"}</h3>
            <div className="form-grid">
              <label className="field full">
                Service name
                <input
                  name="name"
                  defaultValue={service?.name}
                  required
                  minLength={2}
                  maxLength={80}
                />
              </label>
              <label className="field">
                Category
                <input
                  name="category"
                  defaultValue={service?.category || "Nail care"}
                  maxLength={60}
                />
              </label>
              <label className="field">
                Price in dollars (optional)
                <input
                  name="price"
                  type="number"
                  min="0"
                  max="1000"
                  step="0.01"
                  defaultValue={
                    service?.price_cents != null
                      ? service.price_cents / 100
                      : ""
                  }
                />
              </label>
              <label className="field">
                Duration in minutes
                <input
                  name="duration"
                  type="number"
                  min="15"
                  max="240"
                  step="15"
                  defaultValue={service?.duration_minutes || 30}
                  required
                />
              </label>
              <label className="field">
                Cleanup buffer in minutes
                <input
                  name="buffer"
                  type="number"
                  min="0"
                  max="60"
                  step="15"
                  defaultValue={service?.buffer_minutes || 0}
                  required
                />
              </label>
              <label className="field full">
                Description
                <textarea
                  name="description"
                  defaultValue={service?.description}
                  maxLength={400}
                />
              </label>
              <label className="check">
                <input
                  name="active"
                  type="checkbox"
                  defaultChecked={service?.active ?? true}
                />
                Active and visible on website
              </label>
            </div>
            <div className="form-actions">
              <button className="button" disabled={busy}>
                Save service
              </button>
              {service && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setService(null)}
                >
                  Add new instead
                </button>
              )}
            </div>
          </form>
          <div className="panel">
            <h3>Your menu</h3>
            <p className="muted">
              Service edits affect new bookings. Existing appointments retain
              their duration and price until rescheduled.
            </p>
            <div className="compact-list">
              {data.services.map((s) => (
                <div key={s.id}>
                  <strong>{s.name}</strong>
                  <p>
                    {s.duration_minutes} min + {s.buffer_minutes} min buffer ·{" "}
                    {money(s.price_cents)} · {s.active ? "Active" : "Inactive"}
                  </p>
                  <button className="link-button" onClick={() => setService(s)}>
                    Edit service
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === "Team" && (
        <div className="admin-split">
          <form
            className="panel"
            key={tech?.id || "new-tech"}
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const f = new FormData(form);
              const hours = Array.from({ length: 7 }, (_, weekday) => ({
                weekday,
                opens: String(f.get(`open-${weekday}`)),
                closes: String(f.get(`close-${weekday}`)),
              })).filter((h) => f.get(`day-${h.weekday}`));
              const ok = await save("technician", {
                id: tech?.id,
                name: f.get("name"),
                active: f.get("active") === "on",
                services: f.getAll("services"),
                hours,
              });
              if (ok) {
                setTech(null);
                form.reset();
              }
            }}
          >
            <h3>{tech ? "Edit technician" : "Add a technician"}</h3>
            <label className="field">
              Display name
              <input
                name="name"
                defaultValue={tech?.name}
                required
                minLength={2}
                maxLength={80}
              />
            </label>
            <label className="check" style={{ marginBlock: 20 }}>
              <input
                name="active"
                type="checkbox"
                defaultChecked={tech?.active ?? true}
              />
              Available for bookings
            </label>
            <h3>Qualified services</h3>
            {data.services.map((s) => (
              <label key={s.id} className="check">
                <input
                  name="services"
                  type="checkbox"
                  value={s.id}
                  defaultChecked={tech?.services.includes(s.id)}
                />
                {s.name}
              </label>
            ))}
            <h3 style={{ marginTop: 25 }}>Working hours · Eastern</h3>
            <p className="muted" style={{ marginBottom: 15 }}>
              Only checked days are open. Add separate blocks for breaks or time
              off.
            </p>
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, i) => {
              const h = tech?.hours.find((h) => h.weekday === i);
              return (
                <div className="hours-row" key={day}>
                  <label className="check">
                    <input
                      name={`day-${i}`}
                      type="checkbox"
                      defaultChecked={Boolean(h)}
                    />
                    {day}
                  </label>
                  <label className="field">
                    {day} starts
                    <input
                      type="time"
                      name={`open-${i}`}
                      defaultValue={h?.opens.slice(0, 5) || "09:00"}
                      required
                    />
                  </label>
                  <label className="field">
                    {day} ends
                    <input
                      type="time"
                      name={`close-${i}`}
                      defaultValue={h?.closes.slice(0, 5) || "17:00"}
                      required
                    />
                  </label>
                </div>
              );
            })}
            <div className="form-actions">
              <button className="button" disabled={busy}>
                Save technician
              </button>
              {tech && (
                <button
                  type="button"
                  className="link-button"
                  onClick={() => setTech(null)}
                >
                  Add new instead
                </button>
              )}
            </div>
          </form>
          <div className="panel">
            <h3>Your team</h3>
            <p className="muted">
              Changing hours or deactivating staff does not cancel existing
              appointments. Review the calendar and contact affected customers.
            </p>
            <div className="compact-list">
              {data.technicians.map((t) => (
                <div key={t.id}>
                  <strong>{t.name}</strong>
                  <p>
                    {t.active ? "Active" : "Inactive"} · {t.services.length}{" "}
                    services · {t.hours.length} working days
                  </p>
                  <button className="link-button" onClick={() => setTech(t)}>
                    Edit technician
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
      {tab === "Settings" && (
        <div className="admin-split">
          <form
            className="panel"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              save("settings", {
                online_booking_enabled: f.get("online") === "on",
                capacity_confirmed: f.get("capacity") === "on",
                lead_hours: Number(f.get("lead")),
                horizon_days: Number(f.get("horizon")),
                max_upcoming: Number(f.get("max")),
                cancellation_hours: Number(f.get("cutoff")),
                policy_text: f.get("policy"),
              });
            }}
          >
            <h3>Booking rules</h3>
            <div className="form-grid">
              <label className="field">
                Minimum notice (hours)
                <input
                  name="lead"
                  type="number"
                  min="0"
                  max="168"
                  defaultValue={data.settings.lead_hours}
                  required
                />
              </label>
              <label className="field">
                Book ahead (days)
                <input
                  name="horizon"
                  type="number"
                  min="1"
                  max="180"
                  defaultValue={data.settings.horizon_days}
                  required
                />
              </label>
              <label className="field">
                Upcoming bookings per customer
                <input
                  name="max"
                  type="number"
                  min="1"
                  max="10"
                  defaultValue={data.settings.max_upcoming}
                  required
                />
              </label>
              <label className="field">
                Online change/cancel cutoff (hours)
                <input
                  name="cutoff"
                  type="number"
                  min="0"
                  max="336"
                  defaultValue={data.settings.cancellation_hours}
                  required
                />
              </label>
              <label className="field full">
                Customer booking policy
                <textarea
                  name="policy"
                  defaultValue={data.settings.policy_text}
                  required
                  minLength={20}
                  maxLength={1500}
                />
              </label>
              <label className="check full">
                <input
                  name="capacity"
                  type="checkbox"
                  defaultChecked={data.settings.capacity_confirmed}
                />
                I have confirmed the service menu, hours, and capacity. Each
                listed technician can serve one customer independently; shared
                stations will not reduce that capacity.
              </label>
              <label className="check full">
                <input
                  name="online"
                  type="checkbox"
                  defaultChecked={data.settings.online_booking_enabled}
                />
                Open online booking
              </label>
            </div>
            <div className="form-actions">
              <button className="button" disabled={busy}>
                Save booking rules
              </button>
            </div>
            <p className="muted" style={{ marginTop: 20 }}>
              No payment collection or automatic fees. Defaults are starting
              values for review, not confirmed salon policy.
            </p>
          </form>
          <form
            className="panel"
            onSubmit={(e) => {
              e.preventDefault();
              const f = new FormData(e.currentTarget);
              save("restrict", {
                email: f.get("email"),
                blocked: f.get("blocked") === "on",
                reason: f.get("reason"),
              });
            }}
          >
            <h3>Booking restrictions</h3>
            <p className="muted" style={{ marginBottom: 20 }}>
              Restrict new bookings and rescheduling for a customer account.
              Existing appointments remain; cancel them separately if needed.
              Staff accounts cannot be restricted here.
            </p>
            <div className="form-grid">
              <label className="field full">
                Customer account email
                <input name="email" type="email" required />
              </label>
              <label className="field full">
                Private reason
                <input name="reason" maxLength={200} />
              </label>
              <label className="check full">
                <input type="checkbox" name="blocked" defaultChecked />
                Restrict this account (uncheck to restore access)
              </label>
            </div>
            <div className="form-actions">
              <button className="button secondary" disabled={busy}>
                Update account restriction
              </button>
            </div>
          </form>
        </div>
      )}
      {tab === "Activity" && (
        <div className="admin-section">
          <div className="panel">
            <h3>Recent changes</h3>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Time</th>
                    <th>Action</th>
                    <th>Record</th>
                  </tr>
                </thead>
                <tbody>
                  {data.audit.map((a) => (
                    <tr key={a.id}>
                      <td>{salonDate(a.created_at)}</td>
                      <td>{a.action}</td>
                      <td>{a.entity_id}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="panel">
            <h3>Email delivery queue</h3>
            <p className="muted">
              Delivery requires configured email and the scheduled worker.
              Failed jobs need staff review; do not assume a customer received
              an email.
            </p>
            <div className="table-wrap">
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Scheduled</th>
                    <th>Message</th>
                    <th>Status</th>
                    <th>Attempts</th>
                  </tr>
                </thead>
                <tbody>
                  {data.notifications.map((j) => (
                    <tr key={j.id}>
                      <td>{salonDate(j.due_at)}</td>
                      <td>{j.kind}</td>
                      <td>{j.status}</td>
                      <td>{j.attempts}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
