import { PIECE_IDS } from '../../pieces';

const narrowFake = {
  id: 'world-7-narrow-fake',
  name: 'Narrow Fake',
  board: [
    [1, 1, 1, 1, 0],
    [0, 1, 0, 0, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 1, 1, 0],
    [0, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [1, 0, 1, 1, 1],
  ],
  pieceIds: [
    PIECE_IDS.SQUARE2,
    PIECE_IDS.LINE3,
    PIECE_IDS.L3,
    PIECE_IDS.T4,
    PIECE_IDS.LINE4,
    PIECE_IDS.Z4,
  ],
};

export default narrowFake;
