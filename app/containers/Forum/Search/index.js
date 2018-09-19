// @flow

import React, { Component } from 'react';
import { List } from 'immutable';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';

import ForumSearch from 'components/Forum/Search';

import { requestQuestions } from 'pages/Forum/sagas';

type Props = {
  categories: List<*>,
  questions: Object,
  isLoading: boolean,
  pages: number,
  requestQuestions: Function,
  push: Function,
  slug: string,
  location: Object,
};

class ForumSearchContainer extends Component<Props> {
  render() {
    return <ForumSearch {...this.props} />;
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['forum', 'questions', 'isLoading']),
  questions: state.getIn(['forum', 'questions', 'data', 'hits']),
  pages: parseInt(state.getIn(['forum', 'questions', 'data', 'pages']), 10),
});

const mapDispatchToProps = dispatch => ({
  requestQuestions: filter => dispatch(requestQuestions(filter)),
  push: path => dispatch(push(path)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  ForumSearchContainer
);
