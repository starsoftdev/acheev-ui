import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import CannabisAwardItem from 'components/CannabisAwards/CannabisAwardItem';
import Icon from 'components/Icon';
import IconGold from 'images/sprite/1.svg';

const data = fromJS({
  tier: 'gold',
  year: '2014',
  name: 'Top Sativa Strain',
  _id: '59c872f9233e0f5c4d15f5e9',
});
describe('<CannabisAwardItem />', () => {
  it('should render correct Icon', () => {
    const renderedComponent = shallow(<CannabisAwardItem data={data} />);
    expect(renderedComponent.find(Icon).prop('glyph')).toEqual(IconGold);
  });

  it('should render correct labels', () => {
    const renderedComponent = shallow(<CannabisAwardItem data={data} />);
    expect(
      renderedComponent.contains(`${data.get('year')} ${data.get('tier')}`)
    ).toEqual(true);
    expect(renderedComponent.contains(`${data.get('name')}`)).toEqual(true);
  });
});
