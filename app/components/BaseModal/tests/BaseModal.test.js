import React from 'react';
import { create } from 'react-test-renderer';
import BaseModal from 'components/BaseModal';

describe('<BaseModal />', () => {
  it('should match snapshot', () => {
    const component = create(<BaseModal>Content</BaseModal>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
