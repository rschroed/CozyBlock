import { PIECE_IDS } from '../../pieces';

const longLadder = {
  id: 'world-3-long-ladder',
  name: 'Long Ladder',
  board: [
    [0, 0, 1],
    [0, 1, 1],
    [1, 1, 1],
    [1, 0, 1],
    [1, 1, 1],
    [1, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4],
};

export default longLadder;
