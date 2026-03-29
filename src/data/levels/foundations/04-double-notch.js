import { PIECE_IDS } from '../../pieces';

const doubleNotch = {
  id: 'foundations-double-notch',
  name: 'Double Notch',
  board: [
    [1, 1, 1, 1],
    [1, 1, 1, 1],
    [1, 0, 1, 1],
    [1, 0, 1, 1],
  ],
  pieceIds: [PIECE_IDS.T4, PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default doubleNotch;
