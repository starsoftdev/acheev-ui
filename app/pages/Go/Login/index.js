// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { connect } from 'react-redux';
import { history } from 'components/ConnectedRouter';
import { fromJS } from 'immutable';

import Button from 'components/Button';
import Breadcrumbs from 'components/Breadcrumbs';
import PageBanner from 'components/PageBanner';
import ValidationMessage from 'components/ValidationMessage';
import BorderedTitle from 'components/BorderedTitle';
import Link from 'components/Link';

import { requestLogin, trackGoStep1 } from 'containers/App/sagas';

const schema = yup.object({
  username: yup.string().required(),
  password: yup.string().required(),
});

type Props = {
  user: Object,
  requestLogin: Function,
  trackGoStep1: Function,
  isLoading: boolean,
  error: string,
};

type State = {
  model: {
    username: string,
    password: string,
  },
};

class LoginPage extends Component<Props, State> {
  state = {
    model: {
      username: '',
      password: '',
    },
  };
  componentDidMount() {
    if (this.props.user) {
      this.go();
    }
  }
  componentDidUpdate({ user }: Props) {
    if (this.props.user && !user) {
      this.go();
    }
  }
  go() {
    history.push('/go');
    this.props.trackGoStep1();
  }
  render() {
    const breadcrumbPath = fromJS([
      {
        link: '',
        title: 'Go',
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <PageBanner
          responsiveBg
          title="Write a review"
          subtitle="Start by signing up or logging in below"
        />
        <BorderedTitle
          element="h2"
          className="createReviewCardList__borderedTitle"
          centered
        >
          Log In
        </BorderedTitle>
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestLogin(e)}
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
            <div className="text-center mb-md">
              <Button
                className="button secondary spacious"
                type="submit"
                element={Form.Button}
                isLoading={this.props.isLoading}
              >
                Log in now
              </Button>
            </div>
            <div className="text-center c-danger mb-md">{this.props.error}</div>
            <div className="text-center">
              <Link to="/go/register">
                {"Don't have an account? Sign up here"}
              </Link>
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
  requestLogin: payload => dispatch(requestLogin(payload)),
  trackGoStep1: () => dispatch(trackGoStep1()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginPage);
