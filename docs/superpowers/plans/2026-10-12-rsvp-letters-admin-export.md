# RSVP Letters and Protected Attendance Export Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Complete the six approved RSVP changes, securely export attendance from `/admin`, test the complete flow, clean only identified old/test wishes, then ship to Vercel with a rollback reference.

**Architecture:** Keep the React form, native dialogs, Supabase client and existing RSVP table. Public RPCs return only consented name/message/date/ID; private database helpers authorize admin exports using an Auth UUID allowlist and a live session. Supabase Auth handles passwords; ExcelJS is dynamically loaded only when exporting a real workbook.

**Tech Stack:** React 19, TypeScript, Vite 7, TanStack Router, Supabase JS 2, PostgreSQL RLS, native dialog, existing GSAP/canvas-confetti, Vitest/Testing Library, ExcelJS 4.4.0 (dependency audit gate before installing).

**Spec:** `docs/superpowers/specs/2026-10-12-rsvp-letters-admin-export-design.md`

## Global Constraints

- Execute only after the human reviews this plan and chooses Native or Subagent-driven execution.
- Keep approved local photo/navbar/section order/signature/hero-height changes; no unrelated redesign or refactor.
- Target Supabase project `jvbdzzidmnzxqhfyyvqv` and existing Vercel project `lhmq` / production `https://lhmq.vercel.app`.
- Username `admin` maps to `admin@lhmq.invalid`. Use the human-provided password only in trusted account creation/login; never place it in source, docs, shell history, logs, screenshots or a VITE variable.
- Session remains memory-only: `persistSession: false`, `autoRefreshToken: false`, `detectSessionInUrl: false`; reload requires login.
- No guest registration, admin edit/delete UI, email notifications, email password reset, new analytics or custom backend.
- Attendance remains selectable as `Attending` / `Not Attending` during submission; neither status nor email is returned publicly.
- Success heading is exactly `Gửi lời chúc thành công`.
- Success body is exactly `Cảm ơn Thầy Cô anh chị em bạn dì cô chú đã cùng đồng hành, hỗ trợ và chở che con/em trong suốt hành trình thanh xuân vừa qua để hôm nay có một phiên bản trưởng thành, vững vàng và rực rỡ nhất <3.`
- Confetti uses the existing dependency for both attendance choices, respects reduced-motion, and cleans up on close.
- Guest messages are React text, never HTML. Preserve newlines, wrap unbroken strings, native Escape/focus behavior and mobile scrolling.
- Public wish publication defaults false for old/legacy records; the new form displays a publication notice and sends an explicit true flag.
- Privileged helpers belong to a non-exposed schema, have fixed `search_path`, qualified identifiers and explicit EXECUTE grants; public facades are SECURITY INVOKER.
- Excel has one sheet `Danh sách tham dự`, columns `Họ tên`, `Mối quan hệ`, `Tham dự`, `Ngày gửi`; no email/message. Unknown attendance must not become “Không tham dự”.
- Delete only baseline IDs `4`, `6` and explicitly recorded test IDs after verification and a private backup. Never TRUNCATE or delete concurrent real submissions.
- Use `apply_patch` for edits, selective Git staging, and `.cmd` executables in PowerShell. Do not stash/reset user edits or run repository-wide formatting.
- Supabase migration file must be created with `supabase migration new rsvp_letters_admin_export`; inspect CLI help first. Use the connector's `apply_migration` for remote DDL, not `execute_sql`.

## Review Focus

1. Logout/expiry while a workbook is being built must cancel the pending download and prevent another export (Task 4/5 tests).
2. More than 1,000 attendees must not produce a silently truncated workbook (Task 1 scalar RPC and Task 5 readback test).
3. A stale frontend using the old RPC must still save privately, without publishing a message it never consented to publish (Task 1 compatibility test).
4. A 4,000-character message or HTML-like text must open safely on a small screen without breaking focus or layout (Task 3 unit/browser tests).
5. A real wish arriving during cleanup must survive; a backup must retain all columns for each deleted record (Task 6 exact-ID backup/delete checks).

## File map and shared contracts

All paths below are relative to `D:/Linh tinh/test/lhmq`.

