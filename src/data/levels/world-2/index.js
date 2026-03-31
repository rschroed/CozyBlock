import { LEVEL_ACCESS } from '../access';
import bentRoute from './04-bent-route';
import cornerSpin from './05-corner-spin';
import crosswind from './07-crosswind';
import elbowRoom from './03-elbow-room';
import hiddenStem from './06-hidden-stem';
import lockTurn from './08-lock-turn';
import sideStreet from './02-side-street';
import turnSignal from './01-turn-signal';

const world2Levels = [
  turnSignal,
  sideStreet,
  elbowRoom,
  bentRoute,
  cornerSpin,
  hiddenStem,
  crosswind,
  lockTurn,
];

export const WORLD_2_SET = {
  id: 'world-2',
  name: 'World 2',
  access: LEVEL_ACCESS.PREMIUM,
  levels: world2Levels,
};

export default WORLD_2_SET;
