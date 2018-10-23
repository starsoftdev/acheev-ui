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

import saga, { reducer, requestUser } from 'containers/App/sagas';

type Props = {
  user: Object,
  requestUser: Function,
  location: Object,
};

class App extends Component<Props> {
  componentDidMount() {
    const { user } = this.props;
    if (user) {
      this.props.requestUser();
    }
  }
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
});

const mapDispatchToProps = dispatch => ({
  replace: path => dispatch(replace(path)),
  requestUser: () => dispatch(requestUser()),
});

export default compose(
  withRouter,
  injectSagas({ key: 'app', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(App);
