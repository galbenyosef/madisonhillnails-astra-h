import type { DB } from "./db";
export async function requestAllowed(db: DB, key: string, limit: number) {
  const result = await db.query(
    `insert into request_limits(key) values($1)
 on conflict(key) do update set
 count=case when request_limits.window_start < now()-interval '1 minute' then 1 else request_limits.count+1 end,
 window_start=case when request_limits.window_start < now()-interval '1 minute' then now() else request_limits.window_start end
 where request_limits.window_start < now()-interval '1 minute' or request_limits.count < $2 returning count`,
    [key, limit],
  );
  return result.rows.length > 0;
}
