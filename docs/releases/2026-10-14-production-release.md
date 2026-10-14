# Production release preparation — 2026-10-14

- Authorized destination: GitHub `NoirDork/lhmq`, `main`; Vercel project `prj_7ukmyaoDxPGz1SQQTSFFd8ivqTBA`, team `team_LOB0k2VCM0QsMuQ5m5Jkmhxp`, Vite / Node 24.
- Previous production: `dpl_DZzJ1fFTc9ziaRPgrnvsU4gK1gjZ` (`lhmq-64ruwzzaq-noirdorks-projects.vercel.app`). Keep as the frontend rollback candidate.
- Supabase `jvbdzzidmnzxqhfyyvqv`: applied `wish_photos_remove_admin` successfully. Public JPEG bucket is limited to 2 MB; no attendance/email fabricated for new wishes; admin export RPC removed.
- Real anonymous API checks passed: text and photo submission, retry/idempotency, pending photo privacy, completed public photo retrieval, invalid MIME / oversized / unreserved upload rejection, no list / overwrite / delete / raw row access.
- Temporary cleanup policies were restricted to the single test image and expired after five minutes; image was removed through Storage API, then both policies were dropped. Only the two exact test requests were deleted. Verified: 0 wishes, 0 photo objects, 0 temporary policies.
- 32/32 unit tests, TypeScript and production build passed. Existing bundle-size warning remains. Changed-file ESLint passed in the pre-push checks.
- Security advisors are unchanged: RLS-without-policy info is intentional (RPC-only data access); pre-existing Auth leaked-password protection warning remains. No new Auth access is used by the public guestbook. Remediation: https://supabase.com/docs/guides/auth/password-security#password-strength-and-leaked-password-protection
- Production deploy status must be verified after this commit reaches `main`; this document does not claim the deployment is already live.

## Limits / rollback

- Frontend rollback does not restore admin export after the migration. Legacy guestbook RPCs are retained, so the old public form remains compatible.
- User-supplied timeline photos are still pending. Mobile layout measurements passed; the latest mobile screenshot tool stalled. Physical iOS/Android file selection and audio were not tested.
- Public photos can be shared by URL outside the envelope. No moderation or CAPTCHA was added; the existing new-request cap is 20/minute globally.
- The Vercel connector lacked scope access; the existing authenticated Vercel CLI verified the correct project and previous production.
