import { z } from "zod";

export const loginSchema = z.object({
  email: z.email().max(254),
  password: z.string().min(1).max(128),
  website: z.string().max(0),
});
export const signupSchema = loginSchema.extend({
  name: z.string().trim().min(2).max(80),
  password: z.string().min(12, "Use at least 12 characters.").max(128),
});
export const bookingSchema = z.object({
  serviceId: z.uuid(),
  technicianId: z.uuid(),
  startAt: z.iso.datetime({ offset: true }),
  name: z.string().trim().min(2).max(80),
  phone: z
    .string()
    .trim()
    .regex(/^\+?[\d ()\-.]{7,25}$/, "Enter a valid phone number.")
    .refine((value) => {
      const digits = value.replace(/\D/g, "");
      return digits.length >= 7 && digits.length <= 15;
    }, "Enter a valid phone number."),
  acceptPolicy: z.literal(true),
  requestId: z.uuid(),
});
export const blockedEmailDomains = new Set([
  "mailinator.com",
  "guerrillamail.com",
  "10minutemail.com",
  "tempmail.com",
  "yopmail.com",
  "example.com",
  "example.org",
  "example.net",
]);
export function isAllowedEmail(email: string) {
  return !blockedEmailDomains.has(email.toLowerCase().split("@").at(-1) ?? "");
}
export function safeNext(value: string | null | undefined) {
  if (
    !value ||
    !value.startsWith("/") ||
    value.startsWith("//") ||
    /[\\\r\n]/.test(value)
  )
    return "/appointments";
  return value.startsWith("/admin") ||
    value.startsWith("/appointments") ||
    value.startsWith("/book") ||
    value.startsWith("/account/security")
    ? value
    : "/appointments";
}
export function publicError(message: string): string {
  const known = [
    "That time is no longer available.",
    "Please verify your email before booking.",
    "Online booking is not open yet.",
    "Your account cannot make appointments. Please contact the salon.",
    "Please wait a minute before trying again.",
    "You have reached the limit for upcoming appointments.",
    "This appointment was changed. Refresh and try again.",
    "Please contact the salon to change this appointment.",
    "This service or technician is unavailable.",
    "Choose a time within the booking window.",
    "This time is outside working hours.",
    "Staff access and two-factor authentication are required.",
    "A verified customer account with this email was not found.",
    "Configure services, staff hours, and capacity before opening booking.",
    "Customer account unavailable.",
    "Appointment unavailable.",
    "An appointment must start before it can be marked complete or missed.",
  ];
  return (
    known.find((text) => message.includes(text)) ??
    "We couldn’t save that change. Please refresh and try again."
  );
}
