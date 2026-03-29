import { PIECE_IDS } from '../../pieces';

const farCorner = {
  id: 'world-1-far-corner',
  name: 'Far Corner',
  board: [
    [0, 0, 1, 1],
    [0, 0, 1, 1],
    [1, 1, 1, 1],
    [1, 1, 0, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default farCorner;
