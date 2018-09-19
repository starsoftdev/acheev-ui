import isObject from '../isObject';

describe('isObject', () => {
  describe('', () => {
    it('given an object returns true', () => {
      expect(isObject({})).toEqual(true);
    });
    it('given null returns false', () => {
      expect(isObject(null)).toEqual(false);
    });
  });
});
