---
name: cozyblock-levels-designer
description: Use when generating, critiquing, or refining CozyBlock puzzle levels. This skill defines CozyBlock's level design philosophy, puzzle archetypes, workflow, quality rules, difficulty guidance, and output format so handcrafted levels stay intentional, readable, and satisfying instead of random or brute-force.
---

# CozyBlock Levels Designer

Use this when you need to design one CozyBlock level, critique an existing level, or refine a level without changing the game's mechanics.

## Use This When

Operate in one of these modes:

- `Generate`: design one level, or at most a very small candidate set, around a specific idea.
- `Critique`: evaluate a level or board concept against the rules in this document and call out concrete risks.
- `Refine`: improve an existing level while preserving its intended teaching moment.

Unless explicitly asked otherwise:

- Do not write code.
- Do not edit repo files.
- Do not design whole worlds or campaigns.
- Do not build generators, solvers, or editors.
- Do not dump large batches of levels.
- Keep examples small and illustrative.

## Core Philosophy

A good CozyBlock level has one dominant idea.

The player should be able to look at the board and feel that the shape means something. The puzzle should not read like a random silhouette that happens to equal the piece area. Every notch, corridor, bulge, and pocket should help create a specific reasoning moment.

The core principle is `aha over attrition`.

CozyBlock should feel thoughtful, not punishing. The best levels create a moment where the player understands why one piece belongs first, why a rotation matters, or why an apparently safe move collapses later. That insight should feel earned, but it should not require blind search.

Prefer early signal over late punishment.

Wrong ideas should reveal themselves quickly. The player should not spend a long time placing pieces correctly only to discover a tiny impossible gap at the end unless that failure is rare, deliberate, and justified by a strong idea. Cozy puzzle design means the board teaches through feedback, not through exhaustion.

Design for clarity, constraint, and intention.

- `Clarity`: the board should be readable at a glance.
- `Constraint`: there should be enough structure that choices matter.
- `Intention`: the solution should feel authored, not accidental.

Reject these by default:

- random dragging as a reliable solve path
- brute-force branch explosion
- ambiguity with no teaching value
- irregular board shapes that exist only to look different

## Puzzle Building Blocks

Use archetypes as tools, not as labels to pile up. Most good levels should be built around one primary archetype and at most one secondary support idea.

### Obvious Fit

Pattern:
A board feature strongly suggests where one piece belongs.

What it teaches:
How to read silhouette and match piece identity to board shape.

When to use it:
Early onboarding, introducing a new piece, or resetting player confidence after harder puzzles.

What to avoid:
Making the rest of the puzzle trivial. One obvious fit should open the puzzle, not solve the whole thing by itself.

Tiny example:
A two-by-two cavity that clearly belongs to the square, but placing it reveals the real sequencing decision.

### Rotation Gate

Pattern:
A piece only works in one orientation, or one orientation becomes correct only after another placement.

What it teaches:
Rotation is part of reasoning, not just cleanup.

When to use it:
When you want the player to notice orientation pressure without drowning them in many equivalent placements.

What to avoid:
Pure gotcha rotations where the right orientation is hidden by visual noise or only discovered through trial-and-error.

Tiny example:
A narrow three-cell lane that accepts the line only horizontally, while the rest of the board tempts a vertical use.

### Key Piece

Pattern:
One piece, or one piece relationship, must be resolved early because it governs the rest of the pack.

What it teaches:
Order matters.

When to use it:
As the main idea in medium and hard puzzles, or when transitioning from obvious-fit logic into sequencing logic.

What to avoid:
Making the key piece unreadable. The player should be able to infer why it matters after a little thought, not after exhausting every branch.

Tiny example:
The L owns the only viable corner; if it goes elsewhere, the board fractures into unusable pockets.

### Deceptive Fit

Pattern:
A piece appears to fit naturally in a prominent space, but that move quietly damages the rest of the puzzle.

What it teaches:
Local fit is not the same as global fit.

When to use it:
To create a controlled fake-out in medium and hard puzzles.

What to avoid:
Too many deceptive options at once. One strong fake is interesting; three or four makes the puzzle muddy and hostile.

Tiny example:
The T seems perfect for the center, but that placement strands a corridor that only the line can cover.

### Tight Pack

Pattern:
The board leaves little slack, so pieces interact tightly and minor mistakes cascade quickly.

What it teaches:
Efficiency, spatial discipline, and respect for piece boundaries.

When to use it:
Later in a difficulty curve, or when you want the entire board to feel interlocked.

What to avoid:
Ending with a dense blob that is hard to read from the start. Tight should mean crisp, not cluttered.

Tiny example:
A compact board where every outer bump or recess exists to force one clean packing relationship.

## Level Design Workflow

Use this loop every time:

1. Choose the intended moment.
   Write one sentence: "This level is about..."
2. Choose the teaching load and difficulty target.
   Decide whether the level should teach shape matching, rotation awareness, sequencing, or controlled deception.
3. Identify the key piece or key relationship.
   If you cannot point to the central piece, corner, corridor, or interaction, the level idea is still too vague.
4. Sketch the board around that constraint.
   Build the board to express the intended moment, not to maximize novelty.
5. Add the remaining pieces to support the idea.
   Every remaining space should reinforce the main read, not compete with it.
6. Test obvious alternatives.
   Look for tempting early placements and ask whether they fail quickly enough.
7. Test wrong-order play.
   If the level depends on order, confirm that bad order produces readable consequences.
8. Simplify until the level has one dominant read.
   Remove extra bumps, dead pockets, and misleading spaces that do not improve the puzzle.

