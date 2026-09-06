"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Catalog } from "@/lib/data";
import type { Appointment, Slot } from "@/lib/types";
import { money, salonDate, today } from "@/lib/format";
export async function mutate(action: string, payload: unknown) {
  const response = await fetch("/api/booking", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ action, payload }),
  });
  const result = await response.json();
  if (!response.ok) throw new Error(result.message || "Please try again.");
  return result;
}
export function BookingForm({
  catalog,
  user,
  serviceId,
  original,
  admin = false,
  onSaved,
}: {
  catalog: Catalog;
  user: { name: string; email: string };
  serviceId?: string;
  original?: Appointment;
  admin?: boolean;
  onSaved?: () => void;
}) {
  const router = useRouter();
  const [service, setService] = useState(
    original?.service_id || serviceId || "",
  );
  const [date, setDate] = useState(
    original ? salonDate(original.start_at, "yyyy-MM-dd") : today(),
  );
  const [tech, setTech] = useState("");
  const [availability, setAvailability] = useState<{
    key: string;
    slots: Slot[];
    error: string;
  }>({ key: "", slots: [], error: "" });
  const [selected, setSelected] = useState<Slot | null>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [requestId] = useState(() => crypto.randomUUID());
  const selectedService = catalog.services.find((s) => s.id === service);
  const editId = original?.id;
  const requestKey = `${service}/${date}/${editId || ""}`;
  const available = availability.key === requestKey ? availability.slots : [];
  const loading = Boolean(service && date && availability.key !== requestKey);
  useEffect(() => {
    if (!service || !date) return;
    const abort = new AbortController();
    fetch(
      `/api/booking?service=${encodeURIComponent(service)}&date=${encodeURIComponent(date)}${editId ? `&edit=${editId}` : ""}`,
      { signal: abort.signal },
    )
      .then(async (r) => {
        const data = await r.json();
        if (!r.ok) throw new Error(data.message);
        setAvailability({ key: requestKey, slots: data, error: "" });
      })
      .catch((e) => {
        if (e.name !== "AbortError")
          setAvailability({ key: requestKey, slots: [], error: e.message });
      });
    return () => abort.abort();
  }, [service, date, editId, requestKey]);
  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected) return;
    setBusy(true);
    setMessage("");
    const f = new FormData(e.currentTarget);
    try {
      await mutate("save", {
        serviceId: service,
        technicianId: selected.technician_id,
        startAt: selected.start_at,
        name: String(f.get("name")),
        phone: String(f.get("phone")),
        email: admin ? String(f.get("email") || "") : undefined,
        notes: admin ? String(f.get("notes") || "") : undefined,
        acceptPolicy: f.get("policy") === "on",
        requestId,
        id: original?.id,
        revision: original?.revision,
      });
      if (onSaved) onSaved();
      else {
        router.push("/appointments?success=1");
        router.refresh();
      }
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "Please try again.");
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="booking-layout">
      <form className="panel" onSubmit={submit}>
        <div className="booking-stage">
          <p className="step-label">
            <span>1</span> Choose your service
          </p>
          <label className="field">
            Service
            <select
              value={service}
              onChange={(e) => {
                setService(e.target.value);
                setSelected(null);
                setMessage("");
              }}
              required
            >
              <option value="">Select a service</option>
              {catalog.services.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name} · {s.duration_minutes} min · {money(s.price_cents)}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="booking-stage">
          <p className="step-label">
            <span>2</span> Find your moment
          </p>
          <div className="form-grid">
            <label className="field">
              Date
              <input
                type="date"
                value={date}
                min={today()}
                onChange={(e) => {
                  setDate(e.target.value);
                  setSelected(null);
                  setMessage("");
                }}
                required
              />
            </label>
            <label className="field">
              Technician preference
              <select
                value={tech}
                onChange={(e) => {
                  setTech(e.target.value);
                  setSelected(null);
                }}
              >
                <option value="">Any available technician</option>
                {catalog.technicians.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          </div>
          <p className="muted" style={{ marginTop: 12 }}>
            All times are Eastern Time (Madison, NJ).
          </p>
          <div
            className="slots"
            aria-label="Available appointments"
            aria-busy={loading}
          >
            {loading ? (
              <p className="muted">Finding available times…</p>
            ) : (
              available
                .filter((s) => !tech || s.technician_id === tech)
                .map((s) => (
                  <button
                    type="button"
                    className="slot"
                    key={`${s.start_at}${s.technician_id}`}
                    aria-pressed={selected === s}
                    onClick={() => setSelected(s)}
                  >
                    {salonDate(s.start_at, "h:mm a")} · {s.technician_name}
                  </button>
                ))
            )}
          </div>
          {service &&
            !loading &&
            !available.filter((s) => !tech || s.technician_id === tech)
              .length && (
              <p className="muted">
                No appointments available for this selection. Try another day or
                technician.
              </p>
            )}
        </div>
        <div className="booking-stage">
          <p className="step-label">
            <span>3</span> Your details
          </p>
          <div className="form-grid">
            <label className="field">
              Name
              <input
                name="name"
                autoComplete="name"
                defaultValue={
                  original?.customer_name || (admin ? "" : user.name)
                }
                required
                minLength={2}
                maxLength={80}
                readOnly={Boolean(original) && !admin}
              />
            </label>
            <label className="field">
              Contact phone
              <input
                name="phone"
                type="tel"
                autoComplete="tel"
                defaultValue={original?.customer_phone}
                required
                maxLength={25}
                readOnly={Boolean(original) && !admin}
              />
            </label>
            {admin && (
              <>
                <label className="field full">
                  Email for appointment notifications (optional)
                  <input
                    name="email"
                    type="email"
                    defaultValue={original?.customer_email ?? ""}
                    readOnly={Boolean(original?.customer_id)}
                    maxLength={254}
                  />
                </label>
                <label className="field full">
                  Private staff notes
                  <textarea
                    name="notes"
                    defaultValue={original?.notes}
                    maxLength={1000}
                  />
                </label>
              </>
            )}
          </div>
          <label className="check" style={{ marginTop: 22 }}>
            <input type="checkbox" name="policy" required />
            <span>
              {admin ? (
                "I have reviewed this appointment with the customer and confirmed permission to send any appointment emails."
              ) : (
                <>
                  I agree to the <Link href="/policies">booking policy</Link>{" "}
                  below and have read the{" "}
                  <Link href="/privacy">privacy notice</Link>.
                </>
              )}
            </span>
          </label>
        </div>
        <button
          className="button"
          style={{ marginTop: 25 }}
          disabled={busy || !selected}
        >
          {busy
            ? "Saving your appointment…"
            : original
              ? "Save appointment changes"
              : admin
                ? "Add appointment"
                : "Confirm my appointment"}
        </button>
        <p role="status" className="feedback">
          {message ||
            (availability.key === requestKey ? availability.error : "")}
        </p>
      </form>
      <aside className="panel booking-summary">
        <span className="eyebrow">YOUR LITTLE ME-TIME</span>
        <h3>{selectedService?.name || "Something to look forward to."}</h3>
        {selectedService && (
          <p>
            {selectedService.duration_minutes} minutes ·{" "}
            {money(selectedService.price_cents)}
          </p>
        )}
        {selected && (
          <p>
            <strong>{salonDate(selected.start_at)}</strong>
            <br />
            With {selected.technician_name}
          </p>
        )}
        <p>
          Madison Hill Nails
          <br />
          349 Main St, Madison, NJ 07940
        </p>
        <p>{original?.policy_text_snapshot ?? catalog.settings.policy_text}</p>
        <p>
          Online changes close{" "}
          {original?.cancellation_hours_snapshot ??
            catalog.settings.cancellation_hours}{" "}
          hours before your appointment. After that, please visit the salon for
          assistance.
        </p>
        <p>No credit card or payment is collected on this website.</p>
      </aside>
    </div>
  );
}
export function CancelButton({
  appointment,
  onSaved,
}: {
  appointment: Appointment;
  onSaved?: () => void;
}) {
  const [confirm, setConfirm] = useState(false);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div>
      {!confirm ? (
        <button className="link-button" onClick={() => setConfirm(true)}>
          Cancel appointment
        </button>
      ) : (
        <div>
          <p className="muted">Cancel this appointment and release the time?</p>
          <div className="actions">
            <button
              className="button secondary"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await mutate("cancel", {
                    id: appointment.id,
                    revision: appointment.revision,
                    reason: "Canceled through website",
                  });
                  if (onSaved) onSaved();
                  else window.location.reload();
                } catch (e) {
                  setMessage(
                    e instanceof Error ? e.message : "Please try again.",
                  );
                } finally {
                  setBusy(false);
                }
              }}
            >
              Yes, cancel
            </button>
            <button className="link-button" onClick={() => setConfirm(false)}>
              Keep appointment
            </button>
          </div>
        </div>
      )}
      <p className="feedback" role="status">
        {message}
      </p>
    </div>
  );
}
