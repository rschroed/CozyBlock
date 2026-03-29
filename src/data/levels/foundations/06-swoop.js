import { PIECE_IDS } from '../../pieces';

const swoop = {
  id: 'foundations-swoop',
  name: 'Swoop',
  board: [
    [1, 1, 1, 1, 1],
    [0, 1, 1, 1, 1],
    [0, 0, 1, 1, 0],
    [1, 1, 1, 0, 0],
  ],
  pieceIds: [PIECE_IDS.T, PIECE_IDS.SQUARE, PIECE_IDS.LINE, PIECE_IDS.L],
};

export default swoop;
