import nodemailer from "nodemailer";
import { mailConfigured, transaction, type DB } from "./db";

export async function sendMail(
  to: string,
  subject: string,
  text: string,
  connection?: DB,
) {
  if (!mailConfigured()) throw new Error("Email unavailable");
  // Count attempts before delivery, including failures, to bound provider usage.
  const reserve = async (db: DB) => {
    const now = new Date().toISOString();
    for (const [period, cap] of [
      [now.slice(0, 7), 2400],
      [now.slice(0, 10), 80],
    ] as const) {
      const limit = Math.min(
        cap,
        Number(
          process.env[
            period.length === 7 ? "MAIL_MONTHLY_LIMIT" : "MAIL_DAILY_LIMIT"
          ] || cap,
        ),
      );
      if (!Number.isInteger(limit) || limit < 1)
        throw new Error("Email unavailable");
      const result = await db.query(
        `insert into mail_usage(period,sent) values($1,1)
        on conflict(period) do update set sent=mail_usage.sent+1 where mail_usage.sent < $2 returning sent`,
        [period, limit],
      );
      if (!result.rows.length) throw new Error("Email quota reached");
    }
  };
  if (connection) await reserve(connection);
  else await transaction(reserve);
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_PORT === "465",
    requireTLS: true,
    auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    connectionTimeout: 8000,
    socketTimeout: 12000,
  });
  await transport.sendMail({ from: process.env.MAIL_FROM, to, subject, text });
}
