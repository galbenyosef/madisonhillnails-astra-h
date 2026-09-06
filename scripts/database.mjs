import { Pool } from "pg";
import { readFile } from "node:fs/promises";
const connectionString = process.env.MIGRATION_DATABASE_URL;
if (!connectionString)
  throw new Error(
    "Set MIGRATION_DATABASE_URL privately before running this command.",
  );
const pool = new Pool({
  connectionString,
  max: 1,
  connectionTimeoutMillis: 8000,
});
const client = await pool.connect();
try {
  await client.query("begin");
  await client.query("select pg_advisory_xact_lock(931271)");
  if (process.argv[2] === "migrate") {
    await client.query(
      "create table if not exists mhn_migrations(version text primary key,applied_at timestamptz not null default now())",
    );
    const exists = await client.query(
      "select 1 from mhn_migrations where version=$1",
      ["001"],
    );
    if (!exists.rowCount) {
      await client.query(
        await readFile(
          new URL("../database/001-schema.sql", import.meta.url),
          "utf8",
        ),
      );
      await client.query("insert into mhn_migrations(version) values($1)", [
        "001",
      ]);
    }
    console.log(
      exists.rowCount
        ? "Schema already applied."
        : "Schema applied. Online booking is closed; no services or customer data seeded.",
    );
  } else if (process.argv[2] === "owner") {
    const email = process.argv[3];
    if (!email)
      throw new Error("Provide the email of an existing verified account.");
    const user = (
      await client.query(
        'select id from "user" where lower(email)=lower($1) and "emailVerified"=true',
        [email],
      )
    ).rows[0];
    if (!user) throw new Error("A verified account was not found.");
    await client.query(
      "insert into staff_roles(user_id,role) values($1,'owner') on conflict(user_id) do update set role='owner'",
      [user.id],
    );
    await client.query(
      'delete from staff_session_verifications where session_id in(select id from session where "userId"=$1)',
      [user.id],
    );
    await client.query(
      "insert into audit_log(actor_id,action,entity_id) values($1,'staff.owner-granted',$1)",
      [user.id],
    );
    console.log(
      "Owner access granted. Authenticator verification is required before dashboard access.",
    );
  } else throw new Error("Use migrate or owner.");
  await client.query("commit");
} catch {
  await client.query("rollback");
  console.error(
    "Database operation failed. Check private configuration and prerequisites; no credentials were printed.",
  );
  process.exitCode = 1;
} finally {
  client.release();
  await pool.end();
}
