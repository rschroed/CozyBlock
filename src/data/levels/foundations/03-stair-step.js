import { PIECE_IDS } from '../../pieces';

const stairStep = {
  id: 'foundations-stair-step',
  name: 'Stair Step',
  board: [
    [0, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 1, 0],
  ],
  pieceIds: [PIECE_IDS.T4, PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default stairStep;
