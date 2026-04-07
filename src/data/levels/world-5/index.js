import { LEVEL_ACCESS } from '../access';
import crookedFence from './06-crooked-fence';
import edgeNudge from './01-edge-nudge';
import frayedEdge from './04-frayed-edge';
import lateCorner from './08-late-corner';
import notchWalk from './02-notch-walk';
import pocketLoop from './07-pocket-loop';
import sideCut from './05-side-cut';
import crookNeck from './03-crook-neck';

const world5Levels = [
  edgeNudge,
  notchWalk,
  crookNeck,
  frayedEdge,
  sideCut,
  crookedFence,
  pocketLoop,
  lateCorner,
];

export const WORLD_5_SET = {
  id: 'world-5',
  name: 'World 5',
  access: LEVEL_ACCESS.PREMIUM,
  levels: world5Levels,
};

export default WORLD_5_SET;
