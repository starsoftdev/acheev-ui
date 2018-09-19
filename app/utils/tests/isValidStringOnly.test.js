/**
 * Test isValidStringOnly
 */

import isValidStringOnly from '../isValidStringOnly';

describe('isValidStringOnly', () => {
  it('returns true for empty code', () => {
    expect(isValidStringOnly('')).toEqual(true);
  });

  it('returns false for string with numbers', () => {
    expect(isValidStringOnly('hello1')).toEqual(false);
  });

  it('returns false for string with special characters', () => {
    expect(isValidStringOnly('hello@')).toEqual(false);
  });

  it('returns true for string only', () => {
    expect(isValidStringOnly('Kosta')).toEqual(true);
  });

  it('returns true for string with hyphens', () => {
    expect(isValidStringOnly('Ivanov-Petrov')).toEqual(true);
  });
});
