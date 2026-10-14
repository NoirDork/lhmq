-- Run with a trusted SQL connection; every fixture is rolled back.
begin;
set local role anon;
select public.submit_rsvp('Test public', 'Attending', 'letters-public@tests.invalid',
  'Xin chúc mừng! <img src=x>', 'Bạn bè', true);
select public.submit_rsvp('Test private', 'Not Attending', 'letters-legacy@tests.invalid',
  'Chưa cho phép công khai', 'Gia đình');
select public.submit_rsvp('Test older', 'Maybe', 'letters-older@tests.invalid');
do $$
declare data jsonb;
begin
  select jsonb_agg(to_jsonb(g)) into data from public.get_public_rsvps() g;
  if not exists (select 1 from public.get_public_rsvps()
      where guest_name='Test public' and message='Xin chúc mừng! <img src=x>')
    or exists (select 1 from public.get_public_rsvps() where guest_name in ('Test private','Test older'))
    or data::text like '%attending_status%' or data::text like '%"email"%'
  then raise exception 'Public contract or legacy privacy failed'; end if;
  begin
    perform id from public.rsvps;
    raise exception 'Raw rows accessible';
  exception when insufficient_privilege then null; end;
  begin
    perform public.get_admin_rsvps();
    raise exception 'Removed export still exists';
  exception when undefined_function then null; end;
  begin
    perform public.submit_rsvp('Name','Maybe','invalid@tests.invalid','Wish','Friend',true);
    raise exception 'Maybe accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.submit_rsvp('Name','Attending','invalid@tests.invalid',' ','Friend',true);
    raise exception 'Empty wish accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.submit_rsvp('Name','Attending','invalid@tests.invalid',repeat('x',4001),'Friend',true);
    raise exception 'Oversized wish accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.submit_rsvp('Name','Attending','broken','Wish','Friend',true);
    raise exception 'Invalid email accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.submit_rsvp('Name','Attending','invalid@tests.invalid','Wish','Friend',false);
    raise exception 'Missing consent accepted';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.submit_rsvp('Name','Attending',' LETTERS-PUBLIC@tests.invalid ','Wish','Friend',true);
    raise exception 'Duplicate email accepted';
  exception when unique_violation then null; end;
end $$;
reset role;

select 'Legacy publication, validation and privacy tests passed' as result;
rollback;
