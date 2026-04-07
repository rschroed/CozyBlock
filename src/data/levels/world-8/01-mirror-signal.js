import { PIECE_IDS } from '../../pieces';

const mirrorSignal = {
  id: 'world-8-mirror-signal',
  name: 'Mirror Signal',
  board: [
    [0, 1, 1, 1, 1, 1, 1],
    [1, 1, 0, 1, 1, 1, 0],
    [1, 1, 1, 1, 1, 1, 1],
    [0, 0, 1, 1, 0, 1, 1],
    [0, 0, 0, 1, 1, 1, 1],
  ],
  pieceIds: [
    PIECE_IDS.SQUARE2,
    PIECE_IDS.LINE3,
    PIECE_IDS.L3,
    PIECE_IDS.T4,
    PIECE_IDS.LINE4,
    PIECE_IDS.Z4,
    PIECE_IDS.S4,
  ],
};

export default mirrorSignal;
