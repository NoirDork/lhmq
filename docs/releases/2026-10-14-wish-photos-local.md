# Guest photos — local verification

Status: local verification followed by authorized production migration and real Storage verification on 2026-10-14. See `2026-10-14-production-release.md` for the release checks; the original local-only limitations below describe the earlier test stage.

## Implemented

- Wish form no longer collects email or attendance; keeps name, relationship and message.
- Optional JPG/PNG/WebP, max 5 MB input; decoded and re-encoded as JPEG (max 1600 px, 2 MB upload) to remove EXIF metadata.
- Explicit notice that name, wish and attachment are public. Photo appears only inside the opened envelope.
- Existing wishes remain readable. Success popup and confetti retained.
- Removed admin route, Excel code/dependency; staged migration removes export RPCs but retains historical rows and Auth account.
- Uses supplied new signature asset.

## Verified

- `npm test`: 27 tests in 6 files passed, including rejected-photo error clearing after valid replacement, upload failure, retry/idempotency, modal and public photo behavior.
- `npx tsc --noEmit`: passed.
- ESLint on changed frontend and tests: passed.
- `npm run build`: passed; existing >500 kB chunk warning remains.
- `git diff --check`: passed (line-ending notices only).
- `supabase/tests/wish_photos.sql` passed against local PGlite with representative baseline: validation, idempotency, pending photo privacy, publication, Storage RLS, historical data and export removal.
- Browser at port 5174, backed exclusively by local test adapter at 54329: text-only and photo submission, error for invalid/oversized image, valid replacement clears error, remove image, open letter with image, success popup, mobile 390 px without horizontal overflow, Escape/focus restoration, `/admin` returns 404.
- Browser photo fixture had no console warnings/errors.

## Limits / before release

- Docker engine was unavailable. PGlite and a local Storage HTTP adapter are not a real Supabase Storage integration. The full historical migration chain and updated legacy SQL test were not executed in this harness.
- Native OS file chooser automation was unavailable; browser-created image fixtures exercised the real change handler, image processing, upload and publish flow. Test actual file selection on desktop and iOS/Android before release.
- Apply `20261013042301_wish_photos_remove_admin.sql` only with release authorization; test actual bucket/RLS/upload/public retrieval and retry against Supabase before deploying the new client, which requires `get_wishes` and `begin_wish`.
- Bucket images are intentionally public; their URLs can be shared independently of the envelope UI. No moderation/CAPTCHA is added. Creation is capped globally at 20 new requests/minute; abandoned pending uploads have no automatic cleanup.
- Frontend rollback alone does not restore admin export after migration; old guestbook APIs remain for compatibility.

Local preview: `http://127.0.0.1:5174/#rsvp`. Test fixture: `http://127.0.0.1:5174/.photo-preview.local/index.html`. Test data is in-memory and never sent to production.
