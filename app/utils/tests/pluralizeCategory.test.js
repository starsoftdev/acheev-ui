/**
 * Test pluralize category string
 */

import pluralizeCategory from '../pluralizeCategory';

describe('pluralizeCategory', () => {
  describe('', () => {
    it('return "dispensaries" for plural form of "dispensary"', () => {
      const category = 'dispensary';
      const expected = 'dispensaries';

      expect(pluralizeCategory(category)).toEqual(expected);
    });

    it('converts "product" category to "accessories"', () => {
      const category = 'product';
      const expected = 'accessories';

      expect(pluralizeCategory(category)).toEqual(expected);
    });

    it('converts "doctor" category to "clinics"', () => {
      const category = 'doctor';
      const expected = 'clinics';

      expect(pluralizeCategory(category)).toEqual(expected);
    });

    it('converts rest category to plural form by attaching "s"', () => {
      const category = 'oil';
      const expected = 'oils';

      expect(pluralizeCategory(category)).toEqual(expected);
    });

    it('return "accessories" for null or undefined input', () => {
      const expected = 'accessories';

      expect(pluralizeCategory()).toEqual(expected);
    });

    it('returns provided string without changes if it ends with s', () => {
      const expected = 'producers';

      expect(pluralizeCategory(expected)).toEqual(expected);
    });
  });
});
