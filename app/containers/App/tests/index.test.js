import React from 'react';
import { mount } from 'enzyme';
import { Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from 'configureStore';
import { MemoryRouter } from 'react-router';

import Header from 'components/Header';
import Footer from 'components/Footer';
import App from '../index';

const initialState = {};
const history = createHistory();
const store = configureStore(initialState, history);

jest.mock('scroll-to-element', () => 'scroll-to-element');

const Component = () => (
  <Provider store={store}>
    <MemoryRouter>
      <App />
    </MemoryRouter>
  </Provider>
);

describe('<App />', () => {
  it('should render Header', () => {
    const renderedComponent = mount(<Component />);
    expect(renderedComponent.find(Header).length).toBe(1);
  });

  it('should render some routes', () => {
    const renderedComponent = mount(<Component />);
    expect(renderedComponent.find(Route).length).not.toBe(0);
  });

  it('should render Footer', () => {
    const renderedComponent = mount(<Component />);
    expect(renderedComponent.find(Footer).length).toBe(1);
  });
});
