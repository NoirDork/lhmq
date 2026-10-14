# Canva requirements — local implementation

Source: https://www.canva.com/design/DAHX0msi7R8/RxwSpdneYHOTkmo2ojNr6A/edit

Read the live document through the browser on 2026-10-14. It now has 17 pages; page 17 contains signature references, not another feature request. No Canva content was edited.

| Slide | Local status |
| --- | --- |
| 1 | Countdown to 2026-10-23 10:30 Asia/Ho_Chi_Minh in cover and event details; school name standardized. Uses the user's supplied MP3, “Tháng Năm Đẹp Nhất Cuộc Đời” – Vũ Thịnh, with a floating play/pause button, looping, 35% initial volume and no autoplay. |
| 2 | Full supplied signature, invitation names Minh Quân, exact new introductory paragraph, duplicate school row removed and location placed first. |
| 3 | Exact supplied biography and heading; uses user's existing cover photo for portrait. |
| 4–8 | Alternating five-chapter timeline with scroll reveal and reduced-motion support. Explicit empty photo frames pending user's promised images; no reference person's photos copied. |
| 9 | Old About section replaced; old “Một hành trình…” text removed. |
| 10 | Gallery precedes event details. |
| 11–12 | Invitation artwork extracted from user's Canva, left photo/right countdown and details; 23/10/2026 Friday, 10:30–13:00; three exact contact numbers; Google map and directions link; CTA links to #rsvp. |
| 13 | Event schedule no longer rendered; Timeline component now represents personal journey. |
| 14 | Prior wish/photo implementation retained. No email or attendance fields, no name placeholder, public photo notice retained for informed sharing. Description excludes attendance to match the explicit removal request. |
| 15 | Exact heading and thank-you text; “LỜI CHÚC” label; recipient line removed from envelopes and opened letters. |
| 16–17 | Full supplied signature in footer and hero; full school/faculty wording. |

## Verification

- Countdown red/green tests: correct timezone, updates, timer cleanup, no negative values after event; full suite including music 32/32 passed.
- Music tests cover play/pause, rejected playback with retry, and media errors. Browser playback advanced from 0.02 to 4.62 seconds; pause stopped playback and reset the button. Before clicking, audio readyState was 0 and only Vite's 300-byte import module was requested, not the MP3 audio. The button fits the 320 px viewport; browser console had no errors/warnings.
- TypeScript passed; ESLint on changed UI passed; production build passed with existing >500 kB bundle warning.
- Browser checks at 320, 768, 1024, 1440 px: no horizontal page overflow. Responsive signature sized to fit narrow footer.
- Found and fixed the existing graduation text clipping at 1024 px: text measured 1205 px inside 961 px; after fix 789 px inside 961 px. At 320 px: 241 px inside 288 px.
- Inspected mobile cover, desktop invitation card and timeline; verified local images loaded, chapter reveal states and section order.
- Clicked event CTA and confirmed #rsvp/form; verified form has only name, relationship, photo inputs plus message textarea.
- Browser console checked without errors/warnings; Google Maps iframe loaded its embed document. Phone links were inspected, not dialed.
- Signature follow-up: reduced size, moved lower/right and tilted -6 degrees; original blue/white artwork retained. Desktop screenshot inspected. At 390 px, DOM inspection confirms no horizontal overflow and about 29 px clearance before the invitation paragraph. Mobile screenshot capture stalled, so this follow-up has no fresh mobile visual confirmation.
- Pre-push recheck: 32/32 tests, TypeScript, lint on all changed TypeScript files, production build and local PGlite SQL checks passed.

## Remaining / release constraints

- Music source was supplied by the user and bundled successfully (8.26 MB); audio uses preload="none". Playback was checked in Chromium mobile emulation, not on physical iOS/Android devices or through a speaker listening check.
- Timeline photos are intentionally awaiting user assets. Avatar currently reuses their cover image.
- The photo RPC migration and real Supabase Storage checks were completed with release authorization on 2026-10-14; see `2026-10-14-production-release.md`.
- Local preview at http://127.0.0.1:5174 uses only in-memory local guest test data.
