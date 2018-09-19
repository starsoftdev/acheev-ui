// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import MemberProfile from 'components/MemberProfile';

type Props = {
  profile: Map<string, string>,
};

class MemberProfilePage extends Component<Props> {
  render() {
    const { profile } = this.props;
    return <MemberProfile data={profile} />;
  }
}

const mapStateToProps = state => ({
  profile: state.getIn(['memberProfile', 'profile', 'data']),
});

export default connect(mapStateToProps)(MemberProfilePage);
