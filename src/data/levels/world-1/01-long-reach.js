import { PIECE_IDS } from '../../pieces';

const longReach = {
  id: 'world-1-long-reach',
  name: 'Long Reach',
  board: [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [0, 0, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default longReach;