| File | Responsibility |
| --- | --- |
| `supabase/migrations/<CLI-generated timestamp>_rsvp_letters_admin_export.sql` | Publication flag, private helpers, public facades and admin allowlist. The timestamp comes from the CLI, not a fabricated filename. |
| `supabase/tests/rsvp_letters_admin_export.sql` | Transactional compatibility/public-data/authorization/live-session tests, all rolled back. |
| `src/lib/rsvps.ts` and `src/lib/__tests__/rsvps.test.ts` | New public DTO and explicit publication flag in submission. |
| `src/components/portfolio/ContactForm.tsx`, `RsvpConfirmation.tsx`, `__tests__/RsvpFlow.test.tsx` | Save-only form and unified success/confetti; retain failure recovery. |
| `src/components/portfolio/GuestList.tsx`, new `GuestLetter.tsx`, new `__tests__/GuestLetter.test.tsx` | Envelope buttons and accessible message dialog. |
| `src/routes/index.tsx` | Replace public description mentioning attendance; preserve approved section order. |
| new `src/lib/admin-rsvps.ts`, `src/lib/__tests__/admin-rsvps.test.ts` | Auth username alias, authorized export data and logout. |
| new `src/routes/admin.tsx`, new `src/components/admin/AdminPanel.tsx`, `src/components/admin/__tests__/AdminPanel.test.tsx` | Noindex route and minimal login/export/logout UI. |
| `src/routeTree.gen.ts` | Router-plugin-generated `/admin` registration; never hand-edit generated output. |
| new `src/lib/attendance-export.ts`, `src/lib/__tests__/attendance-export.test.ts` | Workbook generation and real workbook readback tests. |
| `package.json`, `package-lock.json` | Remove EmailJS and add one audited Excel dependency. |
| `src/routes/memory.$slug.tsx` | Minimal optional-images type fix with zero-image fallback. |
| `.gitignore`, new `docs/releases/2026-10-12-rsvp-letters-admin-export.md` | Ignore private backup folder and record release/rollback evidence without personal data. |
| existing dirty `Hero.tsx`, `Invitation.tsx`, `Navbar.tsx`, `images/bìa.jpg`, `__tests__/Invitation.test.tsx` | Preserve and verify the previously approved local UI in the release. |

```ts
// src/lib/rsvps.ts: public, never attendance/email.
export interface PublicGuest {
  id: number;
  guest_name: string;
  message: string;
  created_at: string;
}
// Keep existing RsvpSubmission fields; submitRsvp remains Promise<void>.
// src/lib/admin-rsvps.ts: admin-only projection.
export interface AdminGuest {
  id: number;
  guest_name: string;
  relationship: string;
  attending_status: string;
  created_at: string;
}
// signInAdmin(username: string, password: string): Promise<Session>
// fetchAdminGuests(): Promise<AdminGuest[]>
// signOutAdmin(): Promise<void>
// buildAttendanceWorkbook(rows: AdminGuest[]): Promise<ArrayBuffer>
// GuestLetter({guest, onClose}: {guest: PublicGuest; onClose: () => void})
// RsvpConfirmation({onClose}: {onClose: () => void})
```

### Task 1: Protect the public/private database contracts

**Files:** Create the CLI-named migration and `supabase/tests/rsvp_letters_admin_export.sql`; modify `src/lib/rsvps.ts`; create `src/lib/__tests__/rsvps.test.ts`; add `.local-backups/` to `.gitignore`.

**Interfaces:** Consumes the existing validated 3/5-argument `public.submit_rsvp` RPCs and `public.rsvps`. Produces a six-argument `public.submit_rsvp(..., p_publish_message boolean) returns void` without defaults, `public.get_public_rsvps() returns table(id bigint, guest_name text, message text, created_at timestamptz)`, and `public.get_admin_rsvps() returns jsonb`. Admin JSON is an array of the exact `AdminGuest` projection, never a PostgREST set-returning result subject to its 1,000-row cap.

- [ ] Record `git status --short`, `git diff --stat`, `git rev-parse HEAD`, remote/branch and production revision. Preserve the dirty UI. Record the deployed source `7fcab85296488a4e5a736761e30e26610cddf40e` and deployment `dpl_3j4cssaVbbihTRNG4RUMKJoi6Jnv` in the release doc. Create a recoverable source tag without pushing yet: `git tag rollback/pre-rsvp-letters-20261012 7fcab85296488a4e5a736761e30e26610cddf40e` (inspect an existing tag first; never overwrite it).
- [ ] Re-read Supabase skill/docs and inspect schema/function definitions/grants and exposed schemas. Confirm `private` is not exposed and `auth.sessions` has `id`, `user_id`, `not_after`. Inventory migration history before applying any new migration; do not reapply historical migrations blindly.
- [ ] Create a transactional SQL test with two fresh fixtures through the new and legacy RPCs, and a failing public-data assertion. Example assertion body:

```sql
begin;
set local role anon;
select public.submit_rsvp('Test public', 'Attending',
  'letters-public@tests.invalid', 'Xin chúc mừng! <img src=x>', 'Bạn bè', true);
select public.submit_rsvp('Test private', 'Not Attending',
  'letters-legacy@tests.invalid', 'Chưa cho phép công khai', 'Gia đình');
reset role;
do $$
declare visible_rows jsonb;
begin
  select coalesce(jsonb_agg(to_jsonb(g)), '[]'::jsonb)
    into visible_rows from public.get_public_rsvps() g;
  if not exists (select 1 from public.get_public_rsvps()
      where guest_name = 'Test public' and message = 'Xin chúc mừng! <img src=x>')
    or exists (select 1 from public.get_public_rsvps() where guest_name = 'Test private')
    or visible_rows::text like '%attending_status%'
    or visible_rows::text like '%"email"%'
  then raise exception 'Public contract/legacy privacy failed'; end if;
end $$;
rollback;
```

