// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { fromJS } from 'immutable';

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

class ResetPasswordContainer extends Component<Props, State> {
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

export default ResetPasswordContainer;
