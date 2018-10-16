// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';

import injectSagas from 'utils/injectSagas';

import { history } from 'components/ConnectedRouter';
import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';

import saga, { reducer, requestResetPassword } from './sagas';

import './styles.scss';

const schema = yup.object({
  newPassword: yup
    .string()
    .min(6, 'minimum password length is 6 characters')
    .required(),
  verifyPassword: yup
    .mixed()
    .test('match', 'Passwords do not match', function comparePasswords(
      verifyPassword
    ) {
      return verifyPassword === this.parent.newPassword;
    })
    .required(),
});

type Props = {
  requestResetPassword: Function,
  isLoading: boolean,
  success: string,
  error: string,
  match: Object,
};

type State = {
  model: {
    newPassword: string,
    verifyPassword: string,
  },
};

class ResetPassword extends Component<Props, State> {
  state = {
    model: {
      newPassword: '',
      verifyPassword: '',
    },
  };
  componentDidUpdate(prevProps: Props) {
    const { isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      history.push('/');
    }
  }
  render() {
    const {
      match: {
        params: { token },
      },
    } = this.props;
    return (
      <div className="resetPassword">
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestResetPassword(e, token)}
        >
          <div className="row column mt-xl mb-hg">
            <div className="text-center pb-xl">
              <h2 className="c-darkest-gray fs-xl t-nt">Reset Password</h2>
            </div>
            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <Field
                    className="accent"
                    name="newPassword"
                    id="newPassword"
                    type="password"
                    placeholder="Enter your password"
                  />
                  <ValidationMessage for="newPassword" />
                </div>
                <div className="mb-lg">
                  <Field
                    className="accent"
                    name="verifyPassword"
                    id="verifyPassword"
                    type="password"
                    placeholder="Re-enter your password"
                  />
                  <ValidationMessage for="verifyPassword" />
                </div>
              </div>
            </div>
            <div className="text-center c-primary mb-md">
              {this.props.success}
            </div>
            <div className="text-center c-danger mb-md">{this.props.error}</div>
            <div className="row align-center">
              <div className="small-12 medium-6 column mb-hg">
                <Button
                  className="resetPassword__btnChange button"
                  type="submit"
                  element={Form.Button}
                  isLoading={this.props.isLoading}
                >
                  Reset Password
                </Button>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['resetPassword', 'isLoading']),
  error: state.getIn(['resetPassword', 'error']),
  success: state.getIn(['resetPassword', 'success']),
});

const mapDispatchToProps = dispatch => ({
  requestResetPassword: (payload, token) =>
    dispatch(requestResetPassword(payload, token)),
});

export default compose(
  injectSagas({ key: 'resetPassword', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ResetPassword);
