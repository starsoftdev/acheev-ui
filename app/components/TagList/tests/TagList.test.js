import React from 'react';
import { shallow } from 'enzyme';
import TagList from 'components/TagList';

import Typeahead from 'components/Typeahead';
import TagItem from 'components/TagList/TagItem';
import EffectItem from 'components/TagList/EffectItem';

const data = [
  {
    label: 'Label',
    value: 5,
  },
  {
    label: 'Label 1',
    value: 6,
  },
];

describe('<TagList />', () => {
  it('should have correct className', () => {
    const renderedComponent = shallow(<TagList value={data} className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should have Typeahead', () => {
    const renderedComponent = shallow(<TagList value={data} className="hey" />);
    expect(renderedComponent.find(Typeahead).length).toEqual(1);
  });

  it('should have correct number of EffectItems', () => {
    const renderedComponent = shallow(
      <TagList value={data} className="hey" showEffects />
    );
    expect(renderedComponent.find(EffectItem).length).toEqual(data.length);
  });

  it('should not have Typeahead when read only', () => {
    const renderedComponent = shallow(
      <TagList value={data} className="hey" readOnly />
    );
    expect(renderedComponent.find(Typeahead).length).toEqual(0);
  });

  it('should have correct number of TagItems when read only', () => {
    const renderedComponent = shallow(
      <TagList value={data} className="hey" readOnly />
    );
    expect(renderedComponent.find(TagItem).length).toEqual(data.length);
  });
});
