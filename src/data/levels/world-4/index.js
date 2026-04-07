import { LEVEL_ACCESS } from '../access';
import finalRun from './08-final-run';
import longChannel from './03-long-channel';
import reachAcross from './04-reach-across';
import spanLock from './06-span-lock';
import splitRail from './05-split-rail';
import straightaway from './01-straightaway';
import wideBend from './07-wide-bend';
import widePorch from './02-wide-porch';

const world4Levels = [
  straightaway,
  widePorch,
  longChannel,
  reachAcross,
  splitRail,
  spanLock,
  wideBend,
  finalRun,
];

export const WORLD_4_SET = {
  id: 'world-4',
  name: 'World 4',
  access: LEVEL_ACCESS.PREMIUM,
  levels: world4Levels,
};

export default WORLD_4_SET;
