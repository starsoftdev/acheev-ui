// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { replace } from 'react-router-redux';
import type { Map } from 'immutable';

import Header from 'components/Header';

import {
  logout,
  openNavbar,
  closeNavbar,
  requestGlobalSearch,
  requestPageMeta,
  openModal,
  clearGlobalSearch,
} from 'containers/App/sagas';

type Props = {
  user: Object,
  logout: Function,
  replace: Function,
  openNavbar: Function,
  closeNavbar: Function,
  globalSearchFilter: Map<*, *>,
  globalSearchData: Map<string, Object>,
  isGlobalSearchLoading: boolean,
  navbarOpen: boolean,
  requestGlobalSearch: Function,
  openModal: Function,
  clearGlobalSearch: Function,
  pathname: string,
};

class HeaderContainer extends Component<Props> {
  render() {
    const {
      user,
      globalSearchData,
      globalSearchFilter,
      isGlobalSearchLoading,
      navbarOpen,
      pathname,
    } = this.props;
    return (
      <Header
        user={user}
        logout={this.props.logout}
        openNavbar={this.props.openNavbar}
        closeNavbar={this.props.closeNavbar}
        replace={this.props.replace}
        pathname={pathname}
        globalSearchData={globalSearchData}
        globalSearchFilter={globalSearchFilter}
        isGlobalSearchLoading={isGlobalSearchLoading}
        navbarOpen={navbarOpen}
        requestGlobalSearch={this.props.requestGlobalSearch}
        openModal={this.props.openModal}
        clearGlobalSearch={this.props.clearGlobalSearch}
      />
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  navbarOpen: state.getIn(['app', 'navbarOpen']),
  globalSearchFilter: state.getIn(['app', 'globalSearch', 'filter']),
  globalSearchData: state.getIn(['app', 'globalSearch', 'data']),
  isGlobalSearchLoading: state.getIn(['app', 'globalSearch', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  logout: type => dispatch(logout(type)),
  replace: path => dispatch(replace(path)),
  openNavbar: () => dispatch(openNavbar()),
  closeNavbar: () => dispatch(closeNavbar()),
  requestGlobalSearch: (path, value) =>
    dispatch(requestGlobalSearch(path, value)),
  requestPageMeta: url => dispatch(requestPageMeta(url)),
  openModal: modal => dispatch(openModal(modal)),
  clearGlobalSearch: () => dispatch(clearGlobalSearch()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HeaderContainer);
