// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import injectSagas from 'utils/injectSagas';
import saga, { reducer, requestReset } from 'containers/ResetPassword/sagas';

import Button from 'components/Button';
import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import ValidationMessage from 'components/ValidationMessage';

import AuthBanner from 'images/banners/auth.jpg';

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
});

type Props = {
  requestReset: Function,
  isLoading: boolean,
  success: string,
  error: string,
};

type State = {
  model: {
    email: string,
  },
};

class ResetPassword extends Component<Props, State> {
  state = {
    model: {
      email: '',
    },
  };
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Reset Password',
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={AuthBanner}
          title="Reset Password"
          titleLarge
          subtitle="Enter your email and we'll send you a reset password confirmation."
        />
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestReset(e)}
        >
          <div className="row column mb-hg">
            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <label htmlFor="email">Email*</label>
                  <Field
                    className="accent"
                    name="email"
                    id="email"
                    type="text"
                  />
                  <ValidationMessage for="email" />
                </div>
              </div>
            </div>
            <div className="text-center c-primary mb-md">
              {this.props.success}
            </div>
            <div className="text-center c-danger mb-md">{this.props.error}</div>
            <div className="text-center mb-md">
              <Button
                className="button secondary spacious"
                type="submit"
                element={Form.Button}
                isLoading={this.props.isLoading}
              >
                Reset Password
              </Button>
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
  requestReset: payload => dispatch(requestReset(payload)),
});

export default compose(
  injectSagas({ key: 'resetPassword', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ResetPassword);
