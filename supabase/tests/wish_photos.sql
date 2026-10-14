-- Run against an isolated database after the wish_photos migration.
begin;
set local role anon;
select public.begin_wish('11111111-1111-4111-8111-111111111111', 'Khách kiểm thử', 'Một lời chúc', 'Bạn', false);
select public.begin_wish('11111111-1111-4111-8111-111111111111', 'Khách kiểm thử', 'Một lời chúc', 'Bạn', false);
do $$ begin
  if (select count(*) from public.get_wishes() where guest_name = 'Khách kiểm thử') <> 1 then
    raise exception 'Retry duplicated or lost the text wish'; end if;
  begin
    perform public.begin_wish('11111111-1111-4111-8111-111111111111', 'Khách khác', 'Changed', 'Bạn', false);
    raise exception 'Request ID allowed editing an existing wish';
  exception when invalid_parameter_value then null; end;
  begin
    perform public.begin_wish('22222222-2222-4222-8222-222222222222', ' ', 'X', 'Bạn', false);
    raise exception 'Whitespace-only name accepted';
  exception when invalid_parameter_value then null; end;
end $$;
select public.begin_wish('33333333-3333-4333-8333-333333333333', 'Khách có ảnh', 'Ảnh công khai', 'Bạn', true);
do $$ begin
  if exists (select 1 from public.get_wishes() where guest_name = 'Khách có ảnh') then
    raise exception 'Unfinished photo wish exposed'; end if;
  begin
    perform public.publish_wish('33333333-3333-4333-8333-333333333333');
    raise exception 'Published without a completed photo';
  exception when invalid_parameter_value then null; end;
  begin
    perform 1 from public.rsvps;
    raise exception 'Raw guest data exposed';
  exception when insufficient_privilege then null; end;
  begin
    insert into storage.objects(bucket_id,name,metadata) values ('wish-photos','unreserved.jpg','{}');
    raise exception 'Unreserved upload allowed';
  exception when insufficient_privilege then null; end;
end $$;
reset role;
-- Storage service validates the actual bytes, size and MIME; simulate its metadata here.
create temporary table photo_fixture as select photo_path from public.rsvps
  where request_id = '33333333-3333-4333-8333-333333333333';
grant select on photo_fixture to anon;
set local role anon;
insert into storage.objects(bucket_id,name,metadata)
select 'wish-photos',photo_path,'{"mimetype":"image/jpeg","size":1024}'::jsonb from photo_fixture;
select public.publish_wish('33333333-3333-4333-8333-333333333333');
select public.publish_wish('33333333-3333-4333-8333-333333333333');
do $$ begin
  if not exists (select 1 from public.get_wishes() where guest_name='Khách có ảnh' and photo_path is not null) then
    raise exception 'Completed photo missing from public letter'; end if;
  update storage.objects set metadata='{}' where bucket_id='wish-photos';
  delete from storage.objects where bucket_id='wish-photos';
  if exists (select 1 from storage.objects) then raise exception 'Storage listing exposed'; end if;
end $$;
reset role;
do $$ begin
  if not exists (select 1 from storage.objects where metadata->>'size'='1024') then
    raise exception 'Anonymous client could change or delete photo'; end if;
  if exists (select 1 from public.rsvps where request_id is not null and (email is not null or attending_status is not null)) then
    raise exception 'Fake email or attendance was stored'; end if;
  if to_regprocedure('public.get_admin_rsvps()') is not null or to_regprocedure('private.get_admin_rsvps()') is not null then
    raise exception 'Admin export still callable'; end if;
  if (select count(*) from public.get_wishes() where guest_name='Lời chúc cũ') <> 1 then
    raise exception 'Historical wish was lost'; end if;
end $$;
rollback;
