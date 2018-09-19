import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';

import PageMeta from 'components/PageMeta';

describe('<PageMeta />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<PageMeta />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should apply given title', () => {
    const renderedComponent = shallow(
      <PageMeta title="hey" titlePostfix="ho" />
    );
    expect(renderedComponent.find('title').text()).toEqual('hey - ho');
  });

  it('should apply title from data if both title and data are specified', () => {
    const renderedComponent = shallow(
      <PageMeta title="hey" data={fromJS({ title: 'ho' })} titlePostfix="hey" />
    );
    expect(renderedComponent.find('title').text()).toEqual('ho - hey');
  });
});
