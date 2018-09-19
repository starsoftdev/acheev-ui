import renderCategoryName from '../renderCategoryName';

describe('renderCategoryName', () => {
  describe('', () => {
    it('given a category returns it lowercased and with article', () => {
      expect(renderCategoryName('Strain')).toEqual('a strain');
    });
    it('given a category other than Strain returns it with `an` article', () => {
      expect(renderCategoryName('Accessory')).toEqual('an accessory');
    });
  });
});
