import { PIECE_IDS } from '../../pieces';

const crosswind = {
  id: 'world-2-crosswind',
  name: 'Crosswind',
  board: [
    [1, 1, 1, 1, 1],
    [1, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
    [0, 1, 1, 0, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4],
};

export default crosswind;