- [ ] Run the SQL test before migration and confirm it fails on the missing six-argument RPC. Never persist transactional test rows. Write a unit test mocking Supabase RPC to assert `submitRsvp` passes `p_publish_message: true`, keeps all five current fields and propagates errors. Run `npm.cmd test -- src/lib/__tests__/rsvps.test.ts` and confirm the flag assertion fails before changing the client.
- [ ] Run `supabase --help` (or existing official CLI via `npx.cmd supabase --help`), then the CLI migration-new command. Patch the generated file: add `publish_message boolean not null default false`, create `private.rsvp_admins(user_id uuid primary key references auth.users(id) on delete cascade)` with RLS and no public table grants, and move the existing validated 3/5-argument functions to `private` using `ALTER FUNCTION ... SET SCHEMA private`. Preserve their bodies, errors and legacy behavior. Recreate public 3/5-argument SQL SECURITY INVOKER facades with identical parameter names calling their private equivalents. Do not add default parameters to any overload.
- [ ] Add the new publication helper and six-argument facade. Reuse the original validation/unique-email behavior instead of duplicating it:

```sql
create function private.submit_public_wish(p_guest_name text,
  p_attending_status text, p_email text, p_message text,
  p_relationship text, p_publish_message boolean)
returns void language plpgsql security definer set search_path = '' as $$
begin
  if p_publish_message is distinct from true
    or coalesce(p_attending_status, '') not in ('Attending', 'Not Attending')
  then raise exception 'Thông tin RSVP không hợp lệ.' using errcode = '22023'; end if;
  perform private.submit_rsvp(p_guest_name, p_attending_status,
    p_email, p_message, p_relationship);
  update public.rsvps set publish_message = true where email = lower(trim(p_email));
end $$;

create function public.submit_rsvp(p_guest_name text,
  p_attending_status text, p_email text, p_message text,
  p_relationship text, p_publish_message boolean)
returns void language sql security invoker set search_path = '' as $$
  select private.submit_public_wish(p_guest_name, p_attending_status,
    p_email, p_message, p_relationship, p_publish_message);
$$;
```

- [ ] Drop/recreate `get_public_rsvps` with the new return signature and a private reader. Ensure default false hides all existing wishes. The reader projects only `id, guest_name, message, created_at`, filters `publish_message`, orders deterministically `created_at desc, id desc`, and uses SECURITY DEFINER/fixed empty search path. Its public facade is SECURITY INVOKER. Revoke PUBLIC execute on both and grant only anon/authenticated/service_role as appropriate.
- [ ] Implement the admin reader with explicit session/UUID checks before reading anything:

```sql
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
```

- [ ] Explicitly revoke PUBLIC function defaults, grant `USAGE ON SCHEMA private` only for the invoker roles requiring it, grant the public-wish helpers to anon/authenticated/service_role and admin helper/facade only to authenticated/service_role. Keep `private` excluded from exposed schemas; table/allowlist access stays denied to anon/authenticated. Confirm the existing table policies cannot permit raw SELECT; revoke raw rsvps table access from anon/authenticated if needed. End migration with `notify pgrst, 'reload schema'`.
- [ ] Apply only this migration with `apply_migration` to the approved project after checking the exact SQL. Patch `PublicGuest` and add `p_publish_message: true` to `submitRsvp`. Retain existing error handling and `fetchGuests(): Promise<PublicGuest[]>`.
- [ ] Extend the rolled-back SQL test: invalid new status `Maybe`, empty/oversized message, malformed email, false publication flag all fail `22023`; duplicate case-normalized email fails `23505`; old 3/5-argument writes still succeed privately. Test anon direct table SELECT and admin RPC both fail `42501`.
- [ ] Inside the test transaction only, insert two auth-user UUID fixtures (one allowlisted, one not), sessions and JWT claims via `set_config('request.jwt.claims', jsonb_build_object('sub', ..., 'session_id', ..., 'exp', ... )::text, true)`, then `SET LOCAL ROLE authenticated`. The nonadmin, expired-exp claim, absent session ID and past `not_after` each fail `42501`; the live allowlisted admin returns the minimal projection. Restore role/claims between cases; the enclosing ROLLBACK removes these fixtures. For each denied call use a DO block that catches only `insufficient_privilege` and raises if the call succeeds.
- [ ] Add 1,005 generated RSVP fixtures inside that same transaction with unique test emails; assert `jsonb_array_length(public.get_admin_rsvps())` equals the actual table count while authorized. Confirm zero-email/message fields in admin JSON. Run all SQL assertions and client tests green. Existing `supabase/tests/rsvp_messages.sql` should still pass.
- [ ] Stage only Task 1 files and commit `feat: separate public wishes from private attendance data`. Do not push or delete baseline records yet.

### Task 2: Remove email sending and unify success/confetti

**Files:** Modify `ContactForm.tsx`, `RsvpConfirmation.tsx`, `__tests__/RsvpFlow.test.tsx`, `package.json`, `package-lock.json`.

**Interfaces:** Consumes `submitRsvp(existing RsvpSubmission): Promise<void>` from Task 1. Produces `RsvpConfirmation({onClose}: {onClose: () => void})`, still emits `guest-submitted` only after a successful save; no attendance prop and no email side effect.

