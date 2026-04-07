import { LEVEL_ACCESS } from '../access';
import bendAhead from './04-bend-ahead';
import crossDraft from './07-cross-draft';
import farPocket from './08-far-pocket';
import longLadder from './05-long-ladder';
import longPorch from './01-long-porch';
import narrowReach from './06-narrow-reach';
import openStep from './03-open-step';
import tallStack from './02-tall-stack';

const world3Levels = [
  longPorch,
  tallStack,
  openStep,
  bendAhead,
  longLadder,
  narrowReach,
  crossDraft,
  farPocket,
];

export const WORLD_3_SET = {
  id: 'world-3',
  name: 'World 3',
  access: LEVEL_ACCESS.PREMIUM,
  levels: world3Levels,
};

export default WORLD_3_SET;
