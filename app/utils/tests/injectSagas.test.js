/**
 * Test injectors
 */

import { memoryHistory } from 'react-router-dom';
import { put } from 'redux-saga/effects';
import { shallow } from 'enzyme';
import React from 'react';
import { identity } from 'lodash-es';

import configureStore from '../../configureStore';
import injectSagas from '../injectSagas';
import * as sagaInjectors from '../sagaInjectors';
import * as reducerInjectors from '../reducerInjectors';

// Fixtures
const Component = () => null;
const reducer = identity;

function* testSaga() {
  yield put({ type: 'TEST', payload: 'yup' });
}

describe('injectSagas decorator', () => {
  let store;
  let injectors;
  let ComponentWithSagas;

  beforeAll(() => {
    sagaInjectors.default = jest.fn().mockImplementation(() => injectors);
    reducerInjectors.default = jest.fn().mockImplementation(() => injectors);
  });

  beforeEach(() => {
    store = configureStore({}, memoryHistory);
    injectors = {
      injectSaga: jest.fn(),
      ejectSaga: jest.fn(),
      injectReducer: jest.fn(),
    };
    ComponentWithSagas = injectSagas({
      key: 'test',
      saga: testSaga,
      reducer,
      mode: 'testMode',
    })(Component);
    sagaInjectors.default.mockClear();
    reducerInjectors.default.mockClear();
  });

  it('should inject given saga, mode, and props', () => {
    const props = { test: 'test' };
    shallow(<ComponentWithSagas {...props} />, { context: { store } });

    expect(injectors.injectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.injectSaga).toHaveBeenCalledWith(
      'test',
      { saga: testSaga, mode: 'testMode' },
      props
    );
  });

  it('should inject given saga, mode, and user defined args', () => {
    const props = { testProp: 'test' };
    const args = { argument: 'test' };
    ComponentWithSagas = injectSagas({
      key: 'test',
      saga: testSaga,
      mode: 'testMode',
      args: [args],
    })(Component);
    shallow(<ComponentWithSagas {...props} />, { context: { store } });

    expect(injectors.injectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.injectSaga).toHaveBeenCalledWith(
      'test',
      { saga: testSaga, mode: 'testMode' },
      args
    );
  });

  it('should eject on unmount with a correct saga key', () => {
    const props = { test: 'test' };
    const renderedComponent = shallow(<ComponentWithSagas {...props} />, {
      context: { store },
    });
    renderedComponent.unmount();

    expect(injectors.ejectSaga).toHaveBeenCalledTimes(1);
    expect(injectors.ejectSaga).toHaveBeenCalledWith('test');
  });

  it('should propagate props', () => {
    const props = { testProp: 'test' };
    const renderedComponent = shallow(<ComponentWithSagas {...props} />, {
      context: { store },
    });

    expect(renderedComponent.prop('testProp')).toBe('test');
  });

  it('should inject a given reducer', () => {
    shallow(<ComponentWithSagas />, { context: { store } });

    expect(injectors.injectReducer).toHaveBeenCalledTimes(1);
    expect(injectors.injectReducer).toHaveBeenCalledWith('test', reducer);
  });

  it('should set a correct display name', () => {
    expect(ComponentWithSagas.displayName).toBe('withSagas(Component)');
    expect(injectSagas({ key: 'test', reducer })(() => null).displayName).toBe(
      'withSagas(Component)'
    );
  });
});
