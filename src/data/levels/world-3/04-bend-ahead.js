import { PIECE_IDS } from '../../pieces';

const bendAhead = {
  id: 'world-3-bend-ahead',
  name: 'Bend Ahead',
  board: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 0, 0],
    [1, 1, 1, 0, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4],
};

export default bendAhead;
