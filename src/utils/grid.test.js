import { describe, expect, it } from 'vitest';
import { PIECE_IDS, PIECES, PIECE_LIBRARY } from '../data/pieces';
import {
  buildOccupancyMap,
  canPlacePiece,
  getOccupiedCells,
  isBoardComplete,
  normalizeRotation,
  placePiece,
  removePiece,
  rotateShape,
} from './grid';

const T_PIECE = PIECE_LIBRARY[PIECE_IDS.T4];
const SQUARE_PIECE = PIECE_LIBRARY[PIECE_IDS.SQUARE2];
const LINE_PIECE = PIECE_LIBRARY[PIECE_IDS.LINE3];

describe('grid utilities', () => {
  describe('normalizeRotation', () => {
    it('normalizes negative rotations', () => {
      expect(normalizeRotation(-1)).toBe(3);
    });

    it('wraps rotations above three', () => {
      expect(normalizeRotation(5)).toBe(1);
    });
  });

  describe('rotateShape', () => {
    it('returns a known shape to its original layout after four rotations', () => {
      let rotated = T_PIECE.shape;

      for (let turn = 0; turn < 4; turn += 1) {
        rotated = rotateShape(rotated, 1);
      }

      expect(rotated).toEqual(T_PIECE.shape);
    });

    it('preserves occupied cell count across rotations', () => {
      const baseCount = getOccupiedCells(T_PIECE.shape).length;

      for (let rotation = 0; rotation < 4; rotation += 1) {
        expect(getOccupiedCells(rotateShape(T_PIECE.shape, rotation))).toHaveLength(baseCount);
      }
    });
  });

  describe('canPlacePiece', () => {
    it('rejects overlap with an already placed piece', () => {
      const board = [
        [1, 1, 1],
        [1, 1, 1],
        [1, 1, 1],
      ];
      const placedPieces = {
        [PIECE_IDS.SQUARE2]: { x: 0, y: 0, rotation: 0 },
      };

      expect(canPlacePiece(board, PIECES, placedPieces, T_PIECE, 0, 0)).toBe(false);
    });

    it('rejects placements that extend off the board', () => {
      const board = [
        [1, 1, 1],
        [1, 1, 1],
      ];

      expect(canPlacePiece(board, PIECES, {}, LINE_PIECE, 1, 0)).toBe(false);
    });

    it('rejects placements on blocked board cells', () => {
      const board = [
        [1, 1, 1],
        [1, 0, 1],
        [1, 1, 1],
      ];

      expect(canPlacePiece(board, PIECES, {}, T_PIECE, 0, 0)).toBe(false);
    });

    it('allows a valid placement in a legal region', () => {
      const board = [
        [1, 1],
        [1, 1],
      ];

      expect(canPlacePiece(board, PIECES, {}, SQUARE_PIECE, 0, 0)).toBe(true);
    });
  });

  describe('placePiece and removePiece', () => {
    it('stores normalized rotation when placing a piece', () => {
      expect(placePiece({}, PIECE_IDS.T4, 1, 2, -1)).toEqual({
        [PIECE_IDS.T4]: { x: 1, y: 2, rotation: 3 },
      });
    });

    it('removes only the targeted piece', () => {
      const placedPieces = {
        [PIECE_IDS.T4]: { x: 0, y: 0, rotation: 0 },
        [PIECE_IDS.SQUARE2]: { x: 1, y: 1, rotation: 0 },
      };

      expect(removePiece(placedPieces, PIECE_IDS.T4)).toEqual({
        [PIECE_IDS.SQUARE2]: { x: 1, y: 1, rotation: 0 },
      });
    });
  });

  describe('isBoardComplete', () => {
    it('returns false for a partially filled board', () => {
      const board = [
        [1, 1, 1],
        [1, 1, 1],
      ];
      const placedPieces = {
        [PIECE_IDS.SQUARE2]: { x: 0, y: 0, rotation: 0 },
      };
      const occupancyMap = buildOccupancyMap(board, PIECES, placedPieces);

      expect(isBoardComplete(board, occupancyMap)).toBe(false);
    });

    it('returns true only when every playable board cell is occupied', () => {
      const board = [
        [1, 1],
        [1, 1],
      ];
      const placedPieces = {
        [PIECE_IDS.SQUARE2]: { x: 0, y: 0, rotation: 0 },
      };
      const occupancyMap = buildOccupancyMap(board, PIECES, placedPieces);

      expect(isBoardComplete(board, occupancyMap)).toBe(true);
    });
  });
});
