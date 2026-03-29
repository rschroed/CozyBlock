import { PIECE_IDS } from '../../pieces';

const lockTurn = {
  id: 'world-2-lock-turn',
  name: 'Lock Turn',
  board: [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 0, 1, 1, 0],
    [0, 0, 0, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4],
};

export default lockTurn;
