---
name: cozyblock-levels-designer
description: Use when generating, critiquing, or refining CozyBlock puzzle levels. This skill applies the repo's world and level design docs so level work stays intentional, readable, and aligned with CozyBlock's learning arc.
---

# CozyBlock Levels Designer

Use this when you need to design one CozyBlock level, critique an existing level or board concept, or refine a level without changing the game's mechanics.

## Source Of Truth

Use these repo docs as the primary references:

- `docs/world-design-strategy.md`: world progression, pacing, and learning goals
- `docs/level-design-system.md`: individual puzzle construction, archetypes, workflow, failure modes, and checklist

If this skill conflicts with those docs, the docs win.

Use the world doc for world or campaign questions. Use this skill for level-level execution.

## Use This When

Operate in one of these modes:

- `Generate`: design one level, or at most a very small candidate set, around a specific idea.
- `Critique`: evaluate a level or board concept against the repo's level design rules and call out concrete risks.
- `Refine`: improve an existing level while preserving its intended teaching moment.

Unless explicitly asked otherwise:

- Do not write code.
- Do not edit repo files.
- Do not design whole worlds or campaigns here.
- Do not build generators, solvers, or editors.
- Do not dump large batches of levels.
- Keep examples small and illustrative.

## Working Principles

- `aha over attrition`
- Prefer early signal over late punishment.
- A good level has one dominant idea.
- Design for clarity, constraint, and intention.
- Use archetypes as tools, not labels to pile up.

Reject these by default:

- random dragging as a reliable solve path
- brute-force branch explosion
- ambiguity with no teaching value
- irregular board shapes that exist only to look different
- hidden fail-late punishment as a default difficulty lever

## Non-Negotiables

These are hard rules unless a rare exception is clearly intentional:

- Board cell count must equal total piece area.
- Piece shapes must be edge-connected. No diagonal-only logic.
- No accidental multi-solution ambiguity unless that ambiguity preserves the same intended insight.
- No puzzle that is reliably solved by random placement.
- No routine `1x1` filler in standard play.
- No board irregularity without purpose. Every shape feature should serve the puzzle idea.
- No excessive fail-late structure unless it is rare, fair, and clearly signaled.

## Workflow

Use this loop every time:

1. State the intended moment in one sentence: "This level is about..."
2. Name the supporting world learning goal, or say `standalone / no world specified`.
3. Choose one primary archetype and, at most, one secondary support idea.
4. Identify the key constraint, key piece, or key relationship.
5. Build the board to express that constraint, not to maximize novelty.
6. Test obvious alternatives and wrong-order play.
7. Simplify until the level has one dominant read.

If you cannot state the level's main idea in one sentence, the level is not ready.

## Difficulty Guardrails

Difficulty comes from meaningful reasoning, not from branch count.

Main difficulty levers:

- number of viable placements
- need for rotation
- order dependency
- misleading but plausible options
- tightness of fit

Difficulty guidance:

- `Easy`: strong visual guidance, few viable openings, wrong ideas fail quickly
- `Medium`: some misleading options, one or two meaningful order or rotation checks
- `Hard`: tight sequencing, controlled deception, readable downstream pressure

Hard levels should still feel authored. They should not become search problems.

## Piece Notes

Use piece-specific guidance only when it helps the puzzle read more clearly:

- `Line`: good for corridors, span checking, and orientation pressure; can become repetitive lane logic if overused.
- `L`: good for corner ownership and asymmetry; too many similar corners make it muddy.
- `T`: good for center control and branching decisions; overuse weakens silhouette confidence.
- `Square`: good for stable mass and early visual anchors; can become dead weight if it always has an obvious slot.
- `Z / S`: good for offset tension and anti-grid thinking; raise visual complexity quickly, so introduce carefully.
- `1x1`: use only rarely, intentionally, and late. It should never be routine cleanup.

## Critique Rubric

When critiquing a level, check these first:

- Is there one dominant idea?
- Can the level's main idea be stated in one sentence?
- Is the board readable at a glance?
- Does the key piece or key relationship matter clearly?
- Do wrong early moves fail quickly enough?
- If rotation matters, is it meaningful rather than fussy?
- Is the brute-force surface low?
- Are misleading options controlled rather than noisy?
- Is every board feature doing useful work?
- Is there accidental ambiguity or an unwanted second solution?

If several answers are weak or uncertain, the level needs revision.

## Output Format

When asked to generate a level, use this format:

```md
Name:

World Goal:

Intent:

Board:
[
  [...],
  [...],
]

PieceIds:
- ...

Primary Archetype:

Secondary Archetype:

Key Constraint:

Difficulty Rationale:

Risks / Notes:
```

Guidance:

- Use `World Goal: standalone / no world specified` when no world context is given.
- Keep the board as a small 2D array.
- Keep `pieceIds` as runtime-friendly IDs.
- Explain the key constraint in plain language.
- Do not output a large batch unless explicitly requested.

When asked to critique a level, use this format:

```md
World Fit:

What Works:

What Is Unclear:

Failure Modes:

Recommended Revisions:
```

When asked to refine a level, preserve the intended teaching moment and explain what changed.

## Tone And Style

Write like a small product and design team talking to itself.

- Be practical, not academic.
- Be opinionated.
- Avoid fluff.
- Prefer short rules over long theory.
- Make judgments clearly.
- Focus on guidance people can actually use to make better levels tomorrow.

If a recommendation is weak, say it is weak. If a level idea is muddy, say it is muddy. The point of this skill is to improve puzzle quality, not to soften every conclusion.
