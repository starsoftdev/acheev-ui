import React from 'react';
import { mount } from 'enzyme';
import { MemoryRouter } from 'react-router-dom';

import AgeConfirmation from 'components/AgeConfirmation';

describe('<AgeConfirmation />', () => {
  it('should modal be present', () => {
    const component = mount(
      <MemoryRouter>
        <AgeConfirmation isOpen />
      </MemoryRouter>
    );

    expect(component.find('Button').length).toEqual(2);
    expect(component.find('Modal').length).toEqual(1);
  });

  it('should modal be present', () => {
    const component = mount(
      <MemoryRouter initialEntries={['/terms-and-conditions']}>
        <AgeConfirmation isOpen />
      </MemoryRouter>
    );

    expect(component.find('Button').length).toEqual(0);
    expect(component.find('Modal').length).toEqual(0);
  });
});
