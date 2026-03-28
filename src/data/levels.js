export const PIECES = [
  {
    id: 't-piece',
    name: 'T Piece',
    color: '#5b8def',
    shape: [
      [1, 1, 1],
      [0, 1, 0],
    ],
  },
  {
    id: 'square-piece',
    name: 'Square',
    color: '#64b56a',
    shape: [
      [1, 1],
      [1, 1],
    ],
  },
  {
    id: 'line-piece',
    name: 'Line',
    color: '#f0a452',
    shape: [[1, 1, 1]],
  },
  {
    id: 'l-piece',
    name: 'L Piece',
    color: '#dc6d4b',
    shape: [
      [1, 0],
      [1, 1],
    ],
  },
];

export const LEVELS = [
  {
    id: 'crossroads',
    name: 'Crossroads',
    board: [
      [0, 1, 1, 1, 0],
      [1, 1, 1, 1, 1],
      [1, 1, 0, 0, 1],
      [0, 1, 1, 1, 0],
    ],
  },
  {
    id: 'columns',
    name: 'Columns',
    board: [
      [1, 1, 1, 0],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 0],
    ],
  },
  {
    id: 'stair-step',
    name: 'Stair Step',
    board: [
      [0, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 1, 1, 0],
    ],
  },
  {
    id: 'double-notch',
    name: 'Double Notch',
    board: [
      [1, 1, 1, 1],
      [1, 1, 1, 1],
      [1, 0, 1, 1],
      [1, 0, 1, 1],
    ],
  },
  {
    id: 'crag',
    name: 'Crag',
    board: [
      [1, 1, 1, 1, 1],
      [1, 1, 0, 1, 1],
      [1, 1, 0, 0, 0],
      [1, 1, 1, 0, 0],
    ],
  },
  {
    id: 'swoop',
    name: 'Swoop',
    board: [
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 0, 1, 1, 0],
      [1, 1, 1, 0, 0],
    ],
  },
  {
    id: 'bridge',
    name: 'Bridge',
    board: [
      [1, 1, 1, 1, 1],
      [0, 1, 0, 1, 1],
      [0, 0, 0, 1, 0],
      [1, 1, 1, 1, 1],
    ],
  },
  {
    id: 'switchback',
    name: 'Switchback',
    board: [
      [1, 1, 1, 1, 1],
      [0, 1, 1, 1, 1],
      [0, 1, 1, 0, 0],
      [1, 1, 1, 0, 0],
    ],
  },
];
