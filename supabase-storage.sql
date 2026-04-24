-- Run in Supabase SQL Editor after supabase-schema.sql.
-- Creates Storage buckets + RLS for project file blobs and profile avatars.

-- Buckets
insert into storage.buckets (id, name, public, file_size_limit)
select 'project-files', 'project-files', false, 52428800
where not exists (select 1 from storage.buckets where id = 'project-files');

insert into storage.buckets (id, name, public, file_size_limit)
select 'avatars', 'avatars', true, 5242880
where not exists (select 1 from storage.buckets where id = 'avatars');

-- project-files: first path segment must be the owning auth user id (…/project-id/…)
drop policy if exists "project_files_storage_select" on storage.objects;
drop policy if exists "project_files_storage_insert" on storage.objects;
drop policy if exists "project_files_storage_update" on storage.objects;
drop policy if exists "project_files_storage_delete" on storage.objects;

create policy "project_files_storage_select"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'project-files'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "project_files_storage_insert"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'project-files'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "project_files_storage_update"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'project-files'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "project_files_storage_delete"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'project-files'
    and split_part(name, '/', 1) = auth.uid()::text
  );

-- avatars: public read; users may only write their own folder (first segment = uid)
drop policy if exists "avatars_public_read" on storage.objects;
drop policy if exists "avatars_insert_own" on storage.objects;
drop policy if exists "avatars_update_own" on storage.objects;
drop policy if exists "avatars_delete_own" on storage.objects;

create policy "avatars_public_read"
  on storage.objects for select
  using (bucket_id = 'avatars');

create policy "avatars_insert_own"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'avatars'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "avatars_update_own"
  on storage.objects for update to authenticated
  using (
    bucket_id = 'avatars'
    and split_part(name, '/', 1) = auth.uid()::text
  );

create policy "avatars_delete_own"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'avatars'
    and split_part(name, '/', 1) = auth.uid()::text
  );
