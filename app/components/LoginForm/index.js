// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import Link from 'components/Link';

import MODAL from 'enum/modals';

import './styles.scss';

const schema = yup.object({
  email: yup.string().required(),
  password: yup.string().required(),
});

type Props = {
  requestLogin: Function,
  openModal: Function,
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
  render() {
    const { isLoading, error, user, showMessage } = this.props;
    return (
      <div className="loginForm">
        <div className="row column">
          <div className="text-center pb-xl">
            <h2 className="c-darkest-gray fs-xl t-nt">Join Acheev</h2>
          </div>
          <div className="text-center mb-sm">
            <Button className="loginForm__btnFacebook purple-blue">
              Continue with Facebook
            </Button>
          </div>
          <div className="text-center mb-mx">
            <Button className="loginForm__btnGoogle light-red">
              Continue with Google
            </Button>
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
            <div className="text-center c-danger mb-md">{error}</div>
            {showMessage &&
              user && (
                <div className="text-center mt-xl">
                  <div className="mb-md">You have successfully registered.</div>
                </div>
              )}
            <div className="text-center mb-md">
              <Button
                className="button loginForm__btnSignup"
                type="submit"
                element={Form.Button}
                isLoading={isLoading}
              >
                Log in
              </Button>
            </div>
          </div>
        </Form>
        <div className="row column">
          <div className="text-center fs-md mb-md">
            By joining I agree to receive emails from Acheev
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
