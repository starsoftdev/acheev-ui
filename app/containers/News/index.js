// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import News from 'components/News';

import type { List } from 'immutable';

type Props = {
  data: List<Object>,
};
class NewsContainer extends Component<Props> {
  render() {
    const { data } = this.props;
    return <News data={data} />;
  }
}

const mapStateToProps = state => ({
  data: state.getIn(['home', 'news']),
});

export default connect(mapStateToProps)(NewsContainer);
