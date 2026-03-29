# CozyBlock World Design Strategy

## Overview

This document defines CozyBlock's progression model at the world level.

Worlds are the main unit of learning and pacing. They shape how ideas are introduced, reinforced, and escalated across multiple puzzles using a small set of core levers:
- pieces
- board shape
- board size
- density and constraints

The goal is to create a smooth, intentional learning curve across 100+ handcrafted puzzles without introducing unnecessary complexity or randomness.

For individual level construction, see `level-design-system.md`.

---

## World Philosophy

Worlds are defined by learning, not content.

A world is not just a set of pieces, a board size, or a visual theme. A world is a teaching unit: a contained shift in how the player thinks about space.

Pieces, board shape, size, and constraints are tools used to express that shift. They matter because of the kind of reasoning they create, not because they are new on their own.

---

## How to Use This Document

This document defines the intended progression of world ideas, not a strict implementation plan.

- Worlds are defined by a primary learning goal, not just pieces or size.
- Not every world must introduce a new piece.
- Board shape, density, and constraints are equally important levers.
- The table should evolve based on playtesting.

When designing worlds:
- Start with the world's core learning goal.
- Use pieces, board shape, size, and constraints to express that goal across several levels.
- Let the world structure control pacing so introduction, reinforcement, and challenge feel intentional.
- Avoid making one world carry too many new concepts at once.

---

## World Types

### Piece-First Worlds

These worlds introduce a new piece and build the world's learning arc around how that piece changes spatial reasoning.

### Board-First Worlds

These worlds introduce new spatial structures through board shape, layout, or scale rather than through a new piece.

### Constraint-First Worlds

These worlds increase difficulty through tighter packing, sequencing, density, or ambiguity without introducing new pieces.

Not every world should introduce a new piece.

---

## World Design Rules

- Each world introduces one primary new idea.
- New pieces are introduced in isolation, then reinforced.
- Avoid combining multiple new mechanics in the same world.
- Worlds typically introduce ideas either immediately or mid-world to create clear pacing.
- Each world should feel cohesive, not like a grab bag of puzzles.

---

## World Experience Goals

Each world should feel:

- cohesive, not like a random collection of levels
- distinct from previous worlds
- progressively more demanding, but not confusing
- understandable without explicit instruction

---

## World Structure

Each world should contain approximately 8-10 levels:

1-2: Introduction (very easy, obvious)  
3-5: Reinforcement  
6-7: Twist or variation  
8-10: Challenge / synthesis

This structure is a guideline, not a strict requirement.

---

## Piece Introduction Rules

- Introduce at most one new piece type per world.
- New pieces should appear in simple, readable contexts first.
- Avoid mixing newly introduced pieces with other new mechanics.
- Once introduced, pieces can be reused in later worlds in new contexts.

---

## World Progression (Learning Arc Model)

| World | Learning Goal / Primary Lever | New Element | Active Pieces | Board / Size | How It Unfolds | What's Doing the Work |
| --- | --- | --- | --- | --- | --- | --- |
| 0 | What is this game? | - | square2 | very small, rectangular | immediate | pure placement, zero ambiguity |
| 1 | Shapes fit differently | line3, l3 | square2, line3, l3 | small, simple | immediate | piece variety, obvious fits |
| 2 | Orientation matters | t4 | + t4 | small, slightly irregular | immediate | rotation as a constraint |
| 3 | Space can stretch | - | same | small -> medium | mid-world size increase | board size introduces planning |
| 4 | Pieces have direction | line4 | + line4 | medium, wider boards | immediate | long spans, placement commitment |
| 5 | Edges shape decisions | - | same | medium, irregular edges | mid-world twist | board geometry drives solutions |
| 6 | Not everything aligns | z4 | + z4 | medium, small gaps | immediate | offset thinking introduced |
| 7 | Familiar things become tricky | - | same | medium, tighter boards | mid-world constraint shift | ambiguity, decoy placements |
| 8 | Multiple truths exist | s4 | + s4 | medium, dense layouts | immediate | mirrored ambiguity, choice pressure |
| 9 | Space gets crowded | - | same | medium, compact | immediate | density, limited options |
| 10 | Some pieces dominate | p5 | + p5 | medium | immediate | large pieces shape the board |
| 11 | Build around a center | cross5 | + cross5 | medium, central layouts | immediate | anchor-based solving |
| 12 | You must think ahead | - | same | medium -> large | mid-world escalation | sequencing, fail-late puzzles |
| 13 | Length creates commitment | longL5 | + longL5 | large, corridors | immediate | long dependencies |
| 14 | Space isn't always solid | u5 | + u5 | large, holes/pockets | immediate | negative space reasoning |
| 15 | Break the rules (optional) | single1 | + single1 (limited) | varied | immediate | final-move logic, cleanup |

---

## Flexibility

This progression is a guide, not a fixed plan.

Worlds may be adjusted, reordered, combined, or expanded based on playtesting. The goal is a smooth, intuitive learning curve, not strict adherence to the table.

Detailed puzzle-quality checks and individual level construction belong in `level-design-system.md`.

---

## Completion Criteria

The progression is successful when:

- Each world introduces a clearly distinct way of thinking.
- Difficulty increases without relying on randomness or frustration.
- Earlier pieces feel different in later world contexts.
- Players can intuitively understand new ideas without heavy instruction.
