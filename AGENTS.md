# AGENTS.md

## Project Purpose
- CozyBlock is a mechanics-first packing puzzle prototype.
- Favor gameplay clarity, fast iteration, and simple code over polish or architecture.
- Keep the experience lightweight enough for rapid playtesting on mobile and desktop.

## Repo Shape
- `src/components/Game.jsx`: top-level game state, drag/rotate interactions, level switching, and UI flow.
- `src/components/Board.jsx`: board rendering and placed/ghost piece rendering.
- `src/components/Piece.jsx`: piece rendering from local grid data.
- `src/data/pieces/`: canonical runtime piece library.
- `src/data/levels/`: folder-based handcrafted level content organized by set.
- `src/utils/grid.js`: placement, collision, occupancy, and rotation helpers.
- `src/index.css`: primary styling surface.

## Local Commands
- `npm install`: install dependencies.
- `npm run dev`: start the Vite dev server.
- `npm run build`: production build validation. Run this before opening a PR.

## Product Constraints
- Preserve the mechanics-first scope.
- Do not introduce unnecessary libraries or architectural layers without a clear payoff.
- Keep puzzle logic data-driven and easy to tweak.
- Prefer small, readable edits over abstractions.
- Preserve the current mobile-first card presentation unless the issue explicitly changes it.

## Git Workflow
- Treat GitHub issues as the unit of planned work for meaningful changes.
- Create work branches from `main` using `codex/<issue-number>-short-slug`.
- Keep changes scoped to one issue whenever practical.
- Open a PR for merge back to `main`; avoid direct pushes to `main` except for true emergencies.
- PR descriptions should link the issue and use closing keywords when appropriate, for example `Closes #12`.

## Agent Expectations
- Before editing, inspect the relevant files and understand the current interaction flow.
- When UI changes, include concise testing notes and screenshots in the PR when useful.
- If a task affects gameplay behavior, verify both placement logic and visible interaction behavior.
- If a task is ambiguous, prefer the smallest safe change that preserves the prototype’s iteration speed.
