# Assets

Drop images and the résumé here. Filenames are referenced directly in
`index.html`, so adding a correctly named file is all that's needed — no code
changes. Until a real file exists, the site shows an on-brand labeled
placeholder (navy + ember reticle) instead of a broken image.

## Photography

| File                      | Used in          | Recommended size      | Notes                                                                 |
| ------------------------- | ---------------- | --------------------- | --------------------------------------------------------------------- |
| `hero-bg.png`             | Hero background  | 2400×1400 (landscape) | Moody, atmospheric (mountains / sky). Dark areas read best; a gradient overlay is applied. If missing, the hero falls back to a cinematic gradient. |
| `edward-portrait.png`     | About            | 800×1000 (4:5)        | Clean portrait. Rendered with a subtle desaturation.                  |
| `edward-military.png`     | Service section  | 1200×800 (3:2)        | Dignified service photo. Treated restrained / slightly desaturated.   |

## Project screenshots

Recommended size: **1600×1000** (16:10), PNG or JPG.

| Project        | Filenames                                       |
| -------------- | ----------------------------------------------- |
| BidSignal      | `bidsignal-1.png` … `bidsignal-5.png`           |
| Opslayer       | `opslayer-1.png` … `opslayer-5.png`             |
| Operator Brain | `operator-brain-1.png` … `operator-brain-5.png` |
| MissionDesk AI | `missiondesk/missiondesk-hero.png`, `missiondesk-ticket-intake.png`, `missiondesk-troubleshooting-path.png`, `missiondesk-resolution-builder.png`, `missiondesk-kb-draft.png`, `missiondesk-ops-dashboard.png` |

To add a slide: add another `<li class="carousel__slide">` with an
`<img ... data-fallback="shot">` in `index.html` and a matching file here.
Dots and navigation update automatically.

## Résumé

| File                      | Notes                          |
| ------------------------- | ------------------------------ |
| `Edward_Stone_Resume.pdf` | Linked from Hero + Résumé CTAs |
