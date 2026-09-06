import { Pool, type PoolClient, type QueryResultRow } from "pg";

let instance: Pool | undefined;
export function database() {
  if (!process.env.DATABASE_URL) throw new Error("Database unavailable");
  const url = new URL(process.env.DATABASE_URL);
  const local = ["localhost", "127.0.0.1", "[::1]"].includes(url.hostname);
  // URL SSL flags must not silently override certificate verification.
  for (const key of ["sslmode", "sslcert", "sslkey", "sslrootcert"])
    url.searchParams.delete(key);
  return (instance ??= new Pool({
    connectionString: url.toString(),
    ssl: local
      ? false
      : {
          rejectUnauthorized: true,
          ...(process.env.DATABASE_CA_CERT
            ? { ca: process.env.DATABASE_CA_CERT }
            : {}),
        },
    max: 3,
    connectionTimeoutMillis: 8000,
    idleTimeoutMillis: 15000,
    statement_timeout: 10000,
    idle_in_transaction_session_timeout: 30000,
  }));
}
export interface DB {
  query<T extends QueryResultRow = QueryResultRow>(
    sql: string,
    values?: unknown[],
  ): Promise<{ rows: T[] }>;
}
export async function transaction<T>(fn: (db: DB) => Promise<T>) {
  const connection: PoolClient = await database().connect();
  try {
    await connection.query("begin");
    const result = await fn(connection);
    await connection.query("commit");
    return result;
  } catch (error) {
    await connection.query("rollback");
    throw error;
  } finally {
    connection.release();
  }
}
export const configured = () =>
  Boolean(
    process.env.DATABASE_URL &&
    process.env.BETTER_AUTH_SECRET &&
    process.env.BETTER_AUTH_URL,
  );
export const mailConfigured = () =>
  Boolean(
    process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD &&
    process.env.MAIL_FROM,
  );
