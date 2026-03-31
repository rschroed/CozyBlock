import { describe, expect, it } from 'vitest';
import { getLevelNavigation, getLevelPickerSections } from './navigation';

describe('level navigation helpers', () => {
  describe('getLevelNavigation', () => {
    it('reports the correct metadata for the first level of each set', () => {
      expect(getLevelNavigation(0)).toMatchObject({
        setId: 'world-0',
        setName: 'World 0',
        access: 'free',
        isAccessible: true,
        blockedAction: 'none',
        localLevelIndex: 0,
        localLevelNumber: 1,
        localLevelCount: 1,
        hasPreviousLevelInSet: false,
      });

      expect(getLevelNavigation(1)).toMatchObject({
        setId: 'world-1',
        setName: 'World 1',
        access: 'free',
        isAccessible: true,
        blockedAction: 'none',
        localLevelIndex: 0,
        localLevelNumber: 1,
        localLevelCount: 8,
        hasPreviousLevelInSet: false,
      });

      expect(getLevelNavigation(9)).toMatchObject({
        setId: 'world-2',
        setName: 'World 2',
        access: 'premium',
        isAccessible: false,
        blockedAction: 'show_purchase',
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

    it('reports blocked next-target metadata when a free player reaches premium content', () => {
      expect(getLevelNavigation(8)).toMatchObject({
        setId: 'world-1',
        setName: 'World 1',
        crossesIntoNextSet: true,
      });

      expect(getLevelNavigation(8)?.nextTarget).toMatchObject({
        levelIndex: 9,
        setId: 'world-2',
        setName: 'World 2',
        access: 'premium',
        isAccessible: false,
        blockedAction: 'show_purchase',
      });
    });

    it('reports no next set at the last level of the final set', () => {
      expect(getLevelNavigation(16)).toMatchObject({
        setId: 'world-2',
        localLevelNumber: 8,
        localLevelCount: 8,
        hasNextLevelInSet: false,
        crossesIntoNextSet: false,
        nextLevelIndex: null,
        nextSet: null,
      });
    });

    it('reports premium worlds as accessible for premium players', () => {
      expect(getLevelNavigation(9, { hasPremium: true })).toMatchObject({
        setId: 'world-2',
        access: 'premium',
        isAccessible: true,
        blockedAction: 'none',
      });

      expect(getLevelNavigation(8, { hasPremium: true })?.nextTarget).toMatchObject({
        levelIndex: 9,
        setId: 'world-2',
        isAccessible: true,
        blockedAction: 'none',
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
      ]);
    });

    it('marks premium sections and levels as inaccessible for free players', () => {
      const premiumSection = getLevelPickerSections().find((section) => section.setId === 'world-2');

      expect(premiumSection).toMatchObject({
        setId: 'world-2',
        access: 'premium',
        isAccessible: false,
        blockedAction: 'show_purchase',
      });

      expect(premiumSection?.levels[0]).toMatchObject({
        levelIndex: 9,
        setId: 'world-2',
        setName: 'World 2',
        access: 'premium',
        isAccessible: false,
        blockedAction: 'show_purchase',
      });
    });

    it('marks premium sections and levels as accessible for premium players', () => {
      const premiumSection = getLevelPickerSections({ hasPremium: true }).find(
        (section) => section.setId === 'world-2',
      );

      expect(premiumSection).toMatchObject({
        setId: 'world-2',
        access: 'premium',
        isAccessible: true,
        blockedAction: 'none',
      });

      expect(premiumSection?.levels[0]).toMatchObject({
        levelIndex: 9,
        access: 'premium',
        isAccessible: true,
        blockedAction: 'none',
      });
    });
  });
});
