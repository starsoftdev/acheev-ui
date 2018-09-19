import React from 'react';
import { shallow } from 'enzyme';
import CustomConnectedRouter from 'components/ConnectedRouter';
import { ConnectedRouter } from 'react-router-redux';

describe('<ConnectedRouter />', () => {
  it('should render provided children', () => {
    const renderedComponent = shallow(
      <CustomConnectedRouter>Hey</CustomConnectedRouter>
    );
    expect(
      renderedComponent
        .find(ConnectedRouter)
        .children()
        .text()
    ).toContain('Hey');
  });
});
