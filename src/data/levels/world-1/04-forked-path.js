import { PIECE_IDS } from '../../pieces';

const forkedPath = {
  id: 'world-1-forked-path',
  name: 'Forked Path',
  board: [
    [1, 1, 1, 0],
    [1, 0, 1, 1],
    [1, 1, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default forkedPath;
