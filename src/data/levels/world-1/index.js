import { LEVEL_ACCESS } from '../access';
import centerPost from './05-center-post';
import farCorner from './06-far-corner';
import forkedPath from './04-forked-path';
import hookTurn from './02-hook-turn';
import longReach from './01-long-reach';
import lowBridge from './07-low-bridge';
import splitSpan from './08-split-span';
import wideStep from './03-wide-step';

const world1Levels = [
  longReach,
  hookTurn,
  wideStep,
  forkedPath,
  centerPost,
  farCorner,
  lowBridge,
  splitSpan,
];

export const WORLD_1_SET = {
  id: 'world-1',
  name: 'World 1',
  access: LEVEL_ACCESS.FREE,
  levels: world1Levels,
};

export default WORLD_1_SET;
