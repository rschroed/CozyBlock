import { PIECE_IDS } from '../../pieces';

const hookTurn = {
  id: 'world-1-hook-turn',
  name: 'Hook Turn',
  board: [
    [1, 1, 1, 0],
    [1, 1, 1, 0],
    [1, 1, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3],
};

export default hookTurn;
