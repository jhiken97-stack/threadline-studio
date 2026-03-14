-- Stage 1 Migration A: roles, vendor profiles, conversations, and project workflow tracking

create type public.app_role as enum ('admin', 'brand', 'vendor');
create type public.project_stage_v2 as enum ('brief', 'matched', 'sample', 'production', 'shipped', 'complete');
create type public.substep_status as enum ('done', 'current', 'upcoming');

create table if not exists public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  role public.app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

create table if not exists public.vendor_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  factory_name text not null,
  region text not null,
  categories text[] not null default '{}',
  moq_min integer not null check (moq_min >= 0),
  lead_time integer not null check (lead_time >= 0),
  quality_tier integer not null check (quality_tier between 1 and 5),
  bio text,
  portfolio_images text[] not null default '{}',
  verified boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null unique references public.projects(id) on delete cascade,
  brand_id uuid not null references public.users(id) on delete cascade,
  vendor_id uuid not null references public.users(id) on delete cascade,
  last_message text,
  last_message_at timestamptz,
  unread_brand boolean not null default false,
  unread_vendor boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (brand_id <> vendor_id)
);

create table if not exists public.project_timeline (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage public.project_stage_v2 not null,
  date date not null,
  note text,
  created_at timestamptz not null default now()
);

create table if not exists public.project_substep_progress (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  stage public.project_stage_v2 not null,
  step_index integer not null check (step_index >= 0),
  status public.substep_status not null,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  unique (project_id, stage, step_index)
);

create index if not exists idx_conversations_project_id on public.conversations(project_id);
create index if not exists idx_conversations_brand_id on public.conversations(brand_id);
create index if not exists idx_conversations_vendor_id on public.conversations(vendor_id);
create index if not exists idx_project_timeline_project_date on public.project_timeline(project_id, date);
create index if not exists idx_project_substep_progress_pss on public.project_substep_progress(project_id, stage, step_index);

create trigger vendor_profiles_set_updated_at before update on public.vendor_profiles
for each row execute procedure public.set_updated_at();

create trigger conversations_set_updated_at before update on public.conversations
for each row execute procedure public.set_updated_at();

alter table public.user_roles enable row level security;
alter table public.vendor_profiles enable row level security;
alter table public.conversations enable row level security;
alter table public.project_timeline enable row level security;
alter table public.project_substep_progress enable row level security;

-- Minimal policies for stage 1A.
create policy "Users read own roles"
on public.user_roles for select
to authenticated
using (user_id = auth.uid());

create policy "Users read own vendor profile"
on public.vendor_profiles for select
to authenticated
using (user_id = auth.uid());

create policy "Users manage own vendor profile"
on public.vendor_profiles for all
to authenticated
using (user_id = auth.uid())
with check (user_id = auth.uid());

create policy "Conversation participants can read"
on public.conversations for select
to authenticated
using (brand_id = auth.uid() or vendor_id = auth.uid());

create policy "Conversation participants can update"
on public.conversations for update
to authenticated
using (brand_id = auth.uid() or vendor_id = auth.uid())
with check (brand_id = auth.uid() or vendor_id = auth.uid());

create policy "Project participants can read timeline"
on public.project_timeline for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = project_timeline.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
);

create policy "Project participants can manage timeline"
on public.project_timeline for all
to authenticated
using (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = project_timeline.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = project_timeline.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
);

create policy "Project participants can read substeps"
on public.project_substep_progress for select
to authenticated
using (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = project_substep_progress.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
);

create policy "Project participants can manage substeps"
on public.project_substep_progress for all
to authenticated
using (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = project_substep_progress.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.projects p
    join public.briefs b on b.id = p.brief_id
    join public.vendors v on v.id = p.vendor_id
    where p.id = project_substep_progress.project_id
      and (b.user_id = auth.uid() or v.user_id = auth.uid())
  )
);
