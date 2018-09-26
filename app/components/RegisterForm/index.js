// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import Link from 'components/Link';

import './styles.scss';

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
});

type Props = {
  requestRegisterEmail: Function,
  onCloseModal: Function,
  isLoading: boolean,
  error: string,
  user: Object,
  replace: Function,
  showMessage?: boolean,
  redirectTo?: string,
};

type State = {
  model: Object,
};
class RegisterForm extends Component<Props, State> {
  static defaultProps = {
    showMessage: true,
    redirectTo: '',
    isFromGo: false,
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        email: '',
      },
    };
  }
  componentDidMount() {
    const { redirectTo, user, replace } = this.props;
    if (redirectTo && user) {
      replace(redirectTo);
    }
  }
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
    const { isLoading, error, user, showMessage, redirectTo } = this.props;
    return (
      <div className="registerForm">
        <div className="row column">
          <div className="text-center pb-xl">
            <h2 className="c-darkest-gray fs-xl t-nt">Join Acheev</h2>
          </div>
          <div className="text-center mb-sm">
            <Button className="registerForm__btnFacebook purple-blue">
              Continue with Facebook
            </Button>
          </div>
          <div className="text-center mb-mx">
            <Button className="registerForm__btnGoogle light-red">
              Continue with Google
            </Button>
          </div>
        </div>
        <div className="row align-middle mb-mx">
          <div className="column">
            <hr className="registerForm__divider" />
          </div>
          <div className="column shrink fs-md c-darkest-gray">or</div>
          <div className="column">
            <hr className="registerForm__divider" />
          </div>
        </div>
        <Form
          context={{ user }}
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestRegisterEmail(e)}
        >
          <div className="row column mb-md">
            <div className="row centered mb-lg">
              <div className="small-12 medium-12 column center">
                <div className="register__formField">
                  <Field
                    className="accent text-center"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Enter your email"
                  />
                  <ValidationMessage for="email" />
                </div>
              </div>
            </div>
            <div className="text-center c-danger mb-md">{error}</div>
            {showMessage &&
              user && (
                <div className="text-center mt-xl">
                  <div className="mb-md">You have successfully registered.</div>
                </div>
              )}
            <div className="text-center mb-md">
              <Button
                className="button registerForm__btnSignup"
                type="submit"
                element={Form.Button}
                isLoading={isLoading}
              >
                Sign up
              </Button>
            </div>
          </div>
        </Form>
        <div className="row column">
          <div className="text-center fs-md mb-md">
            By joining I agree to receive emails from Acheev
          </div>
          <hr className="registerForm__divider row column mb-md" />
          <div className="registerForm__loginLink text-center fs-md mb-mn">
            Already a member?&nbsp;
            <Link
              className="fs-md t-nt c-darkest-gray"
              to={redirectTo ? `/login?redirect=${redirectTo}` : '/login'}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default RegisterForm;
