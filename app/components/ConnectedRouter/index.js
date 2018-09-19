// @flow

import * as React from 'react';
import { Provider } from 'react-redux';
import createHistory from 'history/createBrowserHistory';
import configureStore from 'configureStore';
import { ConnectedRouter } from 'react-router-redux';

// Create redux store with history
const initialState = {};
export const history = createHistory();
const store = configureStore(initialState, history);

type Props = {
  children: any,
};

const CustomConnectedRouter = ({ children }: Props) => (
  <Provider store={store}>
    <ConnectedRouter history={history}>{children}</ConnectedRouter>
  </Provider>
);

export default CustomConnectedRouter;
