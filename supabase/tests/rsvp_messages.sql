-- Run in the Supabase SQL Editor. All test rows are rolled back.
begin;
set local role anon;
select public.submit_rsvp(' Khách kiểm thử ', 'Attending', ' RSVP-CHECK@example.com ',
  ' Chúc mừng tốt nghiệp! ', ' Bạn bè ');
select public.submit_rsvp('Khách bản cũ', 'Maybe', 'rsvp-legacy@example.com');
reset role;

do $$
begin
  if not exists (select 1 from public.rsvps where email = 'rsvp-check@example.com'
    and guest_name = 'Khách kiểm thử' and message = 'Chúc mừng tốt nghiệp!'
    and relationship = 'Bạn bè') then
    raise exception 'Message or relationship was not saved correctly';
  end if;
  if not exists (select 1 from public.rsvps where email = 'rsvp-legacy@example.com'
    and message = '' and relationship = '') then
    raise exception 'Legacy submission failed';
  end if;
  begin
    perform public.submit_rsvp('Khách', 'Maybe', 'invalid@example.com', ' ', 'Bạn bè');
    raise exception 'Blank message was accepted';
  exception when invalid_parameter_value then null;
  end;
  begin
    perform public.submit_rsvp('Khách', 'Invalid', 'invalid@example.com', 'Lời chúc', 'Bạn bè');
    raise exception 'Invalid attendance was accepted';
  exception when invalid_parameter_value then null;
  end;
end;
$$;

set local role anon;
do $$
begin
  if exists (select 1 from public.rsvps) then
    raise exception 'Private RSVP rows are visible to anonymous users';
  end if;
exception when insufficient_privilege then null;
end;
$$;
select 'RSVP checks passed; test rows rolled back' as result;
rollback;