- [ ] Update the existing mocked flow test: remove EmailJS mock/env setup; use fixtures with `id, guest_name, message, created_at`. Replace branching assertions with this parameterized test, using the existing `fillForm`, `createConfetti`, `burst` and dialog polyfill:

```tsx
it.each(['Attending', 'Not Attending'])('same confirmation for %s', async attendance => {
  submitRsvp.mockResolvedValueOnce(undefined);
  render(<ContactForm />);
  fireEvent.submit(fillForm(attendance));
  const dialog = await screen.findByRole('dialog', {name: 'Gửi lời chúc thành công'});
  expect(dialog.querySelector('#rsvp-confirmation-description')?.textContent).toBe(
    'Cảm ơn Thầy Cô anh chị em bạn dì cô chú đã cùng đồng hành, hỗ trợ và chở che con/em trong suốt hành trình thanh xuân vừa qua để hôm nay có một phiên bản trưởng thành, vững vàng và rực rỡ nhất <3.'
  );
  expect(burst).toHaveBeenCalled();
  expect(dialog.querySelector('[data-rain-icon]')).toBeNull();
  fireEvent.click(screen.getByRole('button', {name: 'Đóng'}));
  expect(burst.reset).toHaveBeenCalled();
});
```

- [ ] Run `npm.cmd test -- src/components/portfolio/__tests__/RsvpFlow.test.tsx`; confirm the new exact-title test fails before implementation.
- [ ] Remove EmailJS import, all three env constants and `emailjs.send` block. Remove reducer `attending` field/payload dependency and pass only `onClose` to confirmation. Add `Tên và lời chúc sẽ hiển thị công khai. Email và lựa chọn tham dự được giữ riêng tư.` immediately before submit.
- [ ] Use a `submittingRef` synchronous guard to stop two submit events before a React render, releasing it in `finally` after the save. Keep native reportValidity and trimming validation, duplicate-email mapping and existing network error copy. Save failure must leave every input untouched; reset/event/success dispatch stay after the successful await.

```ts
if (submittingRef.current || !form.reportValidity()) return;
// Existing required/trim checks run before acquiring the guard.
submittingRef.current = true;
dispatch({type: 'SUBMIT_START'});
try {
  await submitRsvp({guestName, attendingStatus, email, message, relationship});
} catch (cause) {
  dispatch({type: 'SUBMIT_ERROR', payload:
    cause && typeof cause === 'object' && 'code' in cause && cause.code === '23505'
      ? 'Email này đã được dùng để RSVP trước đó.'
      : 'Không thể lưu lời chúc. Vui lòng thử lại.'});
  return;
} finally {
  submittingRef.current = false;
}
dispatch({type: 'SUBMIT_SUCCESS'});
form.reset();
window.dispatchEvent(new CustomEvent('guest-submitted'));
```

- [ ] Keep the current confirmation native dialog, body overflow lock, animation cleanup and mobile-height panel. Remove Heart/Droplet/rain markup and attendance branches. Always use GraduationCap and the exact copy; canvas renders when not reduced-motion; the existing confetti burst settings apply unconditionally when canvas exists. Capture the previously focused HTMLElement before showModal and restore it after close on cleanup. Preserve Cancel/Escape handler and autofocus close button.
- [ ] Add a test issuing two `fireEvent.submit(form)` calls while the save promise is pending; expect one RPC, disabled button, no dialog, no reset/event. Resolve then expect one refresh, exact popup and reset. Keep duplicate-email/network/input-invalid tests, and reduced-motion tests for both options (no canvas/burst); assert body overflow cleanup and Escape close.
- [ ] Search literal EmailJS references with `rg -n -i 'emailjs' src package.json`; remove orphaned code/tests only. Run `npm.cmd uninstall @emailjs/browser --ignore-scripts`; lockfile removal is mechanical. Do not change unrelated dependency versions or delete Vercel settings outside scope.
- [ ] Run the updated flow tests green; run a real browser submission later in Task 6 to check no EmailJS network calls. Selectively commit `feat: unify wish confirmation and remove notification email`.

### Task 3: Display wishes as accessible envelopes

**Files:** Modify `GuestList.tsx`, `src/routes/index.tsx`; create `GuestLetter.tsx`, `__tests__/GuestLetter.test.tsx`; adjust new-shape GuestList fixtures in `RsvpFlow.test.tsx`.

**Interfaces:** Consumes `fetchGuests(): Promise<PublicGuest[]>`. Produces `GuestLetter({guest, onClose}: {guest: PublicGuest; onClose: () => void})`; stable envelope key is `guest.id`.

- [ ] Write a failing test for an envelope button and escaped multiline message using the existing native-dialog test polyfill:

