/**
 * Test compareDeepByVal
 */

import compareDeepByVal from '../compareDeepByVal';

describe('compareDeepByVal', () => {
  describe('value compare', () => {
    it('return true for same strings', () => {
      expect(compareDeepByVal('hello1', 'hello1')).toEqual(true);
    });

    it('return false for different strings', () => {
      expect(compareDeepByVal('hello1', 'hello')).toEqual(false);
    });

    it('return true for same string and number', () => {
      expect(compareDeepByVal('5', 5)).toEqual(true);
    });

    it('return false for different string and number', () => {
      expect(compareDeepByVal('5', 4)).toEqual(false);
    });
  });

  describe('object compare', () => {
    it('return true for empty objects', () => {
      expect(compareDeepByVal({}, {})).toEqual(true);
    });
    it('return true for same values with same type', () => {
      expect(
        compareDeepByVal(
          { a: 'sample', b: 2, c: ['2', 3], d: { e: '1', f: null } },
          { a: 'sample', b: 2, c: ['2', 3], d: { e: '1', f: null } }
        )
      ).toEqual(true);
    });
    it('return true for same values but in different order', () => {
      expect(
        compareDeepByVal(
          { a: 'sample', b: 2, c: ['2', 3], d: { e: '1', f: null } },
          { a: 'sample', d: { e: '1', f: null }, b: 2, c: ['2', 3] }
        )
      ).toEqual(true);
    });
    it('return true for same values but different type', () => {
      expect(
        compareDeepByVal(
          { a: 'sample', b: 2, c: ['2', 3], d: { e: '1', f: null } },
          { a: 'sample', b: 2, c: [2, 3], d: { e: 1, f: null } }
        )
      ).toEqual(true);
    });
    it('return true for different objects', () => {
      expect(
        compareDeepByVal(
          { a: 'sample', b: 2, c: ['2', 3], d: { e: '1', f: null } },
          { a: 'sample', b: 2, c: ['2', 4] }
        )
      ).toEqual(false);
    });
  });
});