Designers must be able to state the level's main idea in one sentence. If they cannot, the level is not ready.

## Constraints And Rules

These are hard rules unless a rare exception is clearly intentional:

- Board cell count must equal total piece area.
- Piece shapes must be edge-connected. No diagonal-only logic.
- No `1x1` filler in standard play.
- No accidental multi-solution ambiguity.
- No puzzle that is reliably solved by random placement.
- No excessive fail-late structure unless the late failure is the whole point and is still fair.
- No board irregularity without purpose. Every shape feature should serve the puzzle idea.

Practical enforcement rules:

- A level should not present many equally good first moves unless that ambiguity is intentional and still controlled.
- A level should not depend on the player testing many near-identical placements to learn anything.
- A level should not hide the intended logic under visual clutter.
- If multiple solutions exist, they should be explicitly desired because they preserve the same insight, not because the board is loose.

## Difficulty Design

Difficulty does not come from labels. It comes from how much meaningful reasoning the puzzle asks of the player.

The main difficulty levers are:

- number of viable placements
- need for rotation
- order dependency
- misleading but plausible options
- tightness of the pack

### Easy

Characteristics:

- few viable openings
- strong visual guidance
- one main read
- wrong ideas fail quickly
- minimal deception

Easy levels teach trust. They should make the player feel smart fast.

### Medium

Characteristics:

- some misleading options
- one or two meaningful order or rotation checks
- a clearer reveal in the middle of the solve
- the player needs to think globally at least once

Medium levels should ask the player to confirm a theory, not wander.

### Hard

Characteristics:

- tight sequencing
- controlled deception
- multiple locally plausible moves
- one readable logic thread underneath the surface
- small mistakes create understandable downstream pressure

Hard levels should still feel authored. They should not become search problems.

Do not manufacture difficulty through sheer branch count. If the puzzle becomes hard because the player must brute-force many similar choices, redesign it.

## Piece Usage Guidelines

Pieces shape thought. Use them intentionally.

### Line

Best for:

- corridors
- span checking
- orientation pressure
- making the player respect range

Risk:
If overused, it creates repetitive lane logic.

### L

Best for:

- corner ownership
- asymmetry
- forcing one decisive bend in the layout

Risk:
If the board has too many similar corners, the L creates muddy choice rather than smart choice.

### T

Best for:

- center control
- branching decisions
- shapes where one nub matters

Risk:
If every cavity feels "kind of T-like," the player loses confidence in silhouette reading.

### Square

Best for:

- stable mass
- calming visual anchors
- simple early reads that support harder surrounding decisions

Risk:
If the square always has an obvious slot and no strategic role, it becomes dead weight.

### Z / S

Best for:

- offset tension
- anti-grid intuition
- breaking overly neat packing habits

Risk:
These pieces raise visual and cognitive complexity quickly. Introduce them carefully and avoid pairing too many skewed reads in one early puzzle.

### 1x1

Use only rarely, intentionally, and late.

It should never be routine cleanup. A `1x1` lowers puzzle integrity because it forgives packing mistakes and weakens authored structure. Only use it in special-case content where that exception is itself part of the design language.

### General Usage Rules

- Introduce new piece types gradually.
- Limit how many distinct ideas a single level asks the player to track.
- Use fewer piece types when teaching.
- Add visual complexity only when it clearly pays off in puzzle quality.
- If a piece is present, it should have a job. Avoid passengers.

## Common Failure Modes

### Random-Placement Solvable

Why it is bad:
The player wins without learning anything. The level has no authored logic.

### Too Many Equivalent Openings

Why it is bad:
The early game becomes mushy, so the puzzle lacks direction and identity.

### Visual Noise Or Unreadable Silhouette

Why it is bad:
The player cannot form a clean theory from the board, so the puzzle feels arbitrary.

### Trial-And-Error Dependency

Why it is bad:
Progress comes from exhaustive testing rather than insight, which breaks the cozy tone.

### Almost-Fits-Everywhere Frustration

Why it is bad:
If many placements look nearly correct, the player burns energy on low-value distinctions and loses trust in the board.

### No Dominant Idea

Why it is bad:
The level becomes a loose bundle of shapes instead of a memorable puzzle.

### Late Collapse After Long Correct-Feeling Play

Why it is bad:
The player spends time building confidence only to discover an invisible mistake too late. This feels punishing unless used very sparingly and very fairly.

## Level Quality Checklist

Before accepting a level, answer these quickly:

- Is there one dominant idea?
- Can I state the level's main idea in one sentence?
- Is the board readable at a glance?
- Does the key piece or key relationship matter clearly?
- Do wrong early moves fail fast enough?
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

Intent:

Board:
[
  [...],
  [...],
]

PieceIds:
- ...

Key idea:

Difficulty rationale:
```

Guidance:

- Keep the board as a small 2D array.
- Keep `pieceIds` as runtime-friendly IDs.
- Explain the key idea in plain language.
- Do not output a large batch unless explicitly requested.

When asked to critique a level, use this format:

```md
What works:

What is unclear:

Failure modes:

Recommended revisions:
```

## Tone And Style

Write like a small product and design team talking to itself.

- Be practical, not academic.
- Be opinionated.
- Avoid fluff.
- Prefer short rules over long theory.
- Make judgments clearly.
- Focus on guidance people can actually use to make better levels tomorrow.

If a recommendation is weak, say it is weak. If a level idea is muddy, say it is muddy. The point of this skill is to improve puzzle quality, not to soften every conclusion.
