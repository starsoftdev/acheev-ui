// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { connect } from 'react-redux';
import { history } from 'components/ConnectedRouter';

import Button from 'components/Button';
import PageBanner from 'components/PageBanner';
import ValidationMessage from 'components/ValidationMessage';

import AuthBanner from 'images/banners/auth.jpg';
import { requestLogin } from 'containers/App/sagas';

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

const LP_ROLES = ['business', 'premium', 'pro'];

type Props = {
  location: Object,
  user: Object,
  requestLogin: Function,
  isLoading: boolean,
  error: string,
};

type State = {
  model: {
    username: string,
    password: string,
  },
  error: string,
};

const isLPUser = role => LP_ROLES.indexOf(role) >= 0;

class LpLoginPage extends Component<Props, State> {
  static getDerivedStateFromProps({ user }: Props) {
    if (user && !isLPUser(user.get('role'))) {
      return {
        error: 'You do not have the required permissions to log in.',
      };
    }
    return null;
  }

  state = {
    model: {
      username: '',
      password: '',
    },
    error: '',
  };

  componentDidUpdate() {
    const { user, location } = this.props;
    if (user && isLPUser(user.get('role'))) {
      if (location.query.redirect) {
        history.push(location.query.redirect);
      } else {
        history.push('/lp');
      }
    }
  }

  submitForm = e => {
    this.setState({
      error: '',
    });
    this.props.requestLogin(e, 'lp');
  };

  render() {
    return (
      <div>
        <PageBanner
          bg={AuthBanner}
          title="LP Login"
          titleLarge
          subtitle="Welcome back to LP Dashboard"
        />
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={this.submitForm}
        >
          <div className="row column mb-hg">
            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <label htmlFor="username">Email / Username*</label>
                  <Field
                    className="accent"
                    name="username"
                    id="username"
                    type="text"
                  />
                  <ValidationMessage for="username" />
                </div>
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
              </div>
            </div>
            {(this.props.error || this.state.error) && (
              <div className="text-center c-danger mb-md">
                {this.props.error || this.state.error}
              </div>
            )}
            <div className="text-center mb-md">
              <Button
                className="button secondary spacious"
                type="submit"
                element={Form.Button}
                isLoading={this.props.isLoading}
              >
                sign in
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
  isLoading: state.getIn(['app', 'isLpLoading']),
  error: state.getIn(['app', 'lpError']),
});

const mapDispatchToProps = dispatch => ({
  requestLogin: (payload, type) => dispatch(requestLogin(payload, type)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(LpLoginPage);
