// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import CONFIG from 'conf';
import { toastr } from 'react-redux-toastr';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import Link from 'components/Link';
import SocialButton from 'components/SocialButton';

import MODAL from 'enum/modals';

import './styles.scss';

const schema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
});

type Props = {
  requestLogin: Function,
  requestFBLogin: Function,
  requestGoogleLogin: Function,
  openModal: Function,
  onCloseModal: Function,
  isLoading: boolean,
  error: string,
  user: Object,
  isSocialLoading: boolean,
  socialError: string,
  replace: Function,
  showMessage?: boolean,
  redirectTo?: string,
};

type State = {
  model: Object,
};
class LoginForm extends Component<Props, State> {
  static defaultProps = {
    showMessage: true,
    redirectTo: '',
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        email: '',
        password: '',
      },
    };
  }
  componentDidMount() {
    const { redirectTo, user, replace } = this.props;
    if (redirectTo && user) {
      replace(redirectTo);
    }
  }
  componentDidUpdate() {
    const { user, redirectTo, replace } = this.props;
    if (user) {
      this.props.onCloseModal();
      if (redirectTo) {
        replace(redirectTo);
      } else {
        replace('/');
      }
    }
  }
  handleFBLogin = (user: Object) => {
    const {
      _token: { accessToken },
    } = user;
    this.props.requestFBLogin({ access_token: accessToken });
  };

  handleFBLoginFailure = (err: any) => {
    toastr.error('', JSON.stringify(err));
  };

  handleGoogleLogin = (user: Object) => {
    const {
      _token: { accessToken },
    } = user;
    this.props.requestGoogleLogin({ access_token: accessToken });
  };

  handleGoogleLoginFailure = (err: any) => {
    toastr.error('', JSON.stringify(err));
  };
  render() {
    const {
      isLoading,
      error,
      isSocialLoading,
      socialError,
      user,
      showMessage,
    } = this.props;
    return (
      <div className="loginForm">
        <div className="row column">
          <div className="text-center pb-xl">
            <h2 className="c-darkest-gray fs-xl t-nt">Login to Acheev</h2>
          </div>
          <div className="text-center mb-sm">
            <SocialButton
              provider="facebook"
              appId={CONFIG.FACEBOOK.APP_ID}
              onLoginSuccess={this.handleFBLogin}
              onLoginFailure={this.handleFBLoginFailure}
              className="loginForm__btnFacebook purple-blue"
            >
              Continue with Facebook
            </SocialButton>
          </div>
          <div className="text-center mb-mx">
            <SocialButton
              provider="google"
              appId={CONFIG.GOOGLE.APP_ID}
              onLoginSuccess={this.handleGoogleLogin}
              onLoginFailure={this.handleGoogleLoginFailure}
              className="loginForm__btnGoogle light-red"
            >
              Continue with Google
            </SocialButton>
          </div>
        </div>
        <div className="row align-middle mb-mx">
          <div className="column">
            <hr className="loginForm__divider" />
          </div>
          <div className="column shrink fs-md c-darkest-gray">or</div>
          <div className="column">
            <hr className="loginForm__divider" />
          </div>
        </div>
        <Form
          context={{ user }}
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestLogin(e)}
        >
          <div className="row column mb-md">
            <div className="row centered mb-lg">
              <div className="small-12 medium-12 column center">
                <div className="loginForm__formField mb-md">
                  <Field
                    className="accent text-center"
                    name="email"
                    id="email"
                    type="email"
                    placeholder="Email / Username"
                  />
                  <ValidationMessage for="email" />
                </div>
                <div className="loginForm__formField">
                  <Field
                    className="accent text-center"
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Password"
                  />
                  <ValidationMessage for="password" />
                </div>
              </div>
            </div>
            <div className="text-center c-danger mb-md">{socialError}</div>
            <div className="text-center c-danger mb-md">{error}</div>
            {showMessage &&
              user && (
                <div className="text-center mt-xl">
                  <div className="mb-md">You have successfully registered.</div>
                </div>
              )}
            <div className="text-center mb-md">
              <Button
                className="button loginForm__btnLogin"
                type="submit"
                element={Form.Button}
                isLoading={isLoading || isSocialLoading}
              >
                Log in
              </Button>
            </div>
          </div>
        </Form>
        <div className="row column">
          <div className="text-right fs-md mb-md">
            <Link
              className="fs-md t-nt c-darkest-gray"
              onClick={() => this.props.openModal(MODAL.FORGOT_PASSWORD_MODAL)}
            >
              Forgot Password
            </Link>
          </div>
          <hr className="loginForm__divider row column mb-md" />
          <div className="loginForm__loginLink text-center fs-md mb-mn">
            Not a member yet?&nbsp;
            <Link
              className="fs-md t-nt c-darkest-gray"
              onClick={() => this.props.openModal(MODAL.REGISTER_MODAL)}
            >
              Join now
            </Link>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginForm;