```tsx
const guest = {id: 101, guest_name: 'Cô Hà',
  message: '<img src=x onerror=alert(1)>\nChúc con luôn vững vàng!',
  created_at: '2026-10-12T00:00:00Z'};
fetchGuests.mockResolvedValueOnce([guest]);
render(<GuestList />);
const envelope = await screen.findByRole('button', {name: 'Mở thư của Cô Hà'});
envelope.focus();
fireEvent.click(envelope);
const dialog = await screen.findByRole('dialog', {name: 'Lời chúc từ Cô Hà'});
expect(dialog.querySelector('img, script')).toBeNull();
expect(dialog.querySelector('[data-letter-message]')?.textContent).toBe(guest.message);
fireEvent(dialog, new Event('cancel', {cancelable: true}));
expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
expect(envelope).toHaveFocus();
```

- [ ] Run `npm.cmd test -- src/components/portfolio/__tests__/GuestLetter.test.tsx`; confirm the envelope-name assertion fails.
- [ ] Remove `statusColor` and all status rendering. Keep skeleton/error/retry/empty loading states and event subscription. Add `selectedGuest: PublicGuest | null` state. The card itself is a button, not a clickable div, with no attendance classes/data:

```tsx
<button key={guest.id} type="button" aria-label={`Mở thư của ${guest.guest_name}`}
  onClick={() => setSelectedGuest(guest)}
  className="group relative min-h-44 w-full overflow-hidden rounded-2xl border border-border bg-card px-6 pb-5 pt-16 text-left transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-signature">
  <span aria-hidden="true" className="absolute inset-x-0 top-0 h-16 bg-accent [clip-path:polygon(0_0,100%_0,50%_100%)]" />
  <p className="text-xs text-muted-foreground">Gửi Minh Quân</p>
  <p className="mt-2 break-words font-medium">Từ <span>{guest.guest_name}</span></p>
  <span className="mt-4 inline-block text-sm text-signature">Mở thư ↗</span>
</button>
// After the grid, selectedGuest && <GuestLetter guest={selectedGuest}
//   onClose={() => setSelectedGuest(null)} />
```

- [ ] Implement `GuestLetter` with a dialog ref/useEffect, showModal, autofocus close, onCancel preventDefault/onClose, body overflow save/restore and focus return in cleanup. Use a unique fixed title ID for the one selected dialog. The essential content is:

```tsx
<h2 id="guest-letter-title" className="font-serif text-2xl leading-snug">
  Lời chúc từ {guest.guest_name}
</h2>
<p data-letter-message className="mt-6 whitespace-pre-wrap [overflow-wrap:anywhere] text-base leading-relaxed">
  {guest.message}
</p>
```

The panel uses `max-h-[calc(100dvh-2rem)] overflow-y-auto`; dialog width `w-[calc(100%-2rem)] max-w-lg`. Reuse current border/card/blue tokens. A short opacity/transform opening transition is motion-safe only; no 3D envelope library or invented gallery.
- [ ] Add tests for empty/error/retry preserved, duplicate names with distinct IDs, 4,000-character message text retained, opening/closing button and Escape, no public attendance/email text. Native keyboard Enter/Space and mobile overflow are verified in Task 6, not claimed from JSDOM.
- [ ] Replace index description with `Những lời chúc và kỷ niệm được gửi đến Minh Quân.` Keep approved Invitation-before-Hero order. Run envelope and flow tests green. Selectively commit `feat: open guest wishes from envelope cards`.

### Task 4: Add authenticated admin data access

**Files:** Create `src/lib/admin-rsvps.ts` and `src/lib/__tests__/admin-rsvps.test.ts`. Account creation/allowlist registration are trusted operational steps, not committed credentials.

**Interfaces:** Consumes `public.get_admin_rsvps() returns jsonb` and the current memory-only Supabase client. Produces `AdminGuest` from the file map, `signInAdmin(username, password): Promise<Session>`, `fetchAdminGuests(): Promise<AdminGuest[]>`, `signOutAdmin(): Promise<void>`; Task 5 builds the page once its workbook module exists.

- [ ] Write failing service tests with a mocked Supabase client: username other than trimmed `admin` rejects without signInWithPassword; `admin` uses the internal alias; invalid password propagates error without logging it; missing session rejects; successful login probes admin RPC before returning session; nonadmin RPC denial signs out and throws; fetch uses only the admin RPC and propagates error; logout errors propagate.

```ts
await signInAdmin('admin', 'unit-test-only-password');
expect(signInWithPassword).toHaveBeenCalledWith({
  email: 'admin@lhmq.invalid', password: 'unit-test-only-password'
});
expect(rpc).toHaveBeenCalledWith('get_admin_rsvps');
// Fixtures use fake passwords only; never the actual supplied credential.
```

- [ ] Run `npm.cmd test -- src/lib/__tests__/admin-rsvps.test.ts` red. Implement the service using Supabase Auth, not a client comparison:

```ts
export async function fetchAdminGuests(): Promise<AdminGuest[]> {
  const {data, error} = await supabase.rpc('get_admin_rsvps');
  if (error) throw error;
  return data ?? [];
}
export async function signInAdmin(username: string, password: string): Promise<Session> {
  if (username.trim() !== 'admin') throw new Error('Đăng nhập không thành công.');
  const {data, error} = await supabase.auth.signInWithPassword({email: 'admin@lhmq.invalid', password});
  if (error || !data.session) throw error ?? new Error('Đăng nhập không thành công.');
  try { await fetchAdminGuests(); }
  catch (cause) { await supabase.auth.signOut(); throw cause; }
  return data.session;
}
export async function signOutAdmin(): Promise<void> {
  const {error} = await supabase.auth.signOut();
  if (error) throw error;
}
```

