/**
 * Test async injectors
 */

import deepReplace from '../deepReplaceToObject';

describe('deepReplace', () => {
  describe('', () => {
    it('replaces all nested objects with `value` and `strength` keys with objects with `name` and `value` keys', () => {
      const actual = {
        obj: {
          nested: [
            {
              value: 'hey',
              label: 'hey',
              strength: 5,
            },
            {
              value: 'ho',
              label: 'ho',
              strength: 6,
            },
          ],
        },
      };
      const expected = {
        obj: {
          nested: [
            {
              name: 'hey',
              value: 5,
            },
            {
              name: 'ho',
              value: 6,
            },
          ],
        },
      };
      expect(deepReplace(actual)).toEqual(expected);
    });

    it('replaces all nested objects with `value` and `strength` keys with objects with `name` and `value` keys, even if the strength is not defined', () => {
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
          nested: [
            {
              name: 'hey',
              value: 5,
            },
            {
              name: 'ho',
              value: 5,
            },
          ],
        },
      };
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
