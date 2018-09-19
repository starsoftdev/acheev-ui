import React from 'react';
import { shallow } from 'enzyme';
import ReactModal from 'react-modal';

import FormModal from 'components/FormModal';

describe('<FormModal />', () => {
  it('should render title', () => {
    const renderedComponent = shallow(<FormModal title="Hey" />);
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });

  it('should pass isOpen to ReactModal', () => {
    const renderedComponent = shallow(<FormModal isOpen />);
    expect(renderedComponent.find(ReactModal).prop('isOpen')).toEqual(true);
  });

  it('should render promptText', () => {
    const renderedComponent = shallow(<FormModal promptText="Hey" />);
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });

  it('should render linkText', () => {
    const renderedComponent = shallow(<FormModal linkText="Hey" />);
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });

  it('should apply buttonClassName', () => {
    const renderedComponent = shallow(
      <FormModal textIsButton buttonClassName="hey" />
    );
    expect(renderedComponent.find('Button').hasClass('hey')).toEqual(true);
  });

  it('should apply linkClassName', () => {
    const renderedComponent = shallow(
      <FormModal textIsButton linkClassName="hey" />
    );
    expect(renderedComponent.find('Button').hasClass('hey')).toEqual(true);
  });

  it('should apply buttonClassName if both `buttonClassName` and `linkClassName` are specified', () => {
    const renderedComponent = shallow(
      <FormModal textIsButton linkClassName="hey" buttonClassName="ho" />
    );
    expect(renderedComponent.find('Button').hasClass('ho')).toEqual(true);
  });

  it('unlockFunction should be fired when `formModal__unlockButton` is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<FormModal unlockFunction={spy} />);
    renderedComponent.find('.formModal__unlockButton').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('submitFunction should be fired when `formModal__submitButton` is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<FormModal submitFunction={spy} />);
    renderedComponent.find('.formModal__submitButton').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('onCloseModal should be fired when `formModal__closeButton` is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(<FormModal onCloseModal={spy} />);
    renderedComponent.find('.formModal__closeButton').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('onOpenModal should be fired when link is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <FormModal onOpenModal={spy} linkClassName="hey" />
    );
    renderedComponent.find('.hey').simulate('click');
    expect(spy).toHaveBeenCalled();
  });

  it('should render its children', () => {
    const renderedComponent = shallow(<FormModal>Hey</FormModal>);
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });
});
