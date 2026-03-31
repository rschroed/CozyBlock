import { LEVEL_ACCESS, LEVELS, LEVEL_SETS } from './index';

function getSetAccessState(set, { hasPremium = false } = {}) {
  const isAccessible = hasPremium || set.access !== LEVEL_ACCESS.PREMIUM;

  return {
    access: set.access,
    isAccessible,
    blockedAction: isAccessible ? 'none' : 'show_purchase',
  };
}

function getSetContext(levelIndex) {
  let traversedLevels = 0;

  for (let setIndex = 0; setIndex < LEVEL_SETS.length; setIndex += 1) {
    const set = LEVEL_SETS[setIndex];
    const nextTraversedLevels = traversedLevels + set.levels.length;

    if (levelIndex < nextTraversedLevels) {
      return {
        set,
        setIndex,
        startLevelIndex: traversedLevels,
      };
    }

    traversedLevels = nextTraversedLevels;
  }

  return null;
}

function getSetStartIndex(setIndex) {
  let startIndex = 0;

  for (let index = 0; index < setIndex; index += 1) {
    startIndex += LEVEL_SETS[index].levels.length;
  }

  return startIndex;
}

export function getLevelNavigation(levelIndex, options = {}) {
  const level = LEVELS[levelIndex];

  if (!level) {
    return null;
  }

  const activeSetContext = getSetContext(levelIndex);

  if (!activeSetContext) {
    return null;
  }

  const { set: activeSet, setIndex: activeSetIndex, startLevelIndex } = activeSetContext;
  const activeSetAccessState = getSetAccessState(activeSet, options);
  const localLevelIndex = levelIndex - startLevelIndex;
  const nextLevelIndex = levelIndex < LEVELS.length - 1 ? levelIndex + 1 : null;
  const previousLevelIndex = levelIndex > 0 ? levelIndex - 1 : null;
  const hasNextLevelInSet = localLevelIndex < activeSet.levels.length - 1;
  const hasPreviousLevelInSet = localLevelIndex > 0;
  const crossesIntoNextSet = !hasNextLevelInSet && nextLevelIndex !== null;
  const nextTargetContext = nextLevelIndex !== null ? getSetContext(nextLevelIndex) : null;
  const nextSet = crossesIntoNextSet ? nextTargetContext?.set ?? null : null;
  const nextTarget = nextTargetContext
    ? {
        levelIndex: nextLevelIndex,
        set: nextTargetContext.set,
        setIndex: nextTargetContext.setIndex,
        setId: nextTargetContext.set.id,
        setName: nextTargetContext.set.name,
        ...getSetAccessState(nextTargetContext.set, options),
      }
    : null;

  return {
    levelIndex,
    level,
    set: activeSet,
    setIndex: activeSetIndex,
    setId: activeSet.id,
    setName: activeSet.name,
    ...activeSetAccessState,
    localLevelIndex,
    localLevelNumber: localLevelIndex + 1,
    localLevelCount: activeSet.levels.length,
    hasPreviousLevelInSet,
    hasNextLevelInSet,
    crossesIntoNextSet,
    previousLevelIndex,
    nextLevelIndex,
    nextSet,
    nextTarget,
  };
}

export function getLevelPickerSections(options = {}) {
  return LEVEL_SETS.map((set, setIndex) => {
    const startLevelIndex = getSetStartIndex(setIndex);
    const setAccessState = getSetAccessState(set, options);

    return {
      set,
      setIndex,
      setId: set.id,
      setName: set.name,
      ...setAccessState,
      startLevelIndex,
      levels: set.levels.map((level, localLevelIndex) => ({
        level,
        levelIndex: startLevelIndex + localLevelIndex,
        localLevelIndex,
        localLevelNumber: localLevelIndex + 1,
        setId: set.id,
        setName: set.name,
        ...setAccessState,
      })),
    };
  });
}
