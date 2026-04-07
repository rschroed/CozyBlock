import { PIECE_IDS } from '../../pieces';

const narrowReach = {
  id: 'world-3-narrow-reach',
  name: 'Narrow Reach',
  board: [
    [0, 1, 1, 1],
    [0, 1, 1, 1],
    [0, 1, 0, 1],
    [0, 1, 1, 1],
    [1, 1, 1, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4],
};

export default narrowReach;
