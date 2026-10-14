begin;

-- Preserve historical attendance/email, but never fabricate either for new wishes.
alter table public.rsvps alter column email drop not null;
alter table public.rsvps alter column attending_status drop not null;
alter table public.rsvps add column request_id uuid unique;
alter table public.rsvps add column photo_path text unique;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('wish-photos', 'wish-photos', true, 2097152, array['image/jpeg']);

-- Public guestbook by design: no login. A random request UUID is the retry
-- capability; it is never returned in public reads. Existing rows cannot be edited.
create function private.begin_wish(p_request_id uuid, p_guest_name text,
  p_message text, p_relationship text, p_has_photo boolean)
returns jsonb language plpgsql security definer set search_path = '' as $$
declare wish public.rsvps;
begin
  if p_request_id is null or p_has_photo is null
    or coalesce(char_length(trim(p_guest_name)), 0) not between 1 and 120
    or coalesce(char_length(trim(p_message)), 0) not between 1 and 4000
    or coalesce(char_length(trim(p_relationship)), 0) not between 1 and 120
  then raise exception 'Thông tin lời chúc không hợp lệ.' using errcode = '22023'; end if;

  -- Serialize creation to enforce the cap and make retries idempotent.
  perform pg_advisory_xact_lock(130102026);
  select * into wish from public.rsvps where request_id = p_request_id;
  if found then
    if wish.guest_name <> trim(p_guest_name) or wish.message <> trim(p_message)
      or wish.relationship <> trim(p_relationship)
      or (wish.photo_path is not null) <> p_has_photo
    then raise exception 'Yêu cầu đã được sử dụng.' using errcode = '22023'; end if;
  else
    if (select count(*) from public.rsvps where request_id is not null
      and created_at > now() - interval '1 minute') >= 20
    then raise exception 'Vui lòng thử lại sau một phút.' using errcode = '54000'; end if;
    insert into public.rsvps (guest_name, message, relationship, email,
      attending_status, request_id, photo_path, publish_message)
    values (trim(p_guest_name), trim(p_message), trim(p_relationship), null, null,
      p_request_id, case when p_has_photo then gen_random_uuid()::text || '.jpg' end,
      not p_has_photo) returning * into wish;
  end if;
  return jsonb_build_object('published', wish.publish_message, 'photo_path', wish.photo_path,
    'photo_uploaded', exists (select 1 from storage.objects
      where bucket_id = 'wish-photos' and name = wish.photo_path));
end $$;

create function public.begin_wish(p_request_id uuid, p_guest_name text,
  p_message text, p_relationship text, p_has_photo boolean)
returns jsonb language sql security invoker set search_path = '' as $$
  select private.begin_wish(p_request_id, p_guest_name, p_message, p_relationship, p_has_photo);
$$;

-- A client can insert only at its reserved unguessable path, and never list,
-- replace or delete photos. Public bucket reads are intentional consented sharing.
create function private.can_upload_wish_photo(object_name text)
returns boolean language sql stable security definer set search_path = '' as $$
  select exists (select 1 from public.rsvps where photo_path = object_name
    and not publish_message and request_id is not null);
$$;
create policy "Insert reserved wish photo" on storage.objects for insert to anon, authenticated
with check (bucket_id = 'wish-photos' and private.can_upload_wish_photo(name));

create function private.publish_wish(p_request_id uuid)
returns void language plpgsql security definer set search_path = '' as $$
declare wish public.rsvps;
begin
  select * into wish from public.rsvps where request_id = p_request_id for update;
  if not found then raise exception 'Không tìm thấy lời chúc.' using errcode = '22023'; end if;
  if wish.publish_message then return; end if;
  if not exists (select 1 from storage.objects where bucket_id = 'wish-photos'
    and name = wish.photo_path and metadata->>'mimetype' = 'image/jpeg'
    and (metadata->>'size')::bigint between 1 and 2097152)
  then raise exception 'Ảnh chưa tải lên hoàn tất.' using errcode = '22023'; end if;
  update public.rsvps set publish_message = true where id = wish.id;
end $$;
create function public.publish_wish(p_request_id uuid)
returns void language sql security invoker set search_path = '' as $$
  select private.publish_wish(p_request_id);
$$;

create function private.get_wishes()
returns table(id bigint, guest_name text, message text, created_at timestamptz, photo_path text)
language sql stable security definer set search_path = '' as $$
  select r.id, r.guest_name, r.message, r.created_at, r.photo_path
  from public.rsvps r where r.publish_message order by r.created_at desc, r.id desc;
$$;
create function public.get_wishes()
returns table(id bigint, guest_name text, message text, created_at timestamptz, photo_path text)
language sql security invoker set search_path = '' as $$ select * from private.get_wishes(); $$;

revoke all on function private.begin_wish(uuid,text,text,text,boolean),
  public.begin_wish(uuid,text,text,text,boolean), private.can_upload_wish_photo(text),
  private.publish_wish(uuid), public.publish_wish(uuid), private.get_wishes(), public.get_wishes() from public;
grant execute on function private.begin_wish(uuid,text,text,text,boolean),
  public.begin_wish(uuid,text,text,text,boolean), private.can_upload_wish_photo(text),
  private.publish_wish(uuid), public.publish_wish(uuid), private.get_wishes(), public.get_wishes()
  to anon, authenticated, service_role;

-- Remove the export capability, not historical wishes or the user's Auth account.
drop function public.get_admin_rsvps();
drop function private.get_admin_rsvps();
revoke all on private.rsvp_admins from public, anon, authenticated, service_role;
notify pgrst, 'reload schema';
commit;
