import { describe, expect, it } from 'vitest';
import { createLevelPieceInstances, LEVELS, LEVEL_SETS } from './index';
import { PIECE_IDS, PIECE_LIBRARY } from '../pieces';
import { canPlacePiece, placePiece, rotateShape } from '../../utils/grid';

function countPlayableCells(board) {
  return board.flat().filter((cell) => cell === 1).length;
}

function countPieceArea(pieceId) {
  const piece = PIECE_LIBRARY[pieceId];
  return piece.shape.flat().filter(Boolean).length;
}

function getLevelWorldId(level) {
  return level.id.split('-').slice(0, 2).join('-');
}

function getDistinctRotations(shape) {
  const rotations = [];
  const seen = new Set();

  for (let rotation = 0; rotation < 4; rotation += 1) {
    const rotatedShape = rotateShape(shape, rotation);
    const key = JSON.stringify(rotatedShape);

    if (seen.has(key)) {
      continue;
    }

    seen.add(key);
    rotations.push(rotation);
  }

  return rotations;
}

function solveLevel(level) {
  const pieces = createLevelPieceInstances(level);
  const solutions = [];
  const rowCount = level.board.length;
  const columnCount = Math.max(...level.board.map((row) => row.length));

  function search(index, placedPieces) {
    if (index === pieces.length) {
      solutions.push(placedPieces);
      return;
    }

    const piece = pieces[index];
    const rotations = getDistinctRotations(piece.shape);

    rotations.forEach((rotation) => {
      const rotatedShape = rotateShape(piece.shape, rotation);
      const shapeHeight = rotatedShape.length;
      const shapeWidth = rotatedShape[0].length;

      for (let y = 0; y <= rowCount - shapeHeight; y += 1) {
        for (let x = 0; x <= columnCount - shapeWidth; x += 1) {
          if (!canPlacePiece(level.board, pieces, placedPieces, piece, x, y, rotation)) {
            continue;
          }

          search(index + 1, placePiece(placedPieces, piece.id, x, y, rotation));
        }
      }
    });
  }

  search(0, {});
  return solutions;
}

describe('level content validation', () => {
  describe('set structure', () => {
    it('defines sets with ids, names, and non-empty level arrays', () => {
      expect(LEVEL_SETS.length).toBeGreaterThan(0);

      LEVEL_SETS.forEach((set) => {
        expect(typeof set.id).toBe('string');
        expect(set.id.length).toBeGreaterThan(0);
        expect(typeof set.name).toBe('string');
        expect(set.name.length).toBeGreaterThan(0);
        expect(Array.isArray(set.levels)).toBe(true);
        expect(set.levels.length).toBeGreaterThan(0);
      });
    });

    it('uses unique set ids', () => {
      const setIds = LEVEL_SETS.map((set) => set.id);
      expect(new Set(setIds).size).toBe(setIds.length);
    });
  });

  describe('level structure', () => {
    it('defines levels with ids, names, boards, and pieceIds', () => {
      expect(LEVELS.length).toBeGreaterThan(0);

      LEVELS.forEach((level) => {
        expect(typeof level.id).toBe('string');
        expect(level.id.length).toBeGreaterThan(0);
        expect(typeof level.name).toBe('string');
        expect(level.name.length).toBeGreaterThan(0);
        expect(Array.isArray(level.board)).toBe(true);
        expect(level.board.length).toBeGreaterThan(0);
        expect(Array.isArray(level.pieceIds)).toBe(true);
        expect(level.pieceIds.length).toBeGreaterThan(0);
      });
    });

    it('uses unique level ids across all sets', () => {
      const levelIds = LEVELS.map((level) => level.id);
      expect(new Set(levelIds).size).toBe(levelIds.length);
    });
  });

  describe('board shape', () => {
    it('uses board rows made of only 0 and 1 cells', () => {
      LEVELS.forEach((level) => {
        level.board.forEach((row) => {
          expect(Array.isArray(row)).toBe(true);
          row.forEach((cell) => {
            expect([0, 1]).toContain(cell);
          });
        });
      });
    });

    it('gives every board at least one playable cell', () => {
      LEVELS.forEach((level) => {
        expect(countPlayableCells(level.board)).toBeGreaterThan(0);
      });
    });
  });

  describe('piece references', () => {
    it('only references pieces that exist in the canonical piece library', () => {
      LEVELS.forEach((level) => {
        level.pieceIds.forEach((pieceId) => {
          expect(PIECE_LIBRARY[pieceId]).toBeDefined();
        });
      });
    });
  });

  describe('area parity', () => {
    it('matches playable board area to total referenced piece area for every level', () => {
      LEVELS.forEach((level) => {
        const boardArea = countPlayableCells(level.board);
        const pieceArea = level.pieceIds.reduce((total, pieceId) => total + countPieceArea(pieceId), 0);

        expect(boardArea).toBe(pieceArea);
      });
    });
  });

  describe('world pacing rules', () => {
    it('ships the expected world counts for the first content wave', () => {
      expect(LEVEL_SETS.map((set) => [set.id, set.levels.length])).toEqual([
        ['world-0', 1],
        ['world-1', 8],
        ['world-2', 8],
      ]);
    });

    it('keeps world 1 limited to shape variety without requiring rotation', () => {
      const allowedPieces = [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3];
      const world1Levels = LEVELS.filter((level) => getLevelWorldId(level) === 'world-1');

      world1Levels.forEach((level) => {
        expect(level.pieceIds).toEqual(allowedPieces);

        const solutions = solveLevel(level);
        expect(solutions.length).toBeGreaterThan(0);

        const hasNoRotationSolution = solutions.some((solution) =>
          Object.values(solution).every((placement) => placement.rotation === 0),
        );

        expect(hasNoRotationSolution).toBe(true);
      });
    });

    it('makes world 2 require a rotated t4 placement', () => {
      const allowedPieces = [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4];
      const world2Levels = LEVELS.filter((level) => getLevelWorldId(level) === 'world-2');

      world2Levels.forEach((level) => {
        expect(level.pieceIds).toEqual(allowedPieces);

        const solutions = solveLevel(level);
        expect(solutions.length).toBeGreaterThan(0);

        const allSolutionsRotateT4 = solutions.every((solution) => {
          const t4Entry = Object.entries(solution).find(([pieceId]) => pieceId.startsWith(`${PIECE_IDS.T4}:`));
          return t4Entry?.[1].rotation !== 0;
        });

        expect(allSolutionsRotateT4).toBe(true);
      });
    });
  });
});
