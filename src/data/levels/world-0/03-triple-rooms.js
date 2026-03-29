import { PIECE_IDS } from '../../pieces';

const tripleRooms = {
  id: 'world-0-triple-rooms',
  name: 'Triple Rooms',
  board: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
    [0, 0, 0, 0, 0],
    [1, 1, 0, 0, 0],
    [1, 1, 0, 0, 0],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.SQUARE2, PIECE_IDS.SQUARE2],
};

export default tripleRooms;
