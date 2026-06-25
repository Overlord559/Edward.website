# AGENTS.md — Edward.website (Portfolio)

**Audience:** Cursor, Claude, Codex, and other agents working in this repository.

**Project:** Edward Stone portfolio static site — nested repo inside Operator Brain workspace.

**Path:** `C:\dev\operator-brain\Edward.website`

---

# Stone Industries Routing

This repo uses the Stone Industries execution hierarchy:

1. Operator Brain = active execution cockpit and current-state memory.
2. Stone Industries OS / Stone Command Library = company-wide prompt/rules/playbook library.
3. Repo-local Project OS = project-specific working memory.
4. SaaS Factory = reusable build/design/prompt factory when relevant.

Read first for serious work:

`C:\dev\operator-brain\BRAIN_INDEX.md`  
`C:\dev\operator-brain\current-state.md`

Company command library:

`C:\dev\stone-industries-os\00_SYSTEM\CANONICAL_SOURCE_OF_TRUTH.md`

Do not copy the full Master Project OS into this repo.

If context conflicts, report: **Context Conflict Detected**  
If prompt scope is too broad/risky, report: **Prompt Risk Detected**

No git commit/push/stage/reset/clean without explicit approval.

---

## Operating rules

- Static HTML/assets — no backend
- Portfolio screenshots and case study assets only
- `C:\dev\Edward.website` at dev root does **not** exist — use this nested path

---

## Validation

Manual browser open of `index.html` or local static server.
