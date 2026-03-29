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
  pieceIds: [PIECE_IDS.T, PIECE_IDS.SQUARE, PIECE_IDS.LINE, PIECE_IDS.L],
};

export default bridge;
