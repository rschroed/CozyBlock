import { PIECE_IDS } from '../../pieces';

const frayedEdge = {
  id: 'world-5-frayed-edge',
  name: 'Frayed Edge',
  board: [
    [1, 1, 1, 1, 0],
    [1, 0, 0, 1, 1],
    [1, 1, 1, 1, 1],
    [1, 0, 1, 0, 1],
    [0, 0, 1, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.LINE3, PIECE_IDS.L3, PIECE_IDS.T4, PIECE_IDS.LINE4],
};

export default frayedEdge;
