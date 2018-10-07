// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import Routes from './routes';
import './styles.scss';

type Props = {
  match: Object,
};

class Profile extends Component<Props> {
  render() {
    const {
      match: { url },
    } = this.props;
    return (
      <div className="profile">
        <Routes url={url} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

export default connect(
  mapStateToProps,
  null
)(Profile);
