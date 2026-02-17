# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build & Dev Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript check + Vite production build
- `npm run preview` — Preview production build

No test runner or linter is configured.

## Tech Stack

- React 19 + TypeScript + Vite 6
- Tailwind CSS v4 (via `@tailwindcss/vite` plugin)
- No state management library — plain `useState` in App.tsx with prop drilling

## Architecture

Single-page ALIEN RPG character sheet manager for the "Destroyer of Worlds" campaign.

**Two access modes:**
- **Player mode** — select a character from the login screen
- **GM mode** — PIN-protected, can view/edit any character

**State:** All character data lives in `App.tsx` as a `useState` array. `App` owns mutation handlers and passes them down as props. No context or reducers.

**Data flow:** `App` → `LoginScreen` (auth) or `CharacterSheet` (main view). `CharacterSheet` uses tabs to switch between `SkillsTab`, `WeaponsTab`, and `GearTab`.

**Key files:**
- `src/types.ts` — `CharacterData`, `Weapon`, `Attribute`, `SkillDef` interfaces
- `src/data.ts` — All 7 pre-loaded characters, skill definitions, attribute color map, GM PIN
- `src/App.tsx` — Root component, all state and mutation logic

## Conventions

- **Never write comments in code**
- Dark terminal-aesthetic UI (black/gray backgrounds, colored text per attribute)
- Attribute color coding: STR=red, AGI=green, WIT=blue, EMP=yellow
- TypeScript strict mode with `noUncheckedIndexedAccess`
