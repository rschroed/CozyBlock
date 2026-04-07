import { PIECE_IDS } from '../../pieces';

const pocketLoop = {
  id: 'world-5-pocket-loop',
  name: 'Pocket Loop',
  board: [
    [0, 0, 0, 1, 0],
    [0, 0, 1, 1, 0],
    [1, 0, 0, 1, 0],
    [1, 0, 1, 1, 1],
    [1, 1, 1, 0, 1],
    [1, 1, 1, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4, PIECE_IDS.LINE4],
};

export default pocketLoop;
