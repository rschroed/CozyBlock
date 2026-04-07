import { LEVEL_ACCESS } from '../access';
import elbowCrowd from './08-elbow-crowd';
import misalign from './03-misalign';
import offsetEntry from './01-offset-entry';
import offsetStack from './04-offset-stack';
import shiftedBlock from './02-shifted-block';
import sideSlip from './06-side-slip';
import tightShift from './07-tight-shift';
import zigPocket from './05-zig-pocket';

const world6Levels = [
  offsetEntry,
  shiftedBlock,
  misalign,
  offsetStack,
  zigPocket,
  sideSlip,
  tightShift,
  elbowCrowd,
];

export const WORLD_6_SET = {
  id: 'world-6',
  name: 'World 6',
  access: LEVEL_ACCESS.PREMIUM,
  levels: world6Levels,
};

export default WORLD_6_SET;
