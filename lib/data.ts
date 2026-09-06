import "server-only";
import { configured, database } from "./db";
import { settings } from "./scheduling";
import type { Service, Technician, BookingSettings } from "./types";
export async function catalog() {
  if (!configured()) return null;
  try {
    const db = database();
    const [services, technicians, cfg] = await Promise.all([
      db.query<Service>(
        "select * from services where active order by category,name",
      ),
      db.query<Technician>(
        "select * from technicians where active order by name",
      ),
      settings(db),
    ]);
    return {
      services: services.rows,
      technicians: technicians.rows,
      settings: cfg,
    };
  } catch {
    return null;
  }
}
export type Catalog = {
  services: Service[];
  technicians: Technician[];
  settings: BookingSettings;
};
