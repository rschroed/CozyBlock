# CozyBlock

CozyBlock is a playable web prototype for a Tetris-inspired packing puzzle. Players drag, rotate, and place block shapes onto an irregular board until every valid cell is filled.

The project is intentionally lightweight:
- React + Vite
- plain CSS
- local state only
- mechanics-first decisions over product polish

## Run Locally

```bash
npm install
npm run dev
```

Build for verification with:

```bash
npm run build
```

## Repo Layout
- `src/components/Game.jsx`: main game flow and interactions
- `src/components/Board.jsx`: board rendering
- `src/components/Piece.jsx`: piece rendering
- `src/data/levels.js`: pieces and puzzle boards
- `src/utils/grid.js`: placement and collision rules
- `src/index.css`: UI styling

## Workflow

This repo uses a lean GitHub issue and branch workflow.

1. Create or pick a GitHub issue for the task.
2. Branch from `main` using `codex/<issue-number>-short-slug`.
3. Make the change and verify it locally with `npm run build`.
4. Open a PR back to `main`.
5. Link the issue in the PR body and use a closing keyword such as `Closes #123`.
6. Merge to `main` to trigger the GitHub Pages deploy.

Direct pushes to `main` are not the default path and should be reserved for true emergencies.

PR titles should stay short and imperative, for example `Adjust rotate button placement`. Put the issue reference in the PR body instead of the title.

## Issue Types
- `Bug`: broken behavior, regressions, or interaction problems
- `Feature`: new capability or user-facing enhancement
- `Task/Chore`: maintenance, cleanup, docs, tooling, or process work

## Labels
- `bug`
- `feature`
- `design`
- `playtest`
- `chore`
- `infra`

The repo may also retain GitHub’s default labels alongside these starter workflow labels.

## Design And Playtest References
- Figma is used for visual direction and iteration.
- GitHub issues should be the home for playtest findings, UI follow-ups, and implementation tasks.

## Branch Protection Recommendation

For GitHub settings, enable branch protection on `main` with pull requests required before merge. Reviewer requirements can stay off for now to keep the workflow solo-friendly.
