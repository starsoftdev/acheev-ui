// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { cloneDeep } from 'lodash-es';

import Button from 'components/Button';
import CustomSelect from 'components/CustomSelect';
import Checkbox from 'components/Checkbox';
import ValidationMessage from 'components/ValidationMessage';
import FormModal from 'components/FormModal';
import Link from 'components/Link';

import terms from 'pages/TermsAndConditions/terms';
import privacy from 'pages/Privacy/privacy';
import {
  USERNAME_SCHEMA,
  USERNAME_MIN_CHAR,
  USERNAME_MAX_CHAR,
  MAGAZINE_REFERRER_OPTIONS,
} from 'enum/constants';

const schema = yup.object({
  username: USERNAME_SCHEMA,
  email: yup
    .string()
    .email()
    .required(),
  password: yup
    .string()
    .min(6, 'minimum password length is 6 characters')
    .required(),
  magazineReferrer: yup.string(),
  terms: yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
  newsletters: yup.boolean(),
});

type Props = {
  requestRegister: Function,
  isLoading: boolean,
  error: string,
  user: Object,
  replace: Function,
  showMessage?: boolean,
  showMagazineReferrer?: boolean,
  setUsernameWithEmail?: boolean,
  redirectTo?: string,
  isFromGo?: boolean,
};

type State = {
  model: Object,
};
class RegisterForm extends Component<Props, State> {
  static defaultProps = {
    showMagazineReferrer: false,
  };
  constructor(props: Props) {
    super(props);
    if (props.showMagazineReferrer) {
      this.state = {
        model: {
          username: '',
          email: '',
          password: '',
          magazineReferrer: MAGAZINE_REFERRER_OPTIONS[0].value,
          terms: false,
        },
      };
    } else {
      this.state = {
        model: {
          username: '',
          email: '',
          password: '',
          terms: false,
        },
      };
    }
  }
  componentDidMount() {
    const { redirectTo, user, replace } = this.props;
    if (redirectTo && user) {
      replace(redirectTo);
    }
  }
  componentDidUpdate() {
    const { redirectTo, user, replace } = this.props;
    if (redirectTo && user) {
      replace(redirectTo);
    }
  }
  setUsernameWithEmail(email: string) {
    if (this.props.user) return;
    const model = cloneDeep(this.state.model);
    model.username = email.split('@')[0];
    this.setState({ model });
  }
  render() {
    const {
      isLoading,
      error,
      user,
      showMessage = true,
      setUsernameWithEmail,
      showMagazineReferrer,
      redirectTo = '',
      isFromGo = false,
    } = this.props;
    const metaType = isFromGo ? 'go' : null;
    return (
      <Form
        context={{ user }}
        schema={schema}
        value={this.state.model}
        onChange={model => this.setState({ model })}
        onSubmit={e => this.props.requestRegister(e, metaType)}
      >
        <div className="row column mb-md">
          <div className="text-center">
            <h2 className="c-darkest-gray t-nt">Sign Up Now!</h2>
          </div>
          <div className="text-center fs-mx mb-mn">
            Already a member?&nbsp;
            <Link
              className="fs-mx t-nt"
              to={redirectTo ? `/login?redirect=${redirectTo}` : '/login'}
            >
              Login
            </Link>
          </div>
          <div className="row centered mb-lg">
            <div className="small-12 medium-8 medium-offset-2 column center">
              <div className="register__formField">
                <label htmlFor="email">Email address*</label>
                <Field
                  className="accent"
                  name="email"
                  id="email"
                  type="email"
                  onChange={email =>
                    setUsernameWithEmail && this.setUsernameWithEmail(email)
                  }
                />
                <div className="fs-tn">
                  We’ll never share your email publicly
                </div>
                <ValidationMessage for="email" />
              </div>
              <div className="register__formField">
                <label htmlFor="username">Username*</label>
                <Field
                  className="accent"
                  name="username"
                  id="username"
                  type="text"
                />
                <div className="fs-tn">
                  A unique name between {USERNAME_MIN_CHAR} and
                  {USERNAME_MAX_CHAR} characters
                </div>
                <ValidationMessage for="username" />
              </div>
              <div className="register__formField">
                <label htmlFor="password">Password*</label>
                <Field
                  className="accent"
                  name="password"
                  id="password"
                  type="password"
                />
                <div className="fs-tn">At least 6 characters</div>
                <ValidationMessage for="password" />
              </div>
              {showMagazineReferrer && (
                <div className="register__formField">
                  <label htmlFor="gender">
                    How did you receive your copy of lift magazine?
                  </label>
                  <CustomSelect
                    className="large"
                    value={this.state.model.magazineReferrer}
                    clearable={false}
                    options={MAGAZINE_REFERRER_OPTIONS}
                    onChange={e => {
                      this.setState({
                        model: {
                          ...this.state.model,
                          magazineReferrer: e.value,
                        },
                      });
                    }}
                  />
                  <Field
                    className="hide"
                    name="magazineReferrer"
                    id="magazineReferrer"
                  />
                  <ValidationMessage for="magazineReferrer" />
                </div>
              )}
            </div>
          </div>
          <div className="row">
            <div className="medium-6 medium-offset-3 column">
              <div className="mb-tn">
                <Checkbox
                  className="align-center"
                  element={Field}
                  id="terms"
                  name="terms"
                  clickableText={
                    <span>
                      <FormModal
                        linkText="Terms and Conditions"
                        textIsButton={false}
                        title="Lift Terms and Conditions"
                        isOpen={false}
                      >
                        <div
                          className="mb-lg"
                          dangerouslySetInnerHTML={{ __html: terms }}
                        />
                      </FormModal>{' '}
                      <label htmlFor="terms" className="checkbox__label npr">
                        and
                      </label>{' '}
                      <FormModal
                        linkText="Privacy Policy"
                        textIsButton={false}
                        isOpen={false}
                      >
                        <div
                          className="mb-lg"
                          dangerouslySetInnerHTML={{
                            __html: privacy,
                          }}
                        />
                      </FormModal>
                    </span>
                  }
                >
                  You have read and agree to
                </Checkbox>
                <ValidationMessage for="terms" />
              </div>
              <div className="mb-xl">
                <Checkbox
                  className="align-center"
                  element={Field}
                  id="newsletters"
                  name="newsletters"
                >
                  <div>
                    {`You agree to receive Lift's newsletters and marketing
                    communications`}
                  </div>
                  <div>containing news, updates and other promotions.</div>
                </Checkbox>
                <ValidationMessage for="newsletters" />
              </div>
            </div>
          </div>
          <div className="text-center c-danger mb-md">{error}</div>
          <div className="text-center">
            <Button
              className="button secondary spacious"
              type="submit"
              element={Form.Button}
              isLoading={isLoading}
            >
              Register now
            </Button>
          </div>
          {showMessage &&
            user && (
              <div className="text-center mt-xl">
                <div className="mb-md">You have successfully registered.</div>
              </div>
            )}
        </div>
      </Form>
    );
  }
}

export default RegisterForm;
