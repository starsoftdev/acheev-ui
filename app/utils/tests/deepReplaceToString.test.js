/**
 * Test async injectors
 */

import deepReplace from '../deepReplaceToString';

describe('deepReplace', () => {
  describe('', () => {
    it('replaces all nested objects with `value` and `label` keys with strings', () => {
      const actual = {
        obj: {
          nested: [
            {
              value: 'hey',
              label: 'hey',
            },
            {
              value: 'ho',
              label: 'ho',
            },
          ],
        },
      };
      const expected = {
        obj: {
          nested: ['hey', 'ho'],
        },
      };
      expect(deepReplace(actual)).toEqual(expected);
    });

    it('replaces plain objects with `value` and `label` keys with strings', () => {
      const actual = {
        value: 'hey',
        label: 'hey',
      };
      const expected = 'hey';
      expect(deepReplace(actual)).toEqual(expected);
    });

    it("doesn't crash if value === null", () => {
      const actual = {
        obj: {
          value: null,
        },
      };
      const expected = {
        obj: {
          value: null,
        },
      };
      expect(deepReplace(actual)).toEqual(expected);
    });

    it("doesn't crash given null", () => {
      const actual = null;
      const expected = null;
      expect(deepReplace(actual)).toEqual(expected);
    });
  });
});
