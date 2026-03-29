import { describe, expect, it } from 'vitest';
import { LEVELS, LEVEL_SETS } from './index';
import { PIECE_LIBRARY } from '../pieces';

function countPlayableCells(board) {
  return board.flat().filter((cell) => cell === 1).length;
}

function countPieceArea(pieceId) {
  const piece = PIECE_LIBRARY[pieceId];
  return piece.shape.flat().filter(Boolean).length;
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

    it('does not repeat piece ids within a level', () => {
      LEVELS.forEach((level) => {
        expect(new Set(level.pieceIds).size).toBe(level.pieceIds.length);
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
});
