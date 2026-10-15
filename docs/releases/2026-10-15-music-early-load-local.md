# Earlier background music loading — local verification

- The original MP3 is unchanged (5,749,240 bytes; source and built SHA-256 match). Its audio element now lives in the initial HTML with `preload="auto"`, so loading can start before React executes. React reuses that element, sets volume to 0.35, and retains gesture retry and cleanup.
- Cold isolated Chrome, 390 × 844 mobile viewport, Slow 4G, 4× CPU slowdown: observed `loadstart` changed from 4,546 ms to 674 ms. These are individual samples measuring request initiation, not a guarantee of audible playback time. The updated sample reached `canplay` at 13,365 ms; autoplay remained blocked until a tap.
- A tap started playback; navigating into an album kept playback advancing with exactly one audio element. No browser console errors or warnings were observed.
- Three playback tests, scoped ESLint, TypeScript and the production build passed. The tests exercise the actual HTML audio fixture, playback reuse, volume, gesture retries and unmount cleanup.
- Production release authorized on 2026-10-15. Previous production: commit `021d052`, deployment `dpl_HrtWz3YE8U4cMi8kFt4QWVcqPc8q`. Rollback tag: `backup/pre-early-music-2026-10-15`.
- Physical iOS/Android playback has not been measured. Browser autoplay/preload policy and network throughput still apply.
