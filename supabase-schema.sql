-- Run in Supabase SQL Editor (once). Adjust if tables already exist.

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  local_path text not null,
  live_url text,
  env_secrets text,
  notes text,
  created_at timestamptz default now()
);

alter table public.projects add column if not exists local_path text not null default '';
alter table public.projects add column if not exists live_url text;
alter table public.projects add column if not exists env_secrets text;
alter table public.projects add column if not exists notes text;

-- Set owner on insert from the JWT (avoids client-supplied user_id + fixes many RLS insert failures)
alter table public.projects alter column user_id set default auth.uid();

create table if not exists public.project_files (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  path text not null,
  content text not null default '',
  updated_at timestamptz default now(),
  unique (project_id, path)
);

-- Object key inside Storage bucket "project-files" (see supabase-storage.sql): {user_id}/{project_id}/{path}
alter table public.project_files add column if not exists storage_path text;

create table if not exists public.changes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  file_name text not null,
  change_type text not null,
  timestamp timestamptz default now()
);

create table if not exists public.sync_logs (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects (id) on delete cascade,
  status text not null,
  message text,
  created_at timestamptz default now()
);

alter table public.projects enable row level security;
alter table public.project_files enable row level security;
alter table public.changes enable row level security;
alter table public.sync_logs enable row level security;

-- Explicit grants (tables created only via SQL often lack these; without them inserts fail with permission denied)
grant usage on schema public to authenticated, service_role;
grant select, insert, update, delete on public.projects to authenticated;
grant all on public.projects to service_role;
grant select, insert, update, delete on public.project_files to authenticated;
grant all on public.project_files to service_role;
grant select, insert, update, delete on public.changes to authenticated;
grant all on public.changes to service_role;
grant select, insert, update, delete on public.sync_logs to authenticated;
grant all on public.sync_logs to service_role;

drop policy if exists "projects_select_own" on public.projects;
drop policy if exists "projects_insert_own" on public.projects;
drop policy if exists "projects_update_own" on public.projects;
drop policy if exists "projects_delete_own" on public.projects;

create policy "projects_select_own" on public.projects
  for select using ((select auth.uid()) = user_id);
create policy "projects_insert_own" on public.projects
  for insert with check ((select auth.uid()) = user_id);
create policy "projects_update_own" on public.projects
  for update using ((select auth.uid()) = user_id);
create policy "projects_delete_own" on public.projects
  for delete using ((select auth.uid()) = user_id);

drop policy if exists "project_files_select" on public.project_files;
drop policy if exists "project_files_insert" on public.project_files;
drop policy if exists "project_files_update" on public.project_files;
drop policy if exists "project_files_delete" on public.project_files;

create policy "project_files_select" on public.project_files
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = project_files.project_id and p.user_id = (select auth.uid())
    )
  );
create policy "project_files_insert" on public.project_files
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = project_files.project_id and p.user_id = (select auth.uid())
    )
  );
create policy "project_files_update" on public.project_files
  for update using (
    exists (
      select 1 from public.projects p
      where p.id = project_files.project_id and p.user_id = (select auth.uid())
    )
  );
create policy "project_files_delete" on public.project_files
  for delete using (
    exists (
      select 1 from public.projects p
      where p.id = project_files.project_id and p.user_id = (select auth.uid())
    )
  );

drop policy if exists "changes_select" on public.changes;
drop policy if exists "changes_insert" on public.changes;
create policy "changes_select" on public.changes
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = changes.project_id and p.user_id = (select auth.uid())
    )
  );
create policy "changes_insert" on public.changes
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = changes.project_id and p.user_id = (select auth.uid())
    )
  );

drop policy if exists "sync_logs_select" on public.sync_logs;
drop policy if exists "sync_logs_insert" on public.sync_logs;
create policy "sync_logs_select" on public.sync_logs
  for select using (
    exists (
      select 1 from public.projects p
      where p.id = sync_logs.project_id and p.user_id = (select auth.uid())
    )
  );
create policy "sync_logs_insert" on public.sync_logs
  for insert with check (
    exists (
      select 1 from public.projects p
      where p.id = sync_logs.project_id and p.user_id = (select auth.uid())
    )
  );
