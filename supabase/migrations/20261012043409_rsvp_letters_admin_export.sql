begin;
create schema if not exists private;
alter table public.rsvps add column publish_message boolean not null default false;
create table private.rsvp_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table private.rsvp_admins enable row level security;
revoke all on private.rsvp_admins from public, anon, authenticated;
revoke all on public.rsvps from public, anon, authenticated;

alter function public.submit_rsvp(text,text,text) set schema private;
alter function private.submit_rsvp(text,text,text) set search_path = '';
alter function public.submit_rsvp(text,text,text,text,text) set schema private;

create function public.submit_rsvp(p_guest_name text, p_attending_status text, p_email text)
returns void language sql security invoker set search_path = '' as $$
  select private.submit_rsvp(p_guest_name, p_attending_status, p_email);
$$;
create function public.submit_rsvp(p_guest_name text, p_attending_status text,
  p_email text, p_message text, p_relationship text)
returns void language sql security invoker set search_path = '' as $$
  select private.submit_rsvp(p_guest_name, p_attending_status, p_email, p_message, p_relationship);
$$;

create function private.submit_public_wish(p_guest_name text,
  p_attending_status text, p_email text, p_message text,
  p_relationship text, p_publish_message boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_publish_message is distinct from true
    or coalesce(p_attending_status, '') not in ('Attending', 'Not Attending')
  then raise exception 'Thông tin RSVP không hợp lệ.' using errcode = '22023'; end if;
  perform private.submit_rsvp(p_guest_name, p_attending_status, p_email, p_message, p_relationship);
  update public.rsvps set publish_message = true where email = lower(trim(p_email));
end $$;

create function public.submit_rsvp(p_guest_name text, p_attending_status text,
  p_email text, p_message text, p_relationship text, p_publish_message boolean)
returns void language sql security invoker set search_path = '' as $$
  select private.submit_public_wish(p_guest_name, p_attending_status, p_email,
    p_message, p_relationship, p_publish_message);
$$;

drop function public.get_public_rsvps();
create function private.get_public_wishes()
returns table(id bigint, guest_name text, message text, created_at timestamptz)
language sql security definer set search_path = '' as $$
  select r.id, r.guest_name, r.message, r.created_at from public.rsvps r
  where r.publish_message order by r.created_at desc, r.id desc;
$$;
create function public.get_public_rsvps()
returns table(id bigint, guest_name text, message text, created_at timestamptz)
language sql security invoker set search_path = '' as $$
  select * from private.get_public_wishes();
$$;

create function private.get_admin_rsvps()
returns jsonb language plpgsql security definer set search_path = '' as $$
declare result jsonb;
begin
  if auth.uid() is null
    or not exists (select 1 from private.rsvp_admins a where a.user_id = auth.uid())
    or not exists (select 1 from auth.sessions s
      where s.id::text = auth.jwt()->>'session_id' and s.user_id = auth.uid()
        and (s.not_after is null or s.not_after > now()))
    or coalesce((auth.jwt()->>'exp')::bigint, 0) <= extract(epoch from now())
  then raise exception 'Không có quyền truy cập.' using errcode = '42501'; end if;
  select coalesce(jsonb_agg(to_jsonb(g) order by g.created_at, g.id), '[]'::jsonb)
    into result from (select id, guest_name, relationship, attending_status, created_at
      from public.rsvps) g;
  return result;
end $$;
create function public.get_admin_rsvps()
returns jsonb language sql security invoker set search_path = '' as $$
  select private.get_admin_rsvps();
$$;

revoke all on function private.submit_rsvp(text,text,text),
  private.submit_rsvp(text,text,text,text,text),
  private.submit_public_wish(text,text,text,text,text,boolean),
  private.get_public_wishes(), private.get_admin_rsvps(),
  public.submit_rsvp(text,text,text), public.submit_rsvp(text,text,text,text,text),
  public.submit_rsvp(text,text,text,text,text,boolean),
  public.get_public_rsvps(), public.get_admin_rsvps() from public;
grant usage on schema private to anon, authenticated, service_role;
grant execute on function private.submit_rsvp(text,text,text),
  private.submit_rsvp(text,text,text,text,text),
  private.submit_public_wish(text,text,text,text,text,boolean),
  private.get_public_wishes(), public.submit_rsvp(text,text,text),
  public.submit_rsvp(text,text,text,text,text),
  public.submit_rsvp(text,text,text,text,text,boolean),
  public.get_public_rsvps() to anon, authenticated, service_role;
revoke all on function private.get_admin_rsvps(), public.get_admin_rsvps() from anon;
grant execute on function private.get_admin_rsvps(), public.get_admin_rsvps()
  to authenticated, service_role;
notify pgrst, 'reload schema';
commit;
