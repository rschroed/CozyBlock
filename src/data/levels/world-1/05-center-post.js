import { PIECE_IDS } from '../../pieces';

const centerPost = {
  id: 'world-1-center-post',
  name: 'Center Post',
  board: [
    [1, 1, 0, 0, 0],
    [1, 1, 1, 1, 1],
    [0, 0, 1, 0, 0],
    [0, 0, 1, 1, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default centerPost;
