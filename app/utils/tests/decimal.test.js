/**
 * Test async injectors
 */

import formatDecimal from '../decimal';

describe('formatDecimal', () => {
  describe('', () => {
    it('return N/A when no value provided', () => {
      const str = null;
      const expected = 'N/A';

      expect(formatDecimal(str)).toEqual(expected);
    });

    it('convert two decimals to one decimal in string', () => {
      const str = '0.42% - 0.05%';
      const expected = '0.4% - 0.05%';

      expect(formatDecimal(str)).toEqual(expected);
    });

    it('leaves values like 1.5 unchanged', () => {
      const str = '1.5%';
      const expected = '1.5%';

      expect(formatDecimal(str)).toEqual(expected);
    });
  });
});
