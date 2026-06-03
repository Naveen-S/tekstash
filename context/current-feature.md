# Current Feature

Dashboard UI Phase 1 — Initial dashboard layout, ShadCN setup, top bar, and placeholder sidebar/main areas. Phase 1 of 3. See @context/features/dashboard-phase-1-spec.md.

## Status

Phase 1 complete — Phase 2 next

## Goals

- ShadCN UI initialization and component installation
- Dashboard route at `/dashboard`
- Main dashboard layout and any global styles
- Dark mode by default
- Top bar with search and "new item" button (display only)
- Placeholder sidebar and main area — for now just an `h2` reading "Sidebar" and "Main"

## Notes

- This is the first of three phases for the dashboard UI layout.
- Use the reference screenshot for the intended look.
- References:
  - @context/screenshots/image-light.png
  - @context/project-overview.md
  - @src/lib/mockdata.ts
  - @context/features/dashboard-phase-2-spec.md
  - @context/features/dashboard-phase-3-spec.md

## History

<!-- Keep this updated. Earliest to latest -->

- **2026-05-25** — Initial Next.js 16 + Tailwind CSS v4 setup via Create Next App
- **2026-06-01** — Started Dashboard UI Phase 1 (ShadCN setup, `/dashboard` route, top bar, sidebar/main placeholders)
- **2026-06-03** — Completed Dashboard UI Phase 1: shadcn/ui initialized (`base-nova` preset → Base UI, neutral base color, lucide icons); added `button` + `input`; dark mode default via `.dark` on `<html>`; Geist wired to `--font-sans`/`--font-mono`; `/dashboard` route with sidebar + sticky top bar shell (search + theme toggle + New Item, display only) and `Sidebar`/`Main` placeholders; `/` redirects to `/dashboard`
