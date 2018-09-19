import React from 'react';
import { create } from 'react-test-renderer';

import LimitedFeaturesMessage from 'components/LP/LimitedFeaturesMessage';

describe('<LimitedFeaturesMessage />', () => {
  it('Should match snapshoot for business', () => {
    const component = create(<LimitedFeaturesMessage role="business" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('Should match snapshoot for pro', () => {
    const component = create(<LimitedFeaturesMessage role="pro" />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
