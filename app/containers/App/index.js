// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';
import { withRouter } from 'react-router';
import { fromJS } from 'immutable';
import injectSagas from 'utils/injectSagas';

import ModalContainer from 'containers/Modal';
import Header from 'containers/Header';
import Footer from 'components/Footer';
import Routes from 'routes';
import PageMeta from 'components/PageMeta';

import saga, {
  reducer,
  requestUser,
  requestIoTPresignedURL,
} from 'containers/App/sagas';
import RealtimeClient from 'utils/realtimeClient';

type Props = {
  user: Object,
  presignedURL: string,
  requestUser: Function,
  requestIoTPresignedURL: Function,
  location: Object,
};

class App extends Component<Props> {
  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.requestUser();
      this.props.requestIoTPresignedURL();
    }
  }
  componentDidUpdate(prevProps: Props) {
    const { presignedURL, user } = this.props;
    if (!prevProps.user && user) {
      this.props.requestIoTPresignedURL();
    }
    if (!prevProps.presignedURL && presignedURL) {
      this.client = new RealtimeClient(
        presignedURL,
        user.get('_id'),
        user.get('username')
      );
      this.client.connect();
    }
  }
  client: Object;
  render() {
    const {
      location: { pathname },
    } = this.props;
    return (
      <div>
        <PageMeta data={fromJS({})} />
        <Header pathname={pathname} />
        <Routes />
        <Footer />
        <ModalContainer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  presignedURL: state.getIn(['app', 'presignedURL']),
});

const mapDispatchToProps = dispatch => ({
  replace: path => dispatch(replace(path)),
  requestUser: () => dispatch(requestUser()),
  requestIoTPresignedURL: () => dispatch(requestIoTPresignedURL()),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
