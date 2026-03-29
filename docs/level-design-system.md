# CozyBlock Level Design System

## Overview

This document defines how to construct and evaluate individual CozyBlock puzzles.

Use it alongside `world-design-strategy.md`:
- `world-design-strategy.md` defines progression, pacing, and learning goals across worlds
- this document defines the craft of building one level well

---

## Core Puzzle Structure

### Board Shape

Defines:
- available space
- edges and boundaries
- overall structure

### Piece Set

Defines:
- what is possible
- how pieces interact
- cognitive load

### Key Constraint

Defines:
- what makes the puzzle interesting
- what the player must discover

A good level has one dominant constraint.

---

## Puzzle Archetypes

Archetypes describe the pattern of challenge in a level.

They are reusable across worlds and should be mixed to create variety.

### Obvious Fit

- A piece clearly belongs in one place
- Used for onboarding and clarity

### Rotation Gate

- A piece only fits in one orientation
- Teaches rotation and precision

### Key Piece (Order Matters)

- A specific piece must be placed early
- Introduces sequencing and planning

### Deceptive Fit

- Multiple placements appear valid
- Only one leads to a full solution

### Tight Pack

- Little to no slack in the board
- Requires precision and full-board reasoning

### Anchor / Hub

- One central piece determines the layout
- Other pieces build around it

### Corridor / Flow

- Narrow or elongated spaces
- Requires long-piece reasoning

### Negative Space (Cavities)

- Internal holes or pockets
- Requires reasoning about empty space

---

## Level Design Workflow

Use this process when designing levels:

1. Start with the world's core idea.
2. Choose a primary archetype.
3. Define the key constraint.
4. Place the key piece or structure first.
5. Build the board around that constraint.
6. Select supporting pieces.
7. Test for solvability.
8. Try to break the level.
9. Simplify if necessary.

A level should feel intentional, not assembled.

---

## Difficulty Design

Difficulty should emerge naturally from the puzzle structure.

Key drivers of difficulty:

- number of valid placements
- need for rotation
- order dependency
- board complexity
- piece interaction
- density (tightness of fit)

### Easier Levels

- obvious placements
- few choices
- fast feedback

### Harder Levels

- multiple plausible moves
- delayed failure
- tighter constraints

Avoid artificial difficulty, such as large boards with no structure.

---

## Archetype Distribution

Within a world:

- Use 1 dominant archetype
- Support with 1-2 secondary archetypes
- Vary across levels to avoid repetition

Example distribution (8 levels):

- 3-4 dominant archetype
- 2-3 supporting archetypes
- 1-2 mixed or challenge levels

Archetypes should reinforce the world's core idea.

---

## Piece Usage Guidelines

- Limit the number of piece types per level
- Introduce new pieces in simple contexts first
- Avoid combining multiple new pieces at once
- Reuse familiar pieces in new contexts

Special-case pieces such as `single1` should:
- be used intentionally
- not act as general-purpose fixes
- appear in controlled scenarios only

---

## Common Failure Modes

Avoid levels that:

- are solvable by random placement
- have too many valid starting moves
- feel visually confusing
- have unclear failure states
- rely on "almost fits everywhere" frustration
- delay failure without feedback

If a level feels frustrating rather than challenging, it should be revised.

---

## Level Quality Checklist

Before finalizing a level, ask:

- Is there a clear central idea?
- Is the puzzle readable at a glance?
- Does it fail early when incorrect?
- Is there a meaningful "aha" moment?
- Are there too many valid starting moves?
- Does it feel fair?

If any answer is unclear, refine the level.

---

## Output Format (Optional)

When documenting or generating levels, use:

- `name`
- `intent`
- `board`
- `pieceIds`
- `primary archetype`
- `notes`

This helps maintain consistency across levels.

---

## Final Principle

Levels should feel:

- intentional
- readable
- fair
- satisfying

The goal is not to make puzzles harder.

The goal is to make puzzles clearer, tighter, and more meaningful.
