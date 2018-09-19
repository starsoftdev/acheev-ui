// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';

import injectSagas from 'utils/injectSagas';
import saga, { reducer, requestChange } from 'containers/ChangePassword/sagas';

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

class ChangePassword extends Component<Props, State> {
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
            this.props.requestChange(e, this.props.location.query.token)
          }
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

const mapStateToProps = state => ({
  isLoading: state.getIn(['changePassword', 'isLoading']),
  error: state.getIn(['changePassword', 'error']),
  success: state.getIn(['changePassword', 'success']),
});

const mapDispatchToProps = dispatch => ({
  requestChange: (payload, token) => dispatch(requestChange(payload, token)),
});

export default compose(
  injectSagas({ key: 'changePassword', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(ChangePassword);
