import { LEVEL_ACCESS } from '../access';
import denseCrossing from './04-dense-crossing';
import doubleSweep from './03-double-sweep';
import finalEcho from './08-final-echo';
import foldedCrowd from './06-folded-crowd';
import mirrorSignal from './01-mirror-signal';
import nearFull from './07-near-full';
import packedTurn from './02-packed-turn';
import tripleBend from './05-triple-bend';

const world8Levels = [
  mirrorSignal,
  packedTurn,
  doubleSweep,
  denseCrossing,
  tripleBend,
  foldedCrowd,
  nearFull,
  finalEcho,
];

export const WORLD_8_SET = {
  id: 'world-8',
  name: 'World 8',
  access: LEVEL_ACCESS.PREMIUM,
  levels: world8Levels,
};

export default WORLD_8_SET;
