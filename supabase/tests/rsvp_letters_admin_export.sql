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
    raise exception 'Anon export allowed';
  exception when insufficient_privilege then null; end;
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

insert into auth.users(id,email) values
  ('10000000-0000-4000-8000-000000000001','db-admin@tests.invalid'),
  ('10000000-0000-4000-8000-000000000002','db-nonadmin@tests.invalid');
insert into private.rsvp_admins(user_id) values ('10000000-0000-4000-8000-000000000001');
insert into auth.sessions(id,user_id,not_after) values
  ('20000000-0000-4000-8000-000000000001','10000000-0000-4000-8000-000000000001',now()+interval '1 hour'),
  ('20000000-0000-4000-8000-000000000002','10000000-0000-4000-8000-000000000002',now()+interval '1 hour'),
  ('20000000-0000-4000-8000-000000000003','10000000-0000-4000-8000-000000000001',now()-interval '1 hour');
insert into public.rsvps(guest_name,attending_status,email,message,relationship)
select 'Bulk '||g, 'Attending', 'letters-bulk-'||g||'@tests.invalid', 'Wish', 'Friend'
from generate_series(1,1005) g;
select set_config('test.expected_count', (select count(*)::text from public.rsvps), true);
set local role authenticated;
do $$
declare data jsonb; claims jsonb;
begin
  claims := jsonb_build_object('sub','10000000-0000-4000-8000-000000000002',
    'session_id','20000000-0000-4000-8000-000000000002','exp',extract(epoch from now()+interval '1 hour')::bigint);
  perform set_config('request.jwt.claims',claims::text,true);
  begin perform public.get_admin_rsvps(); raise exception 'Nonadmin allowed';
  exception when insufficient_privilege then null; end;
  claims := claims || jsonb_build_object('sub','10000000-0000-4000-8000-000000000001',
    'session_id','20000000-0000-4000-8000-000000000001');
  perform set_config('request.jwt.claims',claims::text,true);
  data := public.get_admin_rsvps();
  if jsonb_array_length(data) <> current_setting('test.expected_count')::int
    or jsonb_array_length(data) < 1005
    or data::text like '%"email"%' or data::text like '%"message"%'
  then raise exception 'Admin projection/count failed'; end if;
  begin perform user_id from private.rsvp_admins; raise exception 'Allowlist accessible';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claims',(claims||jsonb_build_object('exp',0))::text,true);
  begin perform public.get_admin_rsvps(); raise exception 'Expired token allowed';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claims',(claims||jsonb_build_object('session_id','absent'))::text,true);
  begin perform public.get_admin_rsvps(); raise exception 'Logged-out session allowed';
  exception when insufficient_privilege then null; end;
  perform set_config('request.jwt.claims',(claims||jsonb_build_object('session_id','20000000-0000-4000-8000-000000000003'))::text,true);
  begin perform public.get_admin_rsvps(); raise exception 'Past not_after allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
select 'Publication, validation, legacy, authorization, expiry, and 1005-row tests passed' as result;
rollback;
