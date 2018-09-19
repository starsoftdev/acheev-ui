/**
 * Test async injectors
 */

import title from '../title';

const name = 'Cool';
const type = 'Oil';

describe('title', () => {
  it("shouldn't throw error if no data provided", () => {
    try {
      title({});
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('returns title if type is not specified', () => {
    expect(title({ name: 'Cool Oil' })).toEqual('Cool Oil');
  });

  it('renders provided props', () => {
    expect(title({ name, type })).toEqual('Cool Oil');
  });

  it('renders prefix and postfix', () => {
    expect(title({ name, type, prefix: 'Hooray', postfix: 'Wow' })).toEqual(
      'Hooray Cool Oil Wow'
    );
  });

  it('replaces Doctor with Clinic if passed as type', () => {
    expect(title({ name, type: 'Doctor' })).toEqual('Cool Clinic');
  });

  it("doesn't append type to name if it is already appended", () => {
    expect(title({ name: 'Cool Oil', type: 'Oil' })).toEqual('Cool Oil');
  });
});
