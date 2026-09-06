import { processNotifications } from "../../lib/jobs";
export default async function appointmentEmails() {
  try {
    const result = await processNotifications();
    return new Response(JSON.stringify(result));
  } catch {
    return new Response("Notification processing unavailable", { status: 503 });
  }
}
export const config = { schedule: "*/5 * * * *" };
