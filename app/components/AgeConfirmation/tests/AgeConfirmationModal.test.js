import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import AgeConfirmationModal from 'components/AgeConfirmation/AgeConfirmationModal';

describe('<AgeConfirmationModal />', () => {
  it('should modal be present', () => {
    const component = mount(
      <MemoryRouter>
        <AgeConfirmationModal isOpen />
      </MemoryRouter>
    );

    expect(component.find('Button').length).toEqual(2);
    expect(component.find('Modal').length).toEqual(1);
  });

  it('should modal not be present', () => {
    const component = mount(
      <MemoryRouter>
        <AgeConfirmationModal />
      </MemoryRouter>
    );

    expect(component.find('Button').length).toEqual(0);
    expect(component.find('Modal').length).toEqual(1);
  });

  it('should call functions', () => {
    const handleYesAnswer = jest.fn();
    const handleNoAnswer = jest.fn();
    const component = mount(
      <MemoryRouter>
        <AgeConfirmationModal
          isOpen
          onNoAnswer={handleNoAnswer}
          onYesAnswer={handleYesAnswer}
        />
      </MemoryRouter>
    );

    component
      .find('Button')
      .at(0)
      .simulate('click');
    component
      .find('Button')
      .at(1)
      .simulate('click');

    expect(handleYesAnswer.mock.calls.length).toEqual(1);
    expect(handleNoAnswer.mock.calls.length).toEqual(1);
  });
});
