import plainText from '../plainText';

describe('plainText', () => {
  it('gives plain text', () => {
    expect(plainText('<p>text&nbsp;</p>')).toEqual('text ');
  });
  it('gives empty string for nil', () => {
    expect(plainText(null)).toEqual('');
  });
});
