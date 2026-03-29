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
  pieceIds: [PIECE_IDS.T, PIECE_IDS.SQUARE, PIECE_IDS.LINE, PIECE_IDS.L],
};

export default doubleNotch;