- [ ] Create the real account through an already-authorized trusted Admin API credential, if available, otherwise the authenticated Supabase Dashboard “Add user” form. Auto-confirm account, send no invite/email. If Dashboard requires user login, stop for that narrow login step; do not bypass Auth by writing `auth.users` in production, extract unrelated tool tokens, deploy a temporary privileged function, or store a service-role credential in the frontend. Capture only returned UUID, never password/token in tool output.
- [ ] Add that verified UUID to `private.rsvp_admins` using an exact-match `INSERT ... SELECT id FROM auth.users WHERE email = 'admin@lhmq.invalid'` with a count check. Use `ON CONFLICT (user_id) DO NOTHING` for retry safety. Verify one intended account, one allowlist row and no public permissions, printing only counts/UUID.
- [ ] Run service tests green and verify the production allowlist has only the intended UUID. Real page login/export is tested in Task 5 once the page and workbook exist. Selectively commit `feat: authorize attendance export through Supabase Auth`.

### Task 5: Build the hidden admin page and real Excel download

**Files:** Create `src/lib/attendance-export.ts`, `src/lib/__tests__/attendance-export.test.ts`, `src/components/admin/AdminPanel.tsx`, `src/components/admin/__tests__/AdminPanel.test.tsx`, `src/routes/admin.tsx`; modify `package.json`, `package-lock.json`. Router regenerates `src/routeTree.gen.ts`.

**Interfaces:** Consumes `AdminGuest[]` from Task 4. Produces `buildAttendanceWorkbook(rows: AdminGuest[]): Promise<ArrayBuffer>`; download is an `.xlsx` Blob created only after fresh authorized fetch and epoch/session checks.

- [ ] Verify official ExcelJS README/package API and pinned 4.4.0 dependency tree. `npm.cmd view exceljs@4.4.0 version engines dependencies --json` was read-only checked while planning. Before install review npm audit output; install with `npm.cmd install --save-exact exceljs@4.4.0 --ignore-scripts`, then audit the resolved lockfile. Do not run `npm audit fix --force` or silently accept a new exploitable runtime issue; report and choose the smallest safe lockfile remedy. Use the public package import, not an undocumented internal file.
- [ ] Write a test that builds and reopens the actual bytes with ExcelJS; run it red before implementing:

```ts
import ExcelJS from 'exceljs';
const rows: AdminGuest[] = ['=', '+', '-', '@'].map((prefix, index) => ({
  id: index + 1, guest_name: `${prefix}SUM(1,2)`, relationship: `${prefix}Bạn bè`,
  attending_status: index % 2 ? 'Not Attending' : 'Attending',
  created_at: '2026-10-11T17:30:00Z',
}));
const bytes = await buildAttendanceWorkbook(rows);
const workbook = new ExcelJS.Workbook();
await workbook.xlsx.load(bytes);
const sheet = workbook.getWorksheet('Danh sách tham dự')!;
expect(sheet.rowCount).toBe(5);
expect(sheet.getCell('A2').value).toBe('=SUM(1,2)');
expect(sheet.getCell('A2').type).toBe(ExcelJS.ValueType.String);
expect(sheet.getCell('C2').value).toBe('Có tham dự');
expect(sheet.getCell('C3').value).toBe('Không tham dự');
expect(sheet.getCell('D2').value).toContain('12/10/2026');
expect(sheet.getCell('D2').value).toContain('00:30');
```

- [ ] Implement a focused module; use dynamic import inside the function so importing its type/function does not place Excel in the initial public bundle:

```ts
export async function buildAttendanceWorkbook(rows: AdminGuest[]): Promise<ArrayBuffer> {
  const {default: ExcelJS} = await import('exceljs');
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet('Danh sách tham dự');
  sheet.columns = [
    {header: 'Họ tên', key: 'name', width: 30},
    {header: 'Mối quan hệ', key: 'relationship', width: 24},
    {header: 'Tham dự', key: 'attendance', width: 22},
    {header: 'Ngày gửi', key: 'date', width: 24},
  ];
  const dateFormat = new Intl.DateTimeFormat('vi-VN', {
    timeZone: 'Asia/Ho_Chi_Minh', year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hourCycle: 'h23',
  });
  const attendance: Record<string, string> = {
    Attending: 'Có tham dự', 'Not Attending': 'Không tham dự', Maybe: 'Có thể',
  };
  for (const row of rows) {
    if (!(row.attending_status in attendance)) throw new Error('Trạng thái tham dự không hợp lệ.');
    const date = new Date(row.created_at);
    if (Number.isNaN(date.getTime())) throw new Error('Ngày gửi không hợp lệ.');
    sheet.addRow([row.guest_name, row.relationship,
      attendance[row.attending_status], dateFormat.format(date)]);
  }
  sheet.getRow(1).font = {bold: true};
  sheet.views = [{state: 'frozen', ySplit: 1}];
  const bytes = await workbook.xlsx.writeBuffer();
  return Uint8Array.from(new Uint8Array(bytes)).buffer;
}
```

