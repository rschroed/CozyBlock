export const PIECE_IDS = {
  SQUARE2: 'square2',
  LINE3: 'line3',
  LINE4: 'line4',
  L3: 'l3',
  L4: 'l4',
  T4: 't4',
  Z4: 'z4',
  S4: 's4',
  P5: 'p5',
  CROSS5: 'cross5',
  LONG_L5: 'longL5',
  U5: 'u5',
};

export const PIECE_LIBRARY = {
  [PIECE_IDS.SQUARE2]: {
    id: PIECE_IDS.SQUARE2,
    name: 'Square (2x2)',
    color: '#64b56a',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  [PIECE_IDS.LINE3]: {
    id: PIECE_IDS.LINE3,
    name: 'Line (3)',
    color: '#f0a452',
    shape: [[1, 1, 1]],
  },
  [PIECE_IDS.LINE4]: {
    id: PIECE_IDS.LINE4,
    name: 'Line (4)',
    color: '#d79a2b',
    shape: [[1, 1, 1, 1]],
  },
  [PIECE_IDS.L3]: {
    id: PIECE_IDS.L3,
    name: 'L (3)',
    color: '#dc6d4b',
    shape: [
      [1, 0],
      [1, 1],
    ],
  },
  [PIECE_IDS.L4]: {
    id: PIECE_IDS.L4,
    name: 'L (4)',
    color: '#c75a41',
    shape: [
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  [PIECE_IDS.T4]: {
    id: PIECE_IDS.T4,
    name: 'T (4)',
    color: '#5b8def',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  [PIECE_IDS.Z4]: {
    id: PIECE_IDS.Z4,
    name: 'Z (4)',
    color: '#b368c9',
    shape: [
      [1, 1, 0],
      [0, 1, 1],
    ],
  },
  [PIECE_IDS.S4]: {
    id: PIECE_IDS.S4,
    name: 'S (4)',
    color: '#4db5a7',
    shape: [
      [0, 1, 1],
      [1, 1, 0],
    ],
  },
  [PIECE_IDS.P5]: {
    id: PIECE_IDS.P5,
    name: 'P (5)',
    color: '#d66f9b',
    shape: [
      [1, 1],
      [1, 1],
      [1, 0],
    ],
  },
  [PIECE_IDS.CROSS5]: {
    id: PIECE_IDS.CROSS5,
    name: 'Cross (5)',
    color: '#7486d9',
    shape: [
      [0, 1, 0],
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  [PIECE_IDS.LONG_L5]: {
    id: PIECE_IDS.LONG_L5,
    name: 'Long L (5)',
    color: '#cc7a3b',
    shape: [
      [1, 0],
      [1, 0],
      [1, 0],
      [1, 1],
    ],
  },
  [PIECE_IDS.U5]: {
    id: PIECE_IDS.U5,
    name: 'U (5)',
    color: '#6f97b5',
    shape: [
      [1, 0, 1],
      [1, 1, 1],
    ],
  },
};

export const PIECES = [
  PIECE_LIBRARY[PIECE_IDS.SQUARE2],
  PIECE_LIBRARY[PIECE_IDS.LINE3],
  PIECE_LIBRARY[PIECE_IDS.LINE4],
  PIECE_LIBRARY[PIECE_IDS.L3],
  PIECE_LIBRARY[PIECE_IDS.L4],
  PIECE_LIBRARY[PIECE_IDS.T4],
  PIECE_LIBRARY[PIECE_IDS.Z4],
  PIECE_LIBRARY[PIECE_IDS.S4],
  PIECE_LIBRARY[PIECE_IDS.P5],
  PIECE_LIBRARY[PIECE_IDS.CROSS5],
  PIECE_LIBRARY[PIECE_IDS.LONG_L5],
  PIECE_LIBRARY[PIECE_IDS.U5],
];
