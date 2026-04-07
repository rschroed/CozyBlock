import { describe, expect, it } from 'vitest';
import { getLevelNavigation, getLevelPickerSections } from './navigation';

describe('level navigation helpers', () => {
  describe('getLevelNavigation', () => {
    it('reports the correct metadata for the first level of each set', () => {
      expect(getLevelNavigation(0)).toMatchObject({
        setId: 'world-0',
        setName: 'World 0',
        localLevelIndex: 0,
        localLevelNumber: 1,
        localLevelCount: 1,
        hasPreviousLevelInSet: false,
      });

      expect(getLevelNavigation(1)).toMatchObject({
        setId: 'world-1',
        setName: 'World 1',
        localLevelIndex: 0,
        localLevelNumber: 1,
        localLevelCount: 8,
        hasPreviousLevelInSet: false,
      });

      expect(getLevelNavigation(9)).toMatchObject({
        setId: 'world-2',
        setName: 'World 2',
        localLevelIndex: 0,
        localLevelNumber: 1,
        localLevelCount: 8,
        hasPreviousLevelInSet: false,
      });

      expect(getLevelNavigation(17)).toMatchObject({
        setId: 'world-3',
        setName: 'World 3',
        localLevelIndex: 0,
        localLevelNumber: 1,
        localLevelCount: 8,
        hasPreviousLevelInSet: false,
      });

      expect(getLevelNavigation(57)).toMatchObject({
        setId: 'world-8',
        setName: 'World 8',
        localLevelIndex: 0,
        localLevelNumber: 1,
        localLevelCount: 8,
        hasPreviousLevelInSet: false,
      });
    });

    it('reports the correct metadata for a middle level within a set', () => {
      expect(getLevelNavigation(3)).toMatchObject({
        setId: 'world-1',
        localLevelIndex: 2,
        localLevelNumber: 3,
        localLevelCount: 8,
        hasNextLevelInSet: true,
        crossesIntoNextSet: false,
        nextSet: null,
      });
    });

    it('reports a set boundary transition at the last level of a non-final set', () => {
      expect(getLevelNavigation(0)).toMatchObject({
        setId: 'world-0',
        localLevelNumber: 1,
        localLevelCount: 1,
        hasNextLevelInSet: false,
        crossesIntoNextSet: true,
      });

      expect(getLevelNavigation(0)?.nextSet).toMatchObject({
        id: 'world-1',
        name: 'World 1',
      });
    });

    it('reports no next set at the last level of the final set', () => {
      expect(getLevelNavigation(64)).toMatchObject({
        setId: 'world-8',
        localLevelNumber: 8,
        localLevelCount: 8,
        hasNextLevelInSet: false,
        crossesIntoNextSet: false,
        nextLevelIndex: null,
        nextSet: null,
      });
    });
  });

  describe('getLevelPickerSections', () => {
    it('builds grouped picker sections with the correct local numbering', () => {
      const sections = getLevelPickerSections().map((section) => ({
        setId: section.setId,
        startLevelIndex: section.startLevelIndex,
        levels: section.levels.slice(0, 2).map((level) => ({
          levelIndex: level.levelIndex,
          localLevelNumber: level.localLevelNumber,
        })),
      }));

      expect(sections).toEqual([
        {
          setId: 'world-0',
          startLevelIndex: 0,
          levels: [{ levelIndex: 0, localLevelNumber: 1 }],
        },
        {
          setId: 'world-1',
          startLevelIndex: 1,
          levels: [
            { levelIndex: 1, localLevelNumber: 1 },
            { levelIndex: 2, localLevelNumber: 2 },
          ],
        },
        {
          setId: 'world-2',
          startLevelIndex: 9,
          levels: [
            { levelIndex: 9, localLevelNumber: 1 },
            { levelIndex: 10, localLevelNumber: 2 },
          ],
        },
        {
          setId: 'world-3',
          startLevelIndex: 17,
          levels: [
            { levelIndex: 17, localLevelNumber: 1 },
            { levelIndex: 18, localLevelNumber: 2 },
          ],
        },
        {
          setId: 'world-4',
          startLevelIndex: 25,
          levels: [
            { levelIndex: 25, localLevelNumber: 1 },
            { levelIndex: 26, localLevelNumber: 2 },
          ],
        },
        {
          setId: 'world-5',
          startLevelIndex: 33,
          levels: [
            { levelIndex: 33, localLevelNumber: 1 },
            { levelIndex: 34, localLevelNumber: 2 },
          ],
        },
        {
          setId: 'world-6',
          startLevelIndex: 41,
          levels: [
            { levelIndex: 41, localLevelNumber: 1 },
            { levelIndex: 42, localLevelNumber: 2 },
          ],
        },
        {
          setId: 'world-7',
          startLevelIndex: 49,
          levels: [
            { levelIndex: 49, localLevelNumber: 1 },
            { levelIndex: 50, localLevelNumber: 2 },
          ],
        },
        {
          setId: 'world-8',
          startLevelIndex: 57,
          levels: [
            { levelIndex: 57, localLevelNumber: 1 },
            { levelIndex: 58, localLevelNumber: 2 },
          ],
        },
      ]);
    });
  });
});
