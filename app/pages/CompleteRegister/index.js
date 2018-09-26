// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import Link from 'components/Link';

import { requestRegister } from 'containers/App/sagas';

import './styles.scss';

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

type Props = {
  location: Object,
  user: Object,
  requestRegister: Function,
  isLoading: boolean,
  error: string,
  push: Function,
  match: Object,
};

type State = {
  model: {
    username: string,
    password: string,
  },
};

class CompleteRegisterPage extends Component<Props, State> {
  state = {
    model: {
      username: '',
      password: '',
    },
  };
  componentDidUpdate() {
    const { user, location } = this.props;
    if (user) {
      if (location.query.redirect) {
        this.props.push(location.query.redirect);
      } else {
        this.props.push('/');
      }
    }
  }
  render() {
    const {
      match: {
        params: { token },
      },
    } = this.props;
    return (
      <div className="completeRegister">
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestRegister(e, token)}
        >
          <div className="row column mt-xl mb-hg">
            <div className="text-center pb-xl">
              <h2 className="c-darkest-gray fs-xl t-nt">Join Acheev</h2>
            </div>
            <div className="row align-center">
              <div className="small-12 medium-6 column">
                <div className="mb-lg">
                  <Field
                    className="accent"
                    name="username"
                    id="username"
                    type="text"
                    placeholder="Choose a Username"
                  />
                  <ValidationMessage for="username" />
                </div>
                <div className="mb-lg">
                  <Field
                    className="accent"
                    name="password"
                    id="password"
                    type="password"
                    placeholder="Choose a Password"
                  />
                  <ValidationMessage for="password" />
                </div>
              </div>
            </div>
            {this.props.error && (
              <div className="text-center c-danger mb-md">
                {this.props.error}
              </div>
            )}
            <div className="row align-center">
              <div className="small-12 medium-6 column mb-md">
                <Button
                  className="completeRegister__btnJoin button"
                  type="submit"
                  element={Form.Button}
                  isLoading={this.props.isLoading}
                >
                  Join
                </Button>
              </div>
            </div>
            <div className="row align-center">
              <div className="c-darkest-gray text-center fs-md mb-hg">
                By joining, you agree to Acheev&apos;s&nbsp;
                <Link className="fs-md t-nt c-darkest-gray">
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestRegister: (payload, token) =>
    dispatch(requestRegister(payload, token)),
  push: path => dispatch(push(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
  null,
  { pure: false }
)(CompleteRegisterPage);
