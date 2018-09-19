// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { replace } from 'react-router-redux';

import injectSagas from 'utils/injectSagas';

import Preloader from 'components/Preloader';
import saga, { reducer, confirmToken } from './sagas';

type Props = {
  match: Object,
  confirmToken: Function,
  replace: Function,
  isLoading: boolean,
  error: string,
};

class TokenConfirmation extends Component<Props> {
  componentDidMount() {
    this.props.confirmToken(this.props.match.params.token);
  }
  componentWillReceiveProps(newProps: Props) {
    const { isLoading } = this.props;
    if (isLoading && !newProps.isLoading && !newProps.error) {
      this.props.replace('/change-password');
    }
  }
  render() {
    const { isLoading, error } = this.props;
    return (
      <div>
        {isLoading && <Preloader height={300} />}
        <div className="row column text-center">
          <p className="text-center c-danger">{error}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['tokenConfirmation', 'isLoading']),
  error: state.getIn(['tokenConfirmation', 'error']),
});

const mapDispatchToProps = dispatch => ({
  confirmToken: token => dispatch(confirmToken(token)),
  replace: path => dispatch(replace(path)),
});

export default compose(
  injectSagas({ key: 'tokenConfirmation', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(TokenConfirmation);
