import firstBlock from './01-first-block';
import twinRooms from './02-twin-rooms';
import tripleRooms from './03-triple-rooms';
import fourCorners from './04-four-corners';

const world0Levels = [firstBlock, twinRooms, tripleRooms, fourCorners];

export const WORLD_0_SET = {
  id: 'world-0',
  name: 'World 0',
  levels: world0Levels,
};

export default WORLD_0_SET;
