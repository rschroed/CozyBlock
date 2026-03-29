import { PIECE_IDS } from '../../pieces';

const hiddenStem = {
  id: 'world-2-hidden-stem',
  name: 'Hidden Stem',
  board: [
    [1, 1, 1, 1, 1],
    [1, 1, 0, 0, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 0, 1, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4],
};

export default hiddenStem;
