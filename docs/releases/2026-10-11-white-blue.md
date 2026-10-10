# White / pastel-blue theme — 2026-10-11

## Changed

- White backgrounds, black text, pastel-blue buttons and decoration; existing layout and motion preserved.
- Sky-blue signature over the graduation heading; footer signature remains neutral.
- Light attendance picker and confirmation dialogs, with darker status/error text for readability.

## Restore the previous version

- Previous source commit: `8e3bce2042f765d004c742fb0837ccf8821a39f9`.
- Backup Git tag: `rollback/pre-white-blue-20261011`.
- New release tag: `release/white-blue-20261011`.
- Previous production deployment: `https://lhmq-bidm84mtk-noirdorks-projects.vercel.app` (`dpl_5cYSCBgXAWLsG23v7SERwZocHNwC`).
- Vercel project: `noirdorks-projects/lhmq` (`prj_7ukmyaoDxPGz1SQQTSFFd8ivqTBA`).

For an immediate site rollback, run from this linked project directory:

```powershell
vercel rollback https://lhmq-bidm84mtk-noirdorks-projects.vercel.app --scope noirdorks-projects
```

Vercel rollback pauses automatic production-domain assignment; use `vercel promote` when ready to resume releases. If the old deployment is no longer retained or the plan does not permit instant rollback, restore the source and deploy it instead.

To also restore the source without rewriting Git history, start from a clean checkout of current main, review any later overlapping changes, then run:

```powershell
git revert --no-edit release/white-blue-20261011
git push origin main
```

Resolve conflicts if later commits overlap; then deploy the reverted source. No Supabase data, schema, or environment variables changed in this release, and site/source rollback does not roll back guest responses.

## Known limitations

- Five existing TypeScript errors in the memory route: missing `images` values. They are outside this visual change.
- Existing build chunk-size warning remains; Safari/Firefox have not been visually checked.
