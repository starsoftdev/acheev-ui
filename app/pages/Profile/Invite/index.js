// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { fromJS } from 'immutable';
import { generate } from 'shortid';

import ValidationMessage from 'components/ValidationMessage';
import Button from 'components/Button';

import { requestSendInvite } from 'containers/App/sagas';

import './styles.scss';

const schema = yup.object({
  email: yup.string().required(),
});

const data = fromJS([
  {
    name: 'Jesus Howell',
    value: 'Invite Sent',
    status: 'sent',
  },
  {
    name: 'Myra Colon',
    value: 'Invite Sent',
    status: 'sent',
  },
  {
    name: 'Andrew Greer',
    value: '$100',
    status: 'paid',
  },
  {
    name: 'Louis Burns',
    value: 'Registered',
    status: 'registered',
  },
  {
    name: 'Jeffrey Cohen',
    value: '$50',
    status: 'paid',
  },
  {
    name: 'Jerry Colon',
    value: '$245',
    status: 'paid',
  },
]);

type Props = {
  currentUser: Object,
  isLoading: boolean,
  error: string,
  sendInvite: Function,
};

type State = {
  model: {
    email: string,
  },
};

class InvitePage extends Component<Props, State> {
  state = {
    model: {
      email: '',
    },
  };
  sendInvite = (e: Object) => {
    const emails = e.email
      .split(',')
      .map(email => email.trim())
      .filter(email => email);
    this.props.sendInvite(emails);
  };
  render() {
    const { currentUser, isLoading, error } = this.props;
    return (
      <div className="invite">
        <div className="row mb-xxl">
          <div className="column large-8 large-offset-2 invite__topLine">
            <h1 className="invite__title">
              Invite your friends and get cash back
            </h1>
            <p className="invite__desc text-center">
              Receive up to 50% money back in Acheev services from friends
              purchases
            </p>
          </div>
        </div>
        <div className="row mb-xxl">
          <div className="column large-8 large-offset-2">
            <div className="invite__box">
              <Form
                schema={schema}
                value={this.state.model}
                onChange={model => this.setState({ model })}
                onSubmit={this.sendInvite}
              >
                <div className="invite__fieldWrapper">
                  <Field
                    className="accent invite__field"
                    name="email"
                    id="email"
                    type="text"
                    placeholder="Send email to friends"
                  />
                  <Button
                    className="invite__btnSend button"
                    type="submit"
                    element={Form.Button}
                    isLoading={isLoading}
                  >
                    Send
                  </Button>
                </div>
                <ValidationMessage for="email" />
                {error && <p className="validation__error mt-sm">{error}</p>}
                <p className="invite__desc mt-md ml-mn">
                  Uses commas “,” to sparate several people
                </p>
              </Form>
            </div>
          </div>
        </div>
        <div className="row align-center mb-xxl">
          <div className="column medium-shrink">
            <div className="invite__referralBox">
              <div className="invite__referralLink">
                {`https://www.acheev.com/referral/${currentUser.get(
                  'username'
                )}`}
              </div>
              <Button className="invite__btnCopy">Copy Link</Button>
            </div>
          </div>
        </div>
        <div className="row mb-xxl">
          <div className="column large-8 large-offset-2">
            <h1 className="fs-mx c-darkest-gray">Invite Friends</h1>
            {data &&
              data.map(item => (
                <div className="row nm invite__friend" key={generate()}>
                  <div className="column np invite__friendName">
                    {item.get('name')}
                  </div>
                  <div
                    className={`column np invite__friendStatus invite__friendStatus--${item.get(
                      'status'
                    )}`}
                  >
                    {item.get('value')}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.getIn(['app', 'user']),
  isLoading: state.getIn(['app', 'isLoading']),
  error: state.getIn(['app', 'error']),
});

const mapDispatchToProps = dispatch => ({
  sendInvite: payload => dispatch(requestSendInvite(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(InvitePage);
