import { LEVEL_ACCESS } from '../access';
import firstBlock from './01-first-block';

const world0Levels = [firstBlock];

export const WORLD_0_SET = {
  id: 'world-0',
  name: 'World 0',
  access: LEVEL_ACCESS.FREE,
  levels: world0Levels,
};

export default WORLD_0_SET;
