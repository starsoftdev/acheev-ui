import transformOptions from '../transformOptions';

describe('transformOptions', () => {
  describe('', () => {
    it('given an array of strings, should return an array of objects with `value` and `label` keys', () => {
      const actual = ['hey', 'ho'];
      const expected = [
        {
          value: 'hey',
          label: 'hey',
        },
        {
          value: 'ho',
          label: 'ho',
        },
      ];
      expect(transformOptions(actual)).toEqual(expected);
    });
  });

  describe('', () => {
    it(`given an array of objects, should return an array of objects with 'value' and 'label' keys
    equal to 'slug' key value of each original object`, () => {
      const actual = [{ slug: 'hey' }, { slug: 'ho' }];
      const expected = [
        {
          value: 'hey',
          label: 'hey',
        },
        {
          value: 'ho',
          label: 'ho',
        },
      ];
      expect(transformOptions(actual)).toEqual(expected);
    });
  });

  describe('', () => {
    it(`given an array of objects, should return an array of objects with 'value' and 'label' keys
    equal to '_id' and 'name' keys value of each original object`, () => {
      const actual = [
        {
          _id: 'hey',
          name: 'ho',
        },
        {
          _id: 'foo',
          name: 'bar',
        },
      ];
      const expected = [
        {
          value: 'hey',
          label: 'ho',
        },
        {
          value: 'foo',
          label: 'bar',
        },
      ];
      expect(transformOptions(actual)).toEqual(expected);
    });
  });

  describe('', () => {
    it("given an array of objects with includeAll param, should return an array of objects with 'value' and 'label' keys and 'all' option", () => {
      const actual = [
        {
          _id: 'hey',
          name: 'ho',
        },
        {
          _id: 'foo',
          name: 'bar',
        },
      ];
      const expected = [
        {
          value: 'all',
          label: 'ALL',
        },
        {
          value: 'hey',
          label: 'ho',
        },
        {
          value: 'foo',
          label: 'bar',
        },
      ];
      expect(transformOptions(actual, true)).toEqual(expected);
    });
  });

  describe('', () => {
    it("given an array of objects with valueField as id, should return an array of objects with 'value' and 'label' keys", () => {
      const actual = [
        {
          _id: 'hey',
          name: 'ho',
          slug: 'ho',
        },
        {
          _id: 'foo',
          name: 'bar',
          slug: 'bar',
        },
      ];
      const expected = [
        {
          value: 'hey',
          label: 'ho',
        },
        {
          value: 'foo',
          label: 'bar',
        },
      ];
      expect(transformOptions(actual, false, '_id')).toEqual(expected);
    });
  });

  describe('', () => {
    it('given an array of objects with value and label keys should return it unmodified', () => {
      const actual = [
        {
          value: 'hey',
          label: 'ho',
        },
      ];
      const expected = [
        {
          value: 'hey',
          label: 'ho',
        },
      ];
      expect(transformOptions(actual)).toEqual(expected);
    });
  });

  describe('', () => {
    it('given a falsy value should return empty array', () => {
      const actual = undefined;
      const expected = [];
      expect(transformOptions(actual)).toEqual(expected);
    });
  });
});
