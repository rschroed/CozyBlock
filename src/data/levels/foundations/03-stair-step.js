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
  pieceIds: [PIECE_IDS.T, PIECE_IDS.SQUARE, PIECE_IDS.LINE, PIECE_IDS.L],
};

export default stairStep;
