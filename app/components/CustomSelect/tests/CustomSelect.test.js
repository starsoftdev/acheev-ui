import React from 'react';
import { shallow, mount } from 'enzyme';
import Select, { Creatable } from 'react-select';

import transformOptions from 'utils/transformOptions';

import CustomSelect from 'components/CustomSelect';
import Icon from 'components/Icon';

import ClockIcon from 'images/sprite/clock.svg';
import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';

describe('<CustomSelect />', () => {
  it('should apply specified className', () => {
    const renderedComponent = shallow(<CustomSelect className="hey" />);
    expect(renderedComponent.hasClass('hey')).toEqual(true);
  });

  it('should apply splitLabel if specified', () => {
    const renderedComponent = shallow(<CustomSelect splitLabel />);
    expect(renderedComponent.hasClass('reactSelect--hasSplitLabel')).toEqual(
      true
    );
  });

  it('should apply arrowRenderer if specified', () => {
    const renderedComponent = mount(
      <CustomSelect arrowRenderer={() => <Icon glyph={ClockIcon} />} />
    );
    expect(renderedComponent.contains(<Icon glyph={ClockIcon} />)).toEqual(
      true
    );
  });

  it('should apply default arrowRenderer if not specified', () => {
    const renderedComponent = mount(<CustomSelect />);
    expect(
      renderedComponent.contains(<Icon glyph={ChevronDown} size={10} />)
    ).toEqual(true);
  });

  it('should toggle arrow when opened', () => {
    const renderedComponent = mount(<CustomSelect />);
    renderedComponent.find(Icon).simulate('click');
    expect(
      renderedComponent.contains(<Icon glyph={ChevronUp} size={10} />)
    ).toEqual(true);
  });

  it('should render Creatable if creatable is cpecified', () => {
    const renderedComponent = shallow(<CustomSelect creatable />);
    expect(renderedComponent.find(Creatable).length).toEqual(1);
  });

  it('options are transformed before being passed to Select', () => {
    const options = ['a', 'b', 'c'];
    const transformedOptions = transformOptions(options);
    const renderedComponent = shallow(<CustomSelect options={options} />);
    expect(renderedComponent.find(Select).prop('options')).toEqual(
      transformedOptions
    );
  });

  it('options are sorted alphabetically if `sortAlphabetically` prop is specified', () => {
    const options = [
      { value: 'c', label: 'c' },
      { value: 'a', label: 'a' },
      { value: 'b', label: 'b' },
    ];
    const sortedOptions = [
      { value: 'a', label: 'a' },
      { value: 'b', label: 'b' },
      { value: 'c', label: 'c' },
    ];
    const renderedComponent = shallow(
      <CustomSelect options={options} sortAlphabetically />
    );
    expect(renderedComponent.find(Select).prop('options')).toEqual(
      sortedOptions
    );
  });
});