String cell values are never formula objects; no CSV “rename to xlsx”, no apostrophe changing guest data. Legacy `Maybe` remains accurately labeled if an old private client sends it during migration; the new form still has only yes/no.
- [ ] Write failing AdminPanel tests for anonymous state, generic wrong-password error, valid login (probe succeeds), logout, network export failure, and pending login during unmount. Use fake sessions with expires_at and mocked auth subscription; no browser localStorage tokens.
- [ ] Implement a minimal panel: required username and password (`autocomplete=username/current-password`), labels, disabled pending buttons, role-alert generic messages, authorized state with “Tải Excel” and “Đăng xuất”. Clear the password form after each login attempt. Never log Auth errors with credentials. Subscribe to `onAuthStateChange` to clear access on null session; unsubscribe on unmount. After login/probe use the returned session; set an expiry timeout at `expires_at * 1000 - Date.now()` to sign out, clear the UI and invalidate pending export. Initialize through a checked `getSession()` if an in-memory session already exists, but authorize through the RPC before showing export controls.
- [ ] Add `downloadEpochRef`: increment on logout, expiry and unmount. Every export captures epoch and checks it after data fetch and workbook generation; stale results cannot create a download. Disable repeated export while busy. If logout fails, clear local session with Supabase local signout and show a retryable error; database authorization still requires a live session. Don't perform network/export inside the Auth callback; only update state there to avoid Auth-lock reentrancy.
- [ ] Add expiry/logout-race tests with fake timers and a deferred workbook promise. Example expected behavior:

```tsx
// After login, click export; leave buildAttendanceWorkbook unresolved.
fireEvent.click(screen.getByRole('button', {name: 'Đăng xuất'}));
await act(async () => finishWorkbook(new ArrayBuffer(8)));
expect(createObjectURL).not.toHaveBeenCalled();
expect(screen.getByLabelText('Mật khẩu')).toBeInTheDocument();
```

- [ ] Create the route using the existing file-route pattern:

```tsx
export const Route = createFileRoute('/admin')({
  head: () => ({meta: [
    {title: 'Quản trị tham dự | Minh Quân'},
    {name: 'robots', content: 'noindex, nofollow'},
  ]}),
  component: AdminPanel,
});
```

Start/build Vite to regenerate router registration. Add no navbar/footer/sitemap link. Check `/admin` direct reload through the current SPA Vercel rewrites; do not create a new rewrite migration if it already works.

- [ ] Complete the panel export handler: `await fetchAdminGuests()`, dynamic `import('@/lib/attendance-export')`, await build, confirm epoch unchanged and current session exists/unexpired, then create Blob with `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`, attach/click/remove an anchor with download `danh-sach-tham-du.xlsx`. Revoke its object URL after the click has been dispatched, also on component cleanup if still pending; report fetch/build failure with `Không thể xuất Excel. Vui lòng thử lại.` Never cache private rows in localStorage or reuse stale data after logout.
- [ ] Add empty workbook header-only test, 1,005-row readback test (`rowCount === 1006`, last attendee present), all formula-prefix cell types in both text columns, unexpected-status and bad-date rejection, absence of email/message columns, no phantom rows and full Unicode names. Run `npm.cmd test -- src/lib/__tests__/attendance-export.test.ts src/components/admin/__tests__/AdminPanel.test.tsx` green.
- [ ] Build and inspect emitted chunks: Excel may be lazy/admin-only, never imported by the public homepage initial request. Verify real browser wrong-password denial, valid login, logout/expiry and a download reopened with correct sheet/header/count. Selectively commit `feat: add hidden admin and Excel attendance download`.

### Task 6: Full-flow verification, exact cleanup and production release

**Files:** Modify `src/routes/memory.$slug.tsx`, release doc and tests needed for the minimal type fix. Include approved dirty UI files in the release commit after reviewing them. Private backups go in ignored `.local-backups/`, never in Git or public assets.

**Interfaces:** Consumes the public submit/reader and authenticated admin workbook flow from Tasks 1–5. Produces verified production, cleanup evidence (counts/IDs, no personal data), source/deployment rollback reference and private full-row backup.

