// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { Link } from 'react-router-dom';

import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import ValidationMessage from 'components/ValidationMessage';

const schema = yup.object({
  firstName: yup.string(),
  lastName: yup.string(),
  email: yup
    .string()
    .email()
    .required(),
  phone: yup.string(),
  accredited: yup
    .boolean()
    .oneOf([true], 'You must confirm that you are accredited investor.'),
});

type Props = {
  registerInvestor: Function,
  isLoading: boolean,
  error: string,
};

type State = {
  model: Object,
  msg: string,
};
class InvestorSignUpForm extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        fname: '',
        lname: '',
        email: '',
        phone: '',
        accredited: false,
      },
      msg: '',
    };
  }
  componentWillReceiveProps(newProps: Props) {
    if (this.props.isLoading && !newProps.isLoading && !newProps.error) {
      this.setState({
        model: {
          fname: '',
          lname: '',
          email: '',
          phone: '',
          accredited: false,
        },
        msg: 'You have successfully registered.',
      });
    }
  }
  render() {
    const { isLoading, error } = this.props;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={model => this.setState({ model })}
        onSubmit={e => this.props.registerInvestor(e)}
      >
        <div className="row column">
          <div className="text-center">
            <h2 className="c-white t-nt">Want to learn more?</h2>
            <h2 className="c-white fs-xl">Sign Up for Lift Investor Alerts</h2>
          </div>
          <div className="row centered mb-lg">
            <div className="column small-12 medium-5 medium-offset-1">
              <label className="fs-sm c-white" htmlFor="fname">
                First Name
              </label>
              <Field
                className="accent"
                name="firstName"
                id="firstName"
                type="text"
              />
              <ValidationMessage for="firstName" />
            </div>
            <div className="column small-12 medium-5">
              <label className="fs-sm c-white" htmlFor="lastName">
                Last Name
              </label>
              <Field
                className="accent"
                name="lastName"
                id="lastName"
                type="text"
              />
              <ValidationMessage for="lastName" />
            </div>
          </div>
          <div className="row centered mb-lg">
            <div className="column small-12 medium-5 medium-offset-1">
              <label className="fs-sm c-white" htmlFor="email">
                Email address*
              </label>
              <Field className="accent" name="email" id="email" type="email" />
              <ValidationMessage for="email" />
            </div>
            <div className="column small-12 medium-5">
              <label className="fs-sm c-white" htmlFor="phone">
                Phone Number
              </label>
              <Field className="accent" name="phone" id="phone" type="text" />
              <ValidationMessage for="phone" />
            </div>
          </div>
          <h2 className="fs-lg c-white text-center">
            Are you an Accredited Investor? Check the box below.
          </h2>
          <div className="text-center mb-xl">
            <Checkbox
              className="c-white"
              element={Field}
              id="accredited"
              name="accredited"
            >
              Yes, I am an Accredited Investor.*
            </Checkbox>
            <ValidationMessage for="accredited" />
          </div>
          <div className="text-center c-danger mb-md">{error}</div>
          <p className="c-white text-center mb-xl">
            If you are unsure if you are an Accredited Investor, please review
            the definition outlined on the&nbsp;
            <a
              href="http://www.osc.gov.on.ca/documents/en/Securities-Category4/ni_20170401_45-106_unofficial-consolidation.pdf"
              target="_blank"
            >
              Ontario Securities Commission&nbsp;
            </a>
            website. By submitting your email address, you acknowledge and agree
            to Lift’s&nbsp;
            <Link to="/privacy">Privacy Policy</Link>
            &nbsp;and&nbsp;
            <Link to="/terms-and-conditions">Terms and Conditions.&nbsp;</Link>
            You can unsubscribe at any time by contacting us.
          </p>
          <div className="text-center">
            <Button
              className="button light-green spacious"
              type="submit"
              element={Form.Button}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </div>
          <div className="text-center mt-xl">
            <div className="mb-md c-white">{this.state.msg}</div>
          </div>
        </div>
      </Form>
    );
  }
}

export default InvestorSignUpForm;
