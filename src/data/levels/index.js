import FOUNDATIONS_SET from './foundations';

export const LEVEL_SETS = [FOUNDATIONS_SET];

export const LEVELS = LEVEL_SETS.flatMap((set) => set.levels);
