import { PIECE_LIBRARY } from '../pieces';
export { LEVEL_ACCESS } from './access';
import WORLD_0_SET from './world-0';
import WORLD_1_SET from './world-1';
import WORLD_2_SET from './world-2';
import WORLD_3_SET from './world-3';
import WORLD_4_SET from './world-4';
import WORLD_5_SET from './world-5';
import WORLD_6_SET from './world-6';
import WORLD_7_SET from './world-7';
import WORLD_8_SET from './world-8';

export function createLevelPieceInstances(level) {
  const pieceCounts = {};

  return level.pieceIds
    .map((pieceId) => {
      const piece = PIECE_LIBRARY[pieceId];
      if (!piece) {
        return null;
      }

      pieceCounts[pieceId] = (pieceCounts[pieceId] ?? 0) + 1;

      return {
        ...piece,
        id: `${pieceId}:${pieceCounts[pieceId]}`,
        sourcePieceId: pieceId,
      };
    })
    .filter(Boolean);
}

export const LEVEL_SETS = [
  WORLD_0_SET,
  WORLD_1_SET,
  WORLD_2_SET,
  WORLD_3_SET,
  WORLD_4_SET,
  WORLD_5_SET,
  WORLD_6_SET,
  WORLD_7_SET,
  WORLD_8_SET,
];

export const LEVELS = LEVEL_SETS.flatMap((set) => set.levels);
