begin;

alter table public.rsvps
  add column if not exists message text not null default '',
  add column if not exists relationship text not null default '';

-- Keep the existing three-argument RPC for clients on the previous deployment.
create or replace function public.submit_rsvp(
  p_guest_name text,
  p_attending_status text,
  p_email text,
  p_message text,
  p_relationship text
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if coalesce(char_length(trim(p_guest_name)), 0) not between 1 and 120
    or coalesce(char_length(trim(p_email)), 0) not between 3 and 254
    or coalesce(trim(p_email), '') !~ '^[^[:space:]@]+@[^[:space:]@]+$'
    or coalesce(p_attending_status, '') not in ('Attending', 'Not Attending', 'Maybe')
    or coalesce(char_length(trim(p_message)), 0) not between 1 and 4000
    or coalesce(char_length(trim(p_relationship)), 0) not between 1 and 120
  then
    raise exception 'Thông tin RSVP không hợp lệ.' using errcode = '22023';
  end if;

  insert into public.rsvps (guest_name, attending_status, email, message, relationship)
  values (trim(p_guest_name), p_attending_status, lower(trim(p_email)),
    trim(p_message), trim(p_relationship));
exception when unique_violation then
  raise exception 'Email này đã được dùng để RSVP trước đó.' using errcode = '23505';
end;
$$;

revoke all on function public.submit_rsvp(text, text, text, text, text) from public;
grant execute on function public.submit_rsvp(text, text, text, text, text)
  to anon, authenticated, service_role;

-- Public reads still use get_public_rsvps(): no email, message or relationship.
notify pgrst, 'reload schema';
commit;
