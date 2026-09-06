import { actor } from "@/lib/auth";
import { database, transaction, mailConfigured } from "@/lib/db";
import {
  adminChange,
  cancelAppointment,
  ownAppointment,
  saveAppointment,
  slots,
} from "@/lib/scheduling";
import { publicError } from "@/lib/validation";
import { z } from "zod";
import { requestAllowed } from "@/lib/request-limit";
export const dynamic = "force-dynamic";
const json = (value: unknown, status = 200) =>
  Response.json(value, {
    status,
    headers: {
      "Cache-Control": "private, no-store",
      "X-Robots-Tag": "noindex",
    },
  });
export async function GET(request: Request) {
  try {
    const who = await actor(request.headers);
    if (!who) return json({ message: "Please sign in to continue." }, 401);
    if (!(await requestAllowed(database(), `availability:${who.id}`, 60)))
      return json(
        { message: "Please wait a minute before trying again." },
        429,
      );
    if (who.blocked)
      return json(
        { message: "Please contact the salon for booking help." },
        403,
      );
    const params = new URL(request.url).searchParams;
    const edit = params.get("edit");
    if (edit) await ownAppointment(database(), who, edit);
    return json(
      await slots(
        database(),
        params.get("service") ?? "",
        params.get("date") ?? "",
        who.staff,
        edit,
      ),
    );
  } catch {
    return json(
      { message: "Availability could not be loaded. Please try again." },
      400,
    );
  }
}
export async function POST(request: Request) {
  if (
    !process.env.BETTER_AUTH_URL ||
    request.headers.get("origin") !==
      new URL(process.env.BETTER_AUTH_URL).origin
  )
    return json({ message: "Invalid request." }, 403);
  try {
    const who = await actor(request.headers);
    if (!who) return json({ message: "Please sign in to continue." }, 401);
    if (
      !(await requestAllowed(
        database(),
        `changes:${who.id}`,
        who.staff ? 60 : 10,
      ))
    )
      return json(
        { message: "Please wait a minute before trying again." },
        429,
      );
    const text = await request.text();
    if (text.length > 16000)
      return json({ message: "Request too large." }, 413);
    const body = z
      .object({ action: z.string(), payload: z.unknown() })
      .parse(JSON.parse(text));
    if (!["save", "cancel"].includes(body.action) && !who.staff)
      return json(
        { message: "Staff access and two-factor authentication are required." },
        403,
      );
    if (body.action === "save" && !who.staff && !mailConfigured())
      return json(
        {
          message:
            "Online booking is getting ready. Please visit the salon for help.",
        },
        503,
      );
    if (
      body.action === "settings" &&
      (body.payload as { online_booking_enabled?: boolean })
        ?.online_booking_enabled === true &&
      !mailConfigured()
    )
      return json(
        { message: "Configure email delivery before opening online booking." },
        503,
      );
    const result = await transaction((db) =>
      body.action === "save"
        ? saveAppointment(db, who, body.payload)
        : body.action === "cancel"
          ? cancelAppointment(db, who, body.payload)
          : adminChange(db, who, body),
    );
    return json({
      ok: true,
      id: result.id,
      message:
        body.action === "cancel"
          ? "Appointment canceled."
          : "Saved successfully.",
    });
  } catch (error) {
    if (error instanceof z.ZodError)
      return json(
        { message: "Please check the form fields and try again." },
        400,
      );
    const code = (error as { code?: string }).code;
    return json(
      {
        message:
          code === "23P01"
            ? "That time is no longer available."
            : publicError(error instanceof Error ? error.message : ""),
      },
      409,
    );
  }
}
