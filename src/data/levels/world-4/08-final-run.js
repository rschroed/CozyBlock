import { PIECE_IDS } from '../../pieces';

const finalRun = {
  id: 'world-4-final-run',
  name: 'Final Run',
  board: [
    [1, 1, 1, 1, 1],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 1, 0],
    [1, 1, 1, 1, 0],
    [1, 1, 0, 0, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4, PIECE_IDS.LINE4],
};

export default finalRun;
