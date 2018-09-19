import React from 'react';
import { create } from 'react-test-renderer';
import { shallow } from 'enzyme';

import PieChart from 'components/PieChart';

const data = [
  { name: '10$', price: 10, count: 40 },
  { name: '20$', price: 20, count: 20 },
  { name: '50$', price: 20, count: 20 },
];

const emptyData = [];

describe('<PieChart />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<PieChart />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('renders message if data is not provided', () => {
    const component = shallow(<PieChart message="Hey" />);
    expect(component.contains('Hey')).toEqual(true);
  });

  it('renders message if empty array is provided', () => {
    const component = shallow(<PieChart data={emptyData} message="Hey" />);
    expect(component.contains('Hey')).toEqual(true);
  });

  it('renders `message` if provided', () => {
    const component = shallow(<PieChart data={emptyData} message="Hey" />);
    expect(component.contains('Hey')).toEqual(true);
  });

  it('renders `innerComponent` if provided', () => {
    const component = shallow(<PieChart data={data} innerComponent="Hey" />);
    expect(component.find('.pieChart__inner').text()).toEqual('Hey');
  });

  it('renders `label` and `labelPrefix` if provided', () => {
    const component = shallow(
      <PieChart data={data} labelPrefix={() => '$20'} label="redemptions" />
    );
    expect(
      component
        .find('.pieChart__label')
        .first()
        .text()
    ).toEqual('$20 redemptions');
  });

  it('renders provided `className`', () => {
    const component = shallow(<PieChart data={data} className="hey" />);
    expect(component.hasClass('hey')).toEqual(true);
  });

  it('stacks for small screens if `stackForSmall` is specified', () => {
    const component = shallow(<PieChart data={data} stackForSmall />);
    expect(
      component.find('.pieChart__legend').hasClass('small-12 medium-expand')
    ).toEqual(true);
  });

  it('renders specified `stroke`', () => {
    const component = shallow(<PieChart data={data} stroke="#000000" />);
    expect(
      component
        .find('Cell')
        .first()
        .prop('stroke')
    ).toEqual('#000000');
  });

  it('renders specified `radius` and `thickness`', () => {
    const component = shallow(
      <PieChart data={data} radius={50} thickness={10} />
    );
    expect(component.find('PieChart').prop('width')).toEqual(100);
    expect(component.find('PieChart').prop('height')).toEqual(100);
    expect(component.find('Pie').prop('innerRadius')).toEqual(38);
    expect(component.find('Pie').prop('outerRadius')).toEqual(50);
  });

  it('renders data if provided', () => {
    const component = create(<PieChart data={data} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
