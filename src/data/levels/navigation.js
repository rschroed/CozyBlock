import { LEVELS, LEVEL_SETS } from './index';

function getSetStartIndex(setIndex) {
  let startIndex = 0;

  for (let index = 0; index < setIndex; index += 1) {
    startIndex += LEVEL_SETS[index].levels.length;
  }

  return startIndex;
}

export function getLevelNavigation(levelIndex) {
  const level = LEVELS[levelIndex];

  if (!level) {
    return null;
  }

  let traversedLevels = 0;
  let activeSet = null;
  let activeSetIndex = -1;

  for (let setIndex = 0; setIndex < LEVEL_SETS.length; setIndex += 1) {
    const set = LEVEL_SETS[setIndex];
    const nextTraversedLevels = traversedLevels + set.levels.length;

    if (levelIndex < nextTraversedLevels) {
      activeSet = set;
      activeSetIndex = setIndex;
      break;
    }

    traversedLevels = nextTraversedLevels;
  }

  if (!activeSet) {
    return null;
  }

  const localLevelIndex = levelIndex - traversedLevels;
  const nextLevelIndex = levelIndex < LEVELS.length - 1 ? levelIndex + 1 : null;
  const previousLevelIndex = levelIndex > 0 ? levelIndex - 1 : null;
  const hasNextLevelInSet = localLevelIndex < activeSet.levels.length - 1;
  const hasPreviousLevelInSet = localLevelIndex > 0;
  const crossesIntoNextSet = !hasNextLevelInSet && nextLevelIndex !== null;
  const nextSet = crossesIntoNextSet ? LEVEL_SETS[activeSetIndex + 1] ?? null : null;

  return {
    levelIndex,
    level,
    set: activeSet,
    setIndex: activeSetIndex,
    setId: activeSet.id,
    setName: activeSet.name,
    localLevelIndex,
    localLevelNumber: localLevelIndex + 1,
    localLevelCount: activeSet.levels.length,
    hasPreviousLevelInSet,
    hasNextLevelInSet,
    crossesIntoNextSet,
    previousLevelIndex,
    nextLevelIndex,
    nextSet,
  };
}

export function getLevelPickerSections() {
  return LEVEL_SETS.map((set, setIndex) => {
    const startLevelIndex = getSetStartIndex(setIndex);

    return {
      set,
      setIndex,
      setId: set.id,
      setName: set.name,
      startLevelIndex,
      levels: set.levels.map((level, localLevelIndex) => ({
        level,
        levelIndex: startLevelIndex + localLevelIndex,
        localLevelIndex,
        localLevelNumber: localLevelIndex + 1,
      })),
    };
  });
}
