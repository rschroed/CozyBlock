import { PIECE_IDS } from '../../pieces';

const twinRooms = {
  id: 'world-0-twin-rooms',
  name: 'Twin Rooms',
  board: [
    [1, 1, 0, 1, 1],
    [1, 1, 0, 1, 1],
  ],
  pieceIds: [PIECE_IDS.SQUARE2, PIECE_IDS.SQUARE2],
};

export default twinRooms;
