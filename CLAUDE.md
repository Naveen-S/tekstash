# TekStash

A developer knowledge hub for snippets, commands, prompts, notes, files, images, links and custom types.


## Context Files

Read the following to get the full context of the project:
- @context/project-overview.md
- @context/coding-standards.md
- @context/ai-interactions.md
- @context/current-feature.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Critical: Non-standard versions

This project uses **Next.js 16** and **Tailwind CSS v4** — both have breaking changes from versions in your training data. Before writing any code that touches routing, rendering, or styling APIs, read the relevant guide in `node_modules/next/dist/docs/`. Heed deprecation notices.

## Commands

```bash
npm run dev      # start dev server (http://localhost:3000)
npm run build    # production build
npm run lint     # ESLint (eslint.config.mjs, Next.js ruleset)
```

There is no test suite yet.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript**
- **Tailwind CSS v4** via `@tailwindcss/postcss` — configured in `postcss.config.mjs`, imported in `src/app/globals.css` with `@import "tailwindcss"`; no `tailwind.config.*` file
- **Geist** fonts loaded via `next/font/google` in `src/app/layout.tsx`

## Structure

All source lives under `src/app/` using the App Router file conventions:

- `layout.tsx` — root layout; sets Geist font CSS variables and `min-h-full flex flex-col` on `<body>`
- `page.tsx` — home page
- `globals.css` — global styles (currently only the Tailwind import)
