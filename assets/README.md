# Assets

Drop images and the résumé here. Filenames are referenced directly in
`index.html`, so adding a correctly named file is all that's needed — no code
changes. Until a real file exists, the site shows an on-brand labeled
placeholder (navy + ember reticle) instead of a broken image.

## Capture expectations

- **Recommended viewport:** 1440×1000 (16:10-ish), PNG preferred
- **Browser:** logged-in app state where needed; hide or blur secrets before capture
- **Never include:** API keys, `.env` values, billing IDs, real customer emails, or live account tokens
- **BidSignal:** capture from local/invite-only demo only — no public SaaS URL

## Photography

| File                      | Used in          | Recommended size      | Notes                                                                 |
| ------------------------- | ---------------- | --------------------- | --------------------------------------------------------------------- |
| `hero-bg-v2.png`          | Hero background  | 2400×1400 (landscape) | Moody, atmospheric. Dark areas read best; gradient overlay applied. |
| `edward-portrait.png`     | About            | 800×1000 (4:5)        | Clean portrait. Rendered with subtle desaturation.                  |
| `edward-military.png`     | Service section  | 1200×800 (3:2)        | Dignified service photo. Restrained / slightly desaturated.           |

## Project screenshots

Recommended size: **1440×1000**, PNG or JPG. Carousels use `carousel--contain` for tall UI frames.

| Project          | Filenames |
| ---------------- | --------- |
| MissionDesk AI   | `missiondesk/missiondesk-hero.png`, `missiondesk-ticket-intake.png`, `missiondesk-troubleshooting-path.png`, `missiondesk-resolution-builder.png`, `missiondesk-kb-draft.png`, `missiondesk-ops-dashboard.png` |
| MissionBridge AI | `missionbridge/missionbridge-ai-01-hero.png` … `missionbridge-ai-05-handoff.png` |
| StoneOS / Operator Brain | `operator-brain-1-v2.png` … `operator-brain-5-v3.png` |
| BidSignal        | `bidsignal/bidsignal-01-discover.png` … `bidsignal-06-account.png` |
| Opslayer         | `opslayer-1.png` … `opslayer-5.png` |

To add a slide: add another `<li class="carousel__slide">` with an
`<img ... data-fallback="shot">` in `index.html` and a matching file here.
Dots and navigation update automatically.

### BidSignal screenshot status (2026-06-24)

| File | Status |
| ---- | ------ |
| `bidsignal-05-pricing.png` | **Fresh** — current pricing tiers capture |
| `bidsignal-01-discover.png` | Legacy placeholder (repurposed from pre-folder assets) — replace when fresh Discover capture available |
| `bidsignal-02-opportunity-detail-cmmc.png` | Legacy placeholder — replace with current opportunity detail |
| `bidsignal-03-queue.png` | Legacy placeholder — replace with current Today's Queue |
| `bidsignal-04-targeting-profile.png` | Legacy placeholder — replace with current targeting profile |
| `bidsignal-06-account.png` | Legacy / auth-gated placeholder — replace when safe account screen capture exists |

Legacy root files `bidsignal-1.png` … `bidsignal-5.png` are **not referenced** in `index.html`; safe to archive.

### Unreferenced on-disk assets

| File | Notes |
| ---- | ----- |
| `missiondesk/missiondesk-mobile.png` | Not in carousel — optional future slide |
| `missionbridge/missionbridge-ai-hero.png`, `missionbridge-ai-preview.png` | Superseded by numbered `01`–`05` set |

## Résumé

| File                      | Notes                          |
| ------------------------- | ------------------------------ |
| `Edward_Stone_Resume.pdf` | Linked from Hero + Résumé CTAs |
