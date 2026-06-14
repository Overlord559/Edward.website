# Edward.website

Personal résumé / portfolio site for **Edward Stone** — U.S. Air Force veteran,
full-stack developer, and AI builder.

- **Live:** https://overlord559.github.io/Edward.website
- **Stack:** plain HTML / CSS / JS — **no build step, no npm**. Deploy with `git push`.

## Files

| File         | Purpose                                                       |
| ------------ | ------------------------------------------------------------- |
| `index.html` | Single-scroll site (nav, hero, about, skills, projects, etc.) |
| `style.css`  | Dark navy theme, responsive, reduced-motion aware             |
| `script.js`  | Reusable carousel, scroll reveal, nav, image fallbacks        |
| `assets/`    | Project screenshots + résumé PDF (see `assets/README.md`)     |

## Local preview

No server required — open the file directly:

```powershell
start index.html
```

## Adding screenshots / résumé

See [`assets/README.md`](assets/README.md). Add files with the referenced
names; the carousels pick them up automatically. Missing images show a clean
placeholder until then.
