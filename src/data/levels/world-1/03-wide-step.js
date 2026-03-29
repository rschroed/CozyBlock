import { PIECE_IDS } from '../../pieces';

const wideStep = {
  id: 'world-1-wide-step',
  name: 'Wide Step',
  board: [
    [1, 1, 1, 0],
    [1, 1, 1, 1],
    [0, 1, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default wideStep;
