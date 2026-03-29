import { PIECE_IDS } from '../../pieces';

const crossroads = {
  id: 'foundations-crossroads',
  name: 'Crossroads',
  board: [
    [0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 1],
    [0, 1, 1, 1, 0],
  ],
  pieceIds: [PIECE_IDS.T4, PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default crossroads;
