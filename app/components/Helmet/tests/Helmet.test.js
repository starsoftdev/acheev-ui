import React from 'react';
import { shallow } from 'enzyme';
import ReactHelmet from 'react-helmet';

import Helmet from 'components/Helmet';
import MetaJson from 'containers/MetaJson';

describe('<Helmet />', () => {
  it('should pass modified title to MetaJson', () => {
    const renderedComponent = shallow(<Helmet title="Hey" />);
    expect(renderedComponent.find(MetaJson).prop('data').name).toEqual(
      'Hey - Lift & Co.'
    );
  });

  it('should pass modified title to ReactHelmet', () => {
    const renderedComponent = shallow(<Helmet title="Hey" />);
    expect(renderedComponent.find(ReactHelmet).prop('title')).toEqual(
      'Hey - Lift & Co.'
    );
  });

  it('should pass meta to react-helmet', () => {
    const renderedComponent = shallow(<Helmet meta={[{ hey: 'ho' }]} />);
    expect(renderedComponent.find(ReactHelmet).prop('meta')).toEqual([
      { hey: 'ho' },
    ]);
  });

  it('should render its children', () => {
    const renderedComponent = shallow(<Helmet>Hey</Helmet>);
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });
});
