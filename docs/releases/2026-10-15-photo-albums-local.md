# Local photo and music update — 2026-10-15

- Uses nine numbered folders (1–6, 8–10); user confirmed folder 7 was intentionally removed. Each `0.*` is the card cover, never a child slide. All 190 child photos are mapped into the matching album.
- Added the five year/graduation photos and the user's full supplied text to the alternating timeline. Avatar uses `ẢNH THÊM/MINH QUÂN LÀ AI_.jpg`.
- `node scripts/prepare-gallery.mjs` creates optimized WebP copies; original user assets remain untouched. 205 images: 129.6 MB source → 31.7 MB output. Covers max 960 px, child/story photos max 1600 px, portrait max 800 px; original orientation and proportions preserved. Timeline dimensions reserve space before lazy loading.
- One shared album data source feeds cards and detail routes. Detail photos use object-contain with native lazy loading and the existing carousel; no stock photos, tint overlays or invented album descriptions remain.
- Music changed to the supplied Hoàng Dũng / Rhymastic file. Removed all in-page playback controls, enabled looping and attempted autoplay. Browser policy can block initial audible playback; the next pointer/keyboard gesture retries. Music stays mounted across client-side route changes.

## Checks

- 33/33 unit tests passed, including album counts, no cover duplication, autoplay success/block/retry and listener cleanup.
- TypeScript, changed-file ESLint, production build and diff whitespace check passed. Existing large-JS-chunk build warning remains.
- Browser: all nine cards render, C5 album renders 15 child slides, keyboard navigation works, real MP3 playback advances and continues across home → album → home. No in-page audio control remains; no browser console errors/warnings.
- 320, 768, 1024 and 1440 px layouts checked without horizontal page overflow. Desktop timeline/gallery and mobile album visually inspected. New avatar and graduation photo inspected.

Local preview: http://127.0.0.1:5174/#journey. Release authorized for `main` and Vercel production on 2026-10-15. Original album/story folders are ignored by Git and remain on this computer; only the optimized WebP copies are shipped. The gallery preparation script requires those local originals; it is not part of the deployment build. No Supabase changes are required. Physical iOS/Android behavior and listening through speakers were not checked.

## Follow-up: repeat reveals and slideshow

- Timeline now fades back out when leaving the viewport and reveals again from either scroll direction. Reduced-motion preference keeps the content visible.
- Album counter replaced with at most five clickable nodes. From the third image, the active node stays in slot three while the node window slides in either direction, including loop boundaries. Selected node follows arrow/swipe/keyboard navigation; slideshow advances every five seconds with looping. Every manual image selection restarts the full five-second delay. Playback toggle removed as requested.
- Timer and Embla listeners are cleaned up on unmount. No autoplay dependency added.
- Final release checks: 38 unit tests passed. TypeScript and scoped ESLint passed. Browser scroll-down check: first chapter opacity 0 after leaving view; scroll-up: first chapter opacity 1 again. Browser slideshow advances and manual node/arrow selection works; five-node window stays within the 320 px page, active slot stays centered after reaching the third node. Playback toggle is absent. Timer-reset and listener-cleanup regression tests passed.
