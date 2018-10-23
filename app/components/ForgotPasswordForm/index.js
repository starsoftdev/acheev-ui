// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';

import Link from 'components/Link';
import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';

import MODAL from 'enum/modals';

import './styles.scss';

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
});

type Props = {
  onCloseModal: Function,
  requestForgotPassword: Function,
  openModal: Function,
  isLoading: boolean,
  error: string,
};

type State = {
  model: {
    email: string,
  },
};

class ForgotPasswordForm extends Component<Props, State> {
  state = {
    model: {
      email: '',
    },
  };
  componentDidUpdate(prevProps: Props) {
    const { isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      this.props.onCloseModal();
      toastr.success(
        '',
        'An email has been sent to the provided email with further instructions'
      );
    }
  }
  render() {
    return (
      <div className="forgotPasswordForm">
        <div className="row column">
          <div className="text-center mb-lg">
            <p className="c-darkest-gray fs-md t-nt">
              Please enter your email address and we&apos;ll send you a link to
              reset your password.
            </p>
          </div>
        </div>
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestForgotPassword(e)}
        >
          <div className="row column">
            <div className="row align-center">
              <div className="small-12 column">
                <div className="mb-md">
                  <Field
                    className="accent"
                    name="email"
                    id="email"
                    type="text"
                    placeholder="Enter email address"
                  />
                  <ValidationMessage for="email" />
                </div>
              </div>
            </div>
            <div className="text-center c-danger mb-md">{this.props.error}</div>
            <div className="text-center mb-md">
              <Button
                className="button forgotPasswordForm__btnSubmit"
                type="submit"
                element={Form.Button}
                isLoading={this.props.isLoading}
              >
                Submit
              </Button>
            </div>
          </div>
        </Form>
        <div className="row column">
          <div className="text-right fs-md mb-md">
            <Link
              className="fs-md t-nt c-darkest-gray"
              onClick={() => this.props.openModal(MODAL.LOGIN_MODAL)}
            >
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default ForgotPasswordForm;
