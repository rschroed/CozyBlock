import { PIECE_IDS } from '../../pieces';

const fourCorners = {
  id: 'world-0-four-corners',
  name: 'Four Corners',
  board: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.SQUARE2, PIECE_IDS.SQUARE2, PIECE_IDS.SQUARE2],
};

export default fourCorners;
