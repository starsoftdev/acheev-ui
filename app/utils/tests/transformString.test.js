import transformString from '../transformString';

describe('transformString', () => {
  describe('', () => {
    it('given string returns string', () => {
      expect(transformString('string')).toEqual('string');
    });
    it('given null returns null', () => {
      expect(transformString(null)).toEqual(null);
    });
    it('given empty string returns empty string', () => {
      expect(transformString('')).toEqual('');
    });
    it('given undefined returns undefined', () => {
      expect(transformString(undefined)).toEqual(undefined);
    });
    it('given NaN returns empty NaN', () => {
      expect(transformString(NaN)).toEqual(NaN);
    });
    it("given 'undefined' string returns undefined", () => {
      expect(transformString('undefined')).toEqual(undefined);
    });
    it("given 'NaN' string returns NaN", () => {
      expect(transformString('NaN')).toEqual(NaN);
    });
    it("given 'null' string returns null", () => {
      expect(transformString('Null')).toEqual(null);
    });
    it('given number returns number', () => {
      expect(transformString(1.5)).toEqual(1.5);
    });
  });
});
