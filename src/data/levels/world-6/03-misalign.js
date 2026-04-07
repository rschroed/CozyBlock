import { PIECE_IDS } from '../../pieces';

const misalign = {
  id: 'world-6-misalign',
  name: 'Misalign',
  board: [
    [1, 1, 1, 0, 1, 0],
    [1, 1, 1, 1, 1, 0],
    [1, 0, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1],
    [0, 0, 1, 1, 0, 1],
  ],
  pieceIds: [
    PIECE_IDS.SQUARE2,
    PIECE_IDS.LINE3,
    PIECE_IDS.L3,
    PIECE_IDS.T4,
    PIECE_IDS.LINE4,
    PIECE_IDS.Z4,
  ],
};

export default misalign;
