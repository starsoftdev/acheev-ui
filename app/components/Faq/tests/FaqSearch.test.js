import React from 'react';
import { shallow } from 'enzyme';
import FaqSearch from 'components/Faq/Search';
import SearchField from 'components/SearchField';

describe('<FaqSearch />', () => {
  it('should have SearchField', () => {
    const renderedComponent = shallow(<FaqSearch />);
    expect(renderedComponent.find(SearchField)).toHaveLength(1);
  });
});
