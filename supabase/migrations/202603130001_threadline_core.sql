-- Threadline core schema
create extension if not exists "pgcrypto";

create type public.user_role as enum ('brand', 'manufacturer');
create type public.project_stage as enum ('discovery', 'briefing', 'sampling', 'production', 'logistics');
create type public.escrow_status as enum ('held', 'released', 'disputed');

create table if not exists public.users (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique,
  full_name text,
  role public.user_role not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendors (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  company_name text not null,
  category text not null,
  location text not null,
  moq_min integer not null check (moq_min >= 0),
  moq_max integer not null check (moq_max >= moq_min),
  quality_cost_score integer not null check (quality_cost_score between 1 and 5),
  sensitive_fields jsonb not null default '{}'::jsonb,
  is_sensitive boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, category)
);

create table if not exists public.briefs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  category text not null,
  quantity integer not null check (quantity > 0),
  priority integer not null check (priority between 1 and 5),
  timeline date not null,
  tech_pack_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  brief_id uuid not null references public.briefs(id) on delete cascade,
  vendor_id uuid not null references public.vendors(id) on delete cascade,
  stage public.project_stage not null default 'discovery',
  milestones jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (brief_id, vendor_id)
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  sender_id uuid not null references public.users(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  amount bigint not null check (amount > 0),
  escrow_status public.escrow_status not null default 'held',
  stripe_payment_intent_id text unique,
  dispute_deadline timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger users_set_updated_at before update on public.users
for each row execute procedure public.set_updated_at();

create trigger vendors_set_updated_at before update on public.vendors
for each row execute procedure public.set_updated_at();

create trigger briefs_set_updated_at before update on public.briefs
for each row execute procedure public.set_updated_at();

create trigger projects_set_updated_at before update on public.projects
for each row execute procedure public.set_updated_at();

create trigger transactions_set_updated_at before update on public.transactions
for each row execute procedure public.set_updated_at();

alter table public.users enable row level security;
alter table public.vendors enable row level security;
alter table public.briefs enable row level security;
alter table public.projects enable row level security;
alter table public.messages enable row level security;
alter table public.transactions enable row level security;

-- users policies
create policy "Users can read own profile"
on public.users for select
using (auth.uid() = id);

create policy "Users can update own profile"
on public.users for update
using (auth.uid() = id)
with check (auth.uid() = id);

create policy "Users can insert own profile"
on public.users for insert
with check (auth.uid() = id);

-- vendors policies
create policy "Authenticated users can view vendors"
on public.vendors for select
to authenticated
using (true);

create policy "Manufacturers manage own vendor profile"
on public.vendors for all
to authenticated
using (user_id = auth.uid())
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'manufacturer'
  )
);

-- briefs policies
create policy "Brands can manage own briefs"
on public.briefs for all
to authenticated
using (
  user_id = auth.uid()
  and exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'brand'
  )
)
with check (
  user_id = auth.uid()
  and exists (
    select 1 from public.users u
    where u.id = auth.uid() and u.role = 'brand'
  )
);

-- projects policies
create policy "Brands can read write projects for own briefs"
on public.projects for all
to authenticated
using (
  exists (
    select 1
    from public.briefs b
    join public.users u on u.id = b.user_id
    where b.id = projects.brief_id
      and b.user_id = auth.uid()
      and u.role = 'brand'
  )
)
with check (
  exists (
    select 1
    from public.briefs b
    join public.users u on u.id = b.user_id
    where b.id = projects.brief_id
      and b.user_id = auth.uid()
      and u.role = 'brand'
  )
);

create policy "Manufacturers can read assigned projects"
on public.projects for select
to authenticated
using (
  exists (
    select 1
    from public.vendors v
    join public.users u on u.id = v.user_id
    where v.id = projects.vendor_id
      and v.user_id = auth.uid()
      and u.role = 'manufacturer'
  )
);

-- messages policies
create policy "Project participants can read messages"
on public.messages for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = messages.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
);

create policy "Project participants can send messages"
on public.messages for insert
to authenticated
with check (
  sender_id = auth.uid()
  and exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = messages.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
);

-- transactions policies
create policy "Project participants can read transactions"
on public.transactions for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = transactions.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
);

create policy "Brands can manage transactions for own projects"
on public.transactions for all
to authenticated
using (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    where p.id = transactions.project_id
      and b.user_id = auth.uid()
  )
)
with check (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    where p.id = transactions.project_id
      and b.user_id = auth.uid()
  )
);

-- Optional public-safe vendor projection for anon browsing.
create or replace view public.vendors_public as
select
  id,
  company_name,
  category,
  location,
  moq_min,
  moq_max,
  quality_cost_score,
  created_at,
  updated_at
from public.vendors;

grant select on public.vendors_public to anon, authenticated;
