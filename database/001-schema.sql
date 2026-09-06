-- Run with a trusted PostgreSQL migration connection. Never expose it to the browser.
create extension if not exists btree_gist;

create table "user" (
  id text primary key, name text not null, email text not null unique,
  "emailVerified" boolean not null default false, image text,
  "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now(),
  "twoFactorEnabled" boolean not null default false
);
create table session (
  id text primary key, "expiresAt" timestamptz not null, token text not null unique,
  "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now(),
  "ipAddress" text, "userAgent" text, "userId" text not null references "user"(id) on delete cascade
);
create index on session("userId");
create table account (
  id text primary key, "accountId" text not null, "providerId" text not null,
  "userId" text not null references "user"(id) on delete cascade,
  "accessToken" text, "refreshToken" text, "idToken" text,
  "accessTokenExpiresAt" timestamptz, "refreshTokenExpiresAt" timestamptz, scope text, password text,
  "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now()
);
create index on account("userId");
create table verification (
  id text primary key, identifier text not null, value text not null, "expiresAt" timestamptz not null,
  "createdAt" timestamptz not null default now(), "updatedAt" timestamptz not null default now()
);
create index on verification(identifier);
create table "twoFactor" (
  id text primary key, secret text not null, "backupCodes" text not null,
  "userId" text not null references "user"(id) on delete cascade,
  verified boolean default true, "failedVerificationCount" integer default 0, "lockedUntil" timestamptz
);
create index on "twoFactor"("userId");
create table "rateLimit" (id text primary key, key text unique not null, count integer not null, "lastRequest" bigint not null);

create table staff_roles (user_id text primary key references "user"(id), role text not null check(role in ('owner','manager')));
create table staff_session_verifications (session_id text primary key references session(id) on delete cascade, verified_at timestamptz not null default now());
create table restricted_accounts (user_id text primary key references "user"(id), reason text not null default '', created_at timestamptz not null default now());
create table request_limits (key text primary key, window_start timestamptz not null default now(), count integer not null default 1);
create table services (
 id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 2 and 80),
 category text not null default 'Nail care', description text not null default '',
 duration_minutes integer not null check(duration_minutes between 15 and 240 and duration_minutes % 15 = 0),
 buffer_minutes integer not null default 0 check(buffer_minutes between 0 and 60 and buffer_minutes % 15 = 0),
 price_cents integer check(price_cents >= 0), active boolean not null default true
);
create table technicians (id uuid primary key default gen_random_uuid(), name text not null check(length(name) between 2 and 80), active boolean not null default true);
create table technician_services (technician_id uuid references technicians(id), service_id uuid references services(id), primary key(technician_id,service_id));
create table working_hours (
 technician_id uuid references technicians(id), weekday integer check(weekday between 0 and 6),
 opens time not null, closes time not null, check(closes > opens), primary key(technician_id,weekday)
);
create table booking_settings (
 id boolean primary key default true check(id), online_booking_enabled boolean not null default false,
 lead_hours integer not null default 2 check(lead_hours between 0 and 168),
 horizon_days integer not null default 60 check(horizon_days between 1 and 180),
 max_upcoming integer not null default 3 check(max_upcoming between 1 and 10),
 cancellation_hours integer not null default 24 check(cancellation_hours between 0 and 336),
 policy_text text not null default 'Please contact the salon if you need help changing an appointment.',
 capacity_confirmed boolean not null default false
);
insert into booking_settings(id) values(true);
create table appointments (
 id uuid primary key default gen_random_uuid(), customer_id text references "user"(id),
 customer_name text not null, customer_email text, customer_phone text not null,
 service_id uuid not null references services(id), service_name text not null,
 technician_id uuid not null references technicians(id), technician_name text not null,
 start_at timestamptz not null, end_at timestamptz not null, reserved_until timestamptz not null,
 status text not null default 'confirmed' check(status in ('confirmed','canceled','completed','no_show')),
 source text not null check(source in ('online','admin')), notes text not null default '',
 revision integer not null default 1, price_cents integer, cancellation_reason text,
 cancellation_hours_snapshot integer not null, policy_text_snapshot text not null,
 request_id uuid not null unique, created_at timestamptz not null default now(),
 check(end_at > start_at and reserved_until >= end_at)
);
create index on appointments(customer_id,start_at);
create table reservations (
 id uuid primary key default gen_random_uuid(), technician_id uuid not null references technicians(id),
 appointment_id uuid unique references appointments(id) on delete cascade,
 start_at timestamptz not null, end_at timestamptz not null, reason text not null default '',
 check(end_at > start_at),
 exclude using gist(technician_id with =, tstzrange(start_at,end_at,'[)') with &&)
);
create table audit_log (id bigint generated always as identity primary key, actor_id text not null references "user"(id), action text not null, entity_id text not null, created_at timestamptz not null default now());
create table notification_jobs (
 id uuid primary key default gen_random_uuid(), appointment_id uuid not null references appointments(id),
 revision integer not null, kind text not null check(kind in ('confirmation','change','cancellation','reminder')),
 due_at timestamptz not null default now(), attempts integer not null default 0,
 status text not null default 'pending' check(status in ('pending','sent','obsolete','failed')),
 unique(appointment_id,revision,kind)
);
create table mail_usage (period text primary key, sent integer not null default 0);
create index on notification_jobs(status,due_at);

-- Supabase REST roles must have no access to auth, booking, or customer tables.
-- The application uses server-only PostgreSQL connections; no client Data API is used.
do $$ declare item record; begin
 for item in select tablename from pg_tables where schemaname='public' and tablename in
 ('user','session','account','verification','twoFactor','rateLimit','staff_roles','staff_session_verifications','restricted_accounts','request_limits',
 'services','technicians','technician_services','working_hours','booking_settings','appointments','reservations','audit_log','notification_jobs','mail_usage') loop
  execute format('alter table public.%I enable row level security', item.tablename);
  execute format('revoke all on public.%I from public', item.tablename);
  if exists(select 1 from pg_roles where rolname='anon') then execute format('revoke all on public.%I from anon',item.tablename); end if;
  if exists(select 1 from pg_roles where rolname='authenticated') then execute format('revoke all on public.%I from authenticated',item.tablename); end if;
 end loop;
end $$;
