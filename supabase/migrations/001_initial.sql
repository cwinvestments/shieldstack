-- ShieldStack Initial Schema
-- Tables: users, scans, scan_checks
-- RLS: row-level security for multi-tenant access

-- Enable UUID generation
create extension if not exists "uuid-ossp";

-- ============================================================
-- USERS
-- ============================================================
create table public.users (
  id uuid primary key default uuid_generate_v4(),
  email text unique not null,
  name text,
  plan text not null default 'free' check (plan in ('free', 'pro', 'agency')),
  stripe_customer_id text,
  scans_used integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users enable row level security;

-- Users can read/update their own row
create policy "Users can view own profile"
  on public.users for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.users for update
  using (auth.uid() = id);

-- ============================================================
-- SCANS
-- ============================================================
create table public.scans (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references public.users(id) on delete set null,
  scan_type text not null default 'security' check (scan_type in ('security', 'code', 'full')),
  target_url text not null,
  github_repo text,
  status text not null default 'pending' check (status in ('pending', 'running', 'completed', 'failed')),
  score integer default 0 check (score >= 0 and score <= 100),
  grade text check (grade in ('A', 'B', 'C', 'D', 'F')),
  summary jsonb default '{}',
  results jsonb default '{}',
  is_paid boolean not null default false,
  stripe_payment_id text,
  started_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.scans enable row level security;

-- Authenticated users see their own scans
create policy "Users can view own scans"
  on public.scans for select
  using (auth.uid() = user_id);

-- Anonymous scans are accessible by scan ID (no user_id filter)
-- This is handled by the service role key in API routes;
-- the anon key gets this policy for NULL user_id scans:
create policy "Anyone can view anonymous scans"
  on public.scans for select
  using (user_id is null);

-- Service role inserts scans (API route uses service key)
create policy "Service can insert scans"
  on public.scans for insert
  with check (true);

-- Service role updates scans
create policy "Service can update scans"
  on public.scans for update
  using (true);

-- ============================================================
-- SCAN_CHECKS
-- ============================================================
create table public.scan_checks (
  id uuid primary key default uuid_generate_v4(),
  scan_id uuid not null references public.scans(id) on delete cascade,
  category text not null default 'security' check (category in ('security', 'performance', 'architecture')),
  check_name text not null,
  severity text not null check (severity in ('critical', 'high', 'medium', 'low', 'info', 'pass')),
  title text not null,
  description text,
  recommendation text,
  code_snippet text,
  file_path text,
  created_at timestamptz not null default now()
);

alter table public.scan_checks enable row level security;

-- scan_checks inherit access from parent scan
create policy "Users can view own scan checks"
  on public.scan_checks for select
  using (
    exists (
      select 1 from public.scans
      where scans.id = scan_checks.scan_id
        and (scans.user_id = auth.uid() or scans.user_id is null)
    )
  );

-- Service role inserts checks
create policy "Service can insert scan checks"
  on public.scan_checks for insert
  with check (true);

-- ============================================================
-- INDEXES
-- ============================================================
create index idx_scans_user_id on public.scans(user_id);
create index idx_scans_status on public.scans(status);
create index idx_scans_created_at on public.scans(created_at desc);
create index idx_scan_checks_scan_id on public.scan_checks(scan_id);

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_users_updated
  before update on public.users
  for each row
  execute function public.handle_updated_at();
