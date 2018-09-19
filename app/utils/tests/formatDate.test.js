import formatDate from '../formatDate';

describe('formatDate', () => {
  describe('', () => {
    it('given a date should format it to "MMM DD YYYY"', () => {
      const actual = '2016-12-12T20:25:03.099Z';
      const expected = 'Dec 12 2016';
      expect(formatDate(actual)).toEqual(expected);
    });
  });
  describe('', () => {
    it('given an empty string should return "N/A"', () => {
      const actual = '';
      const expected = 'N/A';
      expect(formatDate(actual)).toEqual(expected);
    });
  });
});
