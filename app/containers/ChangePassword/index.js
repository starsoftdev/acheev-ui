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
  password: yup
    .string()
    .min(6, 'minimum password length is 6 characters')
    .required(),
  confirmPassword: yup
    .mixed()
    .test('match', 'Passwords do not match', function comparePasswords(
      confirmPassword
    ) {
      return confirmPassword === this.parent.password;
    })
    .required(),
});

type Props = {
  requestChange: Function,
  location: Object,
  isLoading: boolean,
  success: string,
  error: string,
};

type State = {
  model: {
    password: string,
    confirmPassword: string,
  },
};

class ChangePasswordContainer extends Component<Props, State> {
  state = {
    model: {
      password: '',
      confirmPassword: '',
    },
  };
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Change Password',
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          bg={AuthBanner}
          title="Change Password"
          titleLarge
          subtitle="Enter a new password below."
        />
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e =>
            this.props.requestChange(e, this.props.location.query.token)}
        >
          <div className="row column mb-hg">
            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <label htmlFor="password">Password*</label>
                  <Field
                    className="accent"
                    name="password"
                    id="password"
                    type="password"
                  />
                  <ValidationMessage for="password" />
                </div>
                <div className="mb-lg">
                  <label htmlFor="confirmPassword">Confirm Password*</label>
                  <Field
                    className="accent"
                    name="confirmPassword"
                    id="confirmPassword"
                    type="password"
                  />
                  <ValidationMessage for="confirmPassword" />
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
                Change Password
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default ChangePasswordContainer;
