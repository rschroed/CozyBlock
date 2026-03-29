import { PIECE_IDS } from '../../pieces';

const splitSpan = {
  id: 'world-1-split-span',
  name: 'Split Span',
  board: [
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [0, 1, 1, 1, 1],
    [0, 1, 1, 0, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default splitSpan;
