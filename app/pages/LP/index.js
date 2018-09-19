// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import injectSagas from 'utils/injectSagas';
import saga, { reducer, requestBusinesses } from 'pages/LP/sagas';
import Routes from './routes';

type Props = {
  user: Object,
  requestBusinesses: Function,
  match: Object,
};

class LpPage extends Component<Props> {
  componentWillMount() {
    const { user } = this.props;
    this.props.requestBusinesses(user.get('id'));
  }

  render() {
    return <Routes url={this.props.match.url} />;
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinesses: (id, query) => dispatch(requestBusinesses(id, query)),
});

export default compose(
  injectSagas({ key: 'lp', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(LpPage);
