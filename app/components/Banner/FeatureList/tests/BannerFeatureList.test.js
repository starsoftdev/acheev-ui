import React from 'react';
import { shallow } from 'enzyme';
import BannerFeatureList from 'components/Banner/FeatureList';
import ItemList from 'components/Banner/FeatureList/ItemList';

describe('<BannerFeatureList />', () => {
  it('should render <ItemList>', () => {
    const renderedComponent = shallow(<BannerFeatureList element="h1" />);
    expect(renderedComponent.find(ItemList).length).toEqual(1);
  });
});
