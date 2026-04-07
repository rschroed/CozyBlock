import { PIECE_IDS } from '../../pieces';

const crookNeck = {
  id: 'world-5-crook-neck',
  name: 'Crook Neck',
  board: [
    [1, 1, 1, 1, 1],
    [0, 0, 0, 1, 1],
    [1, 0, 0, 0, 1],
    [1, 1, 1, 1, 1],
    [1, 1, 1, 1, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4, PIECE_IDS.LINE4],
};

export default crookNeck;
