import React from 'react';
import { shallow } from 'enzyme';

import CircleProgressBar from 'components/CircleProgressBar';

describe('<CircleProgressBar />', () => {
  it('should apply given className', () => {
    const renderedComponent = shallow(<CircleProgressBar className="hey" />);
    expect(renderedComponent.prop('containerClassName')).toContain('hey');
  });

  it('should apply given className', () => {
    const renderedComponent = shallow(<CircleProgressBar radius={2} />);
    expect(renderedComponent.prop('containerStyle')).toEqual({
      width: '4px',
      height: '4px',
    });
  });
});
