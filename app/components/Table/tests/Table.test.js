import React from 'react';
import { shallow } from 'enzyme';
import Table from 'components/Table';

describe('<Table />', () => {
  it('should have correct class name from `className` props', () => {
    const renderedComponent = shallow(<Table className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should render children props', () => {
    const renderedComponent = shallow(
      <Table className="hey">
        <tbody>Hello</tbody>
      </Table>
    );
    expect(renderedComponent.contains(<tbody>Hello</tbody>)).toEqual(true);
  });
});
