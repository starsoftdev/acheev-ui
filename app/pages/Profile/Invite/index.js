// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { fromJS } from 'immutable';
import { generate } from 'shortid';

import ValidationMessage from 'components/ValidationMessage';
import Button from 'components/Button';

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

type State = {
  model: {
    email: string,
  },
};

class InvitePage extends Component<{}, State> {
  state = {
    model: {
      email: '',
    },
  };
  sendInvite = (e: Object) => {
    console.log(e); // eslint-disable-line
  };
  render() {
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
                  >
                    Send
                  </Button>
                </div>
                <ValidationMessage for="email" />
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
                {`https://www.acheev.com/referral/userkolbybothe_`}
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

export default InvitePage;
