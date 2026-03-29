import { PIECE_IDS } from '../../pieces';

const bridge = {
  id: 'foundations-bridge',
  name: 'Bridge',
  board: [
    [1, 1, 1, 1, 1],
    [0, 1, 0, 1, 1],
    [0, 0, 0, 1, 0],
    [1, 1, 1, 1, 1],
  ],
  pieceIds: [PIECE_IDS.T4, PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default bridge;
