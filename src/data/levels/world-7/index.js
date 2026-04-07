import { LEVEL_ACCESS } from '../access';
import centerTrap from './07-center-trap';
import doubleBluff from './02-double-bluff';
import falseWall from './01-false-wall';
import finalFeint from './08-final-feint';
import leftDecoy from './05-left-decoy';
import narrowFake from './04-narrow-fake';
import splitChoice from './03-split-choice';
import tightRelay from './06-tight-relay';

const world7Levels = [
  falseWall,
  doubleBluff,
  splitChoice,
  narrowFake,
  leftDecoy,
  tightRelay,
  centerTrap,
  finalFeint,
];

export const WORLD_7_SET = {
  id: 'world-7',
  name: 'World 7',
  access: LEVEL_ACCESS.PREMIUM,
  levels: world7Levels,
};

export default WORLD_7_SET;
