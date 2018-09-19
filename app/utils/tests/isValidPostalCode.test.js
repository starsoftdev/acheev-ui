/**
 * Test isValidPostalCode
 */

import isValidPostalCode from '../isValidPostalCode';

describe('isValidPostalCode', () => {
  describe('', () => {
    it('return true for empty code', () => {
      expect(isValidPostalCode('')).toEqual(true);
    });

    it('return false for wrong code', () => {
      expect(isValidPostalCode('1000')).toEqual(false);
    });

    it('return true for valid code', () => {
      expect(isValidPostalCode('M5A 2T1')).toEqual(true);
    });
  });
});
