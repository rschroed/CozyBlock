export const PIECE_IDS = {
  T: 't-piece',
  SQUARE: 'square-piece',
  LINE: 'line-piece',
  L: 'l-piece',
};

export const PIECE_LIBRARY = {
  [PIECE_IDS.T]: {
    id: PIECE_IDS.T,
    name: 'T Piece',
    color: '#5b8def',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  [PIECE_IDS.SQUARE]: {
    id: PIECE_IDS.SQUARE,
    name: 'Square',
    color: '#64b56a',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  [PIECE_IDS.LINE]: {
    id: PIECE_IDS.LINE,
    name: 'Line',
    color: '#f0a452',
    shape: [[1, 1, 1]],
  },
  [PIECE_IDS.L]: {
    id: PIECE_IDS.L,
    name: 'L Piece',
    color: '#dc6d4b',
    shape: [
      [1, 0],
      [1, 1],
    ],
  },
};

export const PIECES = [
  PIECE_LIBRARY[PIECE_IDS.T],
  PIECE_LIBRARY[PIECE_IDS.SQUARE],
  PIECE_LIBRARY[PIECE_IDS.LINE],
  PIECE_LIBRARY[PIECE_IDS.L],
];
