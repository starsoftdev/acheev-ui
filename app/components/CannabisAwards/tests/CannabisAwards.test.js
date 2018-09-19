import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import CannabisAwards from 'components/CannabisAwards';
import CannabisAwardItem from 'components/CannabisAwards/CannabisAwardItem';

const awards = fromJS([
  {
    tier: 'gold',
    year: '2014',
    name: 'Top Sativa Strain',
    _id: '59c872f9233e0f5c4d15f5e9',
  },
  {
    tier: 'bronze',
    year: '2015',
    name: 'Top Hybrid Strain',
    _id: '59c872f9233e0f5c4d15f5e8',
  },
  {
    tier: 'silver',
    year: '2016',
    name: 'Top Indica Strain',
    _id: '59c872f9233e0f5c4d15f5e7',
  },
]);
describe('<CannabisAwards />', () => {
  it('should render correct number of Items', () => {
    const renderedComponent = shallow(<CannabisAwards data={awards} />);
    expect(renderedComponent.find(CannabisAwardItem).length).toEqual(
      awards.size
    );
  });

  it('should have given className', () => {
    const renderedComponent = shallow(
      <CannabisAwards data={awards} className="hey" />
    );
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should have correct default title', () => {
    const renderedComponent = shallow(<CannabisAwards data={awards} />);
    expect(
      renderedComponent
        .find('.cannabisAwards__title')
        .contains('Canadian Cannabis Awards')
    ).toEqual(true);
  });

  it('should have correct title', () => {
    const renderedComponent = shallow(
      <CannabisAwards data={awards} title="hello" />
    );
    expect(
      renderedComponent.find('.cannabisAwards__title').contains('hello')
    ).toEqual(true);
  });
});