- [ ] Reproduce current `npx.cmd tsc --noEmit` errors. Change memory type `images: number` to `images?: number` and rendering to `Array.from({length: memory.images ?? 0})`; preserve three existing images for `new-beginning` and zero for entries previously undefined. Test that undefined image count renders zero rather than inventing photos.
- [ ] Run `npm.cmd test`, `npx.cmd tsc --noEmit`, `npm.cmd run build`, and scoped ESLint for changed `.ts/.tsx` files using `--rule 'prettier/prettier: [error, {endOfLine: auto}]'`. Do not claim whole-repository lint is clean without running it; distinguish pre-existing issues and build chunk warnings from introduced failures. Run `npm.cmd audit --omit=dev` and full audit; inspect Supabase security/performance advisors. Resolve new security/behavior failures before release, with a minimal documented diff.
- [ ] Use browser-testing/verification skills and list current pages first. At desktop 1440 and mobile 390/360 widths verify the approved photo/navbar and Hero full-screen transition, no horizontal overflow, envelope keyboard Enter/Space, Escape and focus return, long dialog scrolling, admin labels/errors and noindex. Reduced-motion must remove particle effects, not success content. If screenshot automation stalls, inspect the live DOM/geometry and explain screenshot limitation; do not claim an unseen screenshot passed.
- [ ] Submit one uniquely marked yes test and one no test through the real local UI to the approved Supabase project; record their exact returned/read-only matched IDs in a private ledger before cleanup. Verify database status/message/public flag, exact unified popup, confetti normal-motion, event-refresh envelopes, raw public RPC projection and no EmailJS request in browser network. Test duplicate email and transient failure with inputs retained. Never use a real guest email for these tests.
- [ ] Exercise real `/admin`: wrong password denied, anonymous RPC denied, admin login allowed, refresh requires re-login, logout/expiry cancels pending download. Download workbook, reopen it, compare ID-derived row count and names/statuses to authorized RPC data and Vietnam dates. Keep workbooks and screenshots private. SQL tests cover nonadmin and >1,000 rows without leaving 1,000 production records.
- [ ] Run whole-branch review using the execution method the user selected. Native uses one fresh final reviewer; Subagent-driven uses its task gates plus final review. Feed the reviewer the approved spec/plan/diff, not the actual password. Fix review findings with corresponding regression checks before cleanup.
- [ ] Read full rows for precisely IDs `4`, `6` plus ledger test IDs. Create a private JSON backup with `apply_patch` in `.local-backups/`; handle data as data, print only count/IDs, verify parsed backup count equals selected row count and contains every original table field. Confirm `.gitignore` prevents staging it (`git check-ignore .local-backups/rsvp-before-cleanup.json`). Do not leak backup content to logs.
- [ ] Verify every ledger ID still belongs to the marked test row and record current unrelated IDs/count. Delete exact verified IDs only, after backup. Base deletion of the two old wishes is:

```sql
begin;
delete from public.rsvps where id in (4, 6) returning id;
commit;
```

Delete ledger rows with the same explicit-ID pattern and matching test-email guard, not a wildcard or all-rows condition. If any intended row is missing/changed, inspect before deleting; do not broaden the query. Verify IDs gone, new unrelated IDs preserved, public empty state if appropriate and fresh admin export excludes deleted rows. Keep admin account/allowlist intact.
- [ ] Record verification results and source/deployment rollback instructions in `docs/releases/2026-10-12-rsvp-letters-admin-export.md`. State that code rollback does not restore deleted data and must not reopen public attendance or re-enable EmailJS. For emergency rollback select an already-tested compatible deployment; if the old deployed frontend would send EmailJS or expects the old public DTO, create a minimal compatible rollback build rather than blindly promoting it.
- [ ] Review `git diff --check`, `git status`, staged diff and ignored files. Stage explicit task/approved-UI paths only (including `images/bìa.jpg` and Invitation test); commit `feat: release guest letters and protected attendance export`. Push source and rollback tag only after all checks. User already authorized deploy after testing; do not request duplicate broad authorization.
- [ ] Use Vercel deployment skill and official CLI/tooling. Check `vercel.cmd --version` and `vercel.cmd whoami` first: previous session verified CLI 62.2.0 authenticated despite an injected stale “not installed” hint. Let Git integration deploy once; inspect the resulting deployment until READY, avoiding redundant deploys. Verify production alias `lhmq.vercel.app` points at this exact Git SHA, not an older preview.
- [ ] Repeat production public/admin/workbook tests. If testing persistence again, create uniquely marked rows, track exact IDs and back them up/delete only those IDs after checks. Confirm old IDs/test IDs absent, unrelated data survives, no secrets/admin data in public network/storage/bundle, final production GET works and account login/export remains healthy.
- [ ] Hand off production link and `/admin` login username, workbook columns, cleanup counts and rollback reference. Do not repeat the password in the final message. Mention remaining warnings/check limitations and that the invalid internal alias cannot receive recovery email.

## Self-review and execution handoff

- Spec 1/2 → Task 2; spec 3 → Task 3; spec 4 → Task 1; spec 5 → Tasks 4/5; spec 6 → Task 5; spec 7/8 → Task 6.
- The five Review Focus cases have explicit owning tests: Task 4/5 pending-export race, Task 1/5 >1,000 rows, Task 1 old-client privacy, Task 3/6 long safe text/focus, Task 6 backup/exact-ID concurrent arrivals.
- Public/admin DTOs and function names above are shared consistently; admin expiry is checked both in UI and DB.
- No password, auth bypass, automatic broad cleanup, forced dependency upgrade, or new backend is part of this plan.
- Recommend **Native** execution because these six slices share one RPC/auth/UI contract and the existing dirty UI must stay intact. Implement in this session, then request one fresh whole-branch review before destructive cleanup and deploy.
