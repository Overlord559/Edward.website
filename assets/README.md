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
| Stone Colognes   | `projects/stone-colognes/stone-colognes-01-portfolio-overview.png` … `stone-colognes-07-bench-mode.png` |
| StoneOS / Operator Brain | `operator-brain-1-v2.png` … `operator-brain-5-v3.png` |
| BidSignal        | `bidsignal/bidsignal-01-discover.png` … `bidsignal-06-account.png` |
| Opslayer         | `opslayer-1.png` … `opslayer-5.png` |

To add a slide: add another `<li class="carousel__slide">` with an
`<img ... data-fallback="shot">` in `index.html` and a matching file here.
Dots and navigation update automatically.

### BidSignal screenshot status (2026-06-24)

All six carousel slides are **fresh signed-in private-beta captures** (1440×1000 PNG) from local demo (`localhost:3000`). No desktop wallpaper, sign-in screens, email, API keys, or billing IDs included.

| File | Route | Status |
| ---- | ----- | ------ |
| `bidsignal-01-discover.png` | `/discover` | **Fresh** — ranked opportunity cards |
| `bidsignal-02-opportunity-detail-cmmc.png` | `/opportunities/[id]` | **Fresh** — quick decision, strategic path, bid reality |
| `bidsignal-03-queue.png` | `/queue` | **Fresh** — Today's Queue |
| `bidsignal-04-targeting-profile.png` | `/targeting-profile` | **Fresh** — workspace targeting profile |
| `bidsignal-05-pricing.png` | `/pricing` | **Fresh** — pricing tiers |
| `bidsignal-06-account.png` | `/account` | **Fresh** — billing & account (no PII) |

Legacy root files `bidsignal-1.png` … `bidsignal-5.png` are **not referenced** in `index.html`; safe to archive.

### Stone Colognes screenshot inventory (2026-06)

Seven **portfolio-safe** captures (1440×1000 PNG) copied from `C:\dev\stone-colognes\docs\portfolio-screenshots\` into `assets/projects/stone-colognes/`. Internal sensual fragrance imagery is **not** used. Compare and formula-detail captures were excluded.

| File | Source (Stone Colognes) | Route / purpose |
| ---- | ------------------------- | --------------- |
| `stone-colognes-01-portfolio-overview.png` | `…-01-portfolio-overview.png` | `/portfolio` — public overview |
| `stone-colognes-02-showcase-trio.png` | `…-02-showcase-trio.png` | `/showcase` — signature trio |
| `stone-colognes-03-cart-optimizer.png` | `…-03-cart-optimizer.png` | `/cart` — kit planning |
| `stone-colognes-04-ingredients-inventory.png` | `…-04-ingredients-inventory.png` | `/ingredients` — depletion math |
| `stone-colognes-05-batch-timeline.png` | `…-06-batch-timeline.png` | `/batches` — maceration timeline |
| `stone-colognes-06-reference-library.png` | `…-07-reference-library.png` | `/reference` — safety & glossary |
| `stone-colognes-07-bench-mode.png` | `…-09-bench-mode.png` | `/bench/:id` — step-by-step mixing |

**Not used:** `stone-colognes-05-formula-compare.png`, `stone-colognes-08-formula-detail.png` (internal promo art risk).

### Unreferenced on-disk assets

| File | Notes |
| ---- | ----- |
| `missiondesk/missiondesk-mobile.png` | Not in carousel — optional future slide |
| `missionbridge/missionbridge-ai-hero.png`, `missionbridge-ai-preview.png` | Superseded by numbered `01`–`05` set |

## Résumé

| File                      | Notes                          |
| ------------------------- | ------------------------------ |
| `Edward_Stone_Resume.pdf` | Linked from Hero + Résumé CTAs |
