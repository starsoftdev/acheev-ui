// @flow

import React, { Component, Fragment } from 'react';
import { compose } from 'redux';

import injectSagas from 'utils/injectSagas';

import MessageContainer from 'containers/Message';

import saga, { reducer } from 'containers/Message/sagas';

class MessagePage extends Component<{}> {
  render() {
    return (
      <Fragment>
        <MessageContainer />
      </Fragment>
    );
  }
}

export default compose(injectSagas({ key: 'message', saga, reducer }))(
  MessagePage
);
