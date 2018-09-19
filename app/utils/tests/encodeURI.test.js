/**
 * Test async injectors
 */

import encodeURI from '../encodeURI';

describe('encodeURL', () => {
  describe('', () => {
    it('stringifies the given object and encodes it', () => {
      const actual = {
        foo: 'bar',
      };
      const expected = '%7B%22foo%22%3A%22bar%22%7D';

      expect(encodeURI(actual)).toEqual(expected);
    });
  });
});
