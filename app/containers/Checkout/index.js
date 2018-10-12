// @flow

import React, { Component } from 'react';
import yup from 'yup';
import Form, { Field } from 'react-formal';

import Button from 'components/Button';
import Typeahead from 'components/Typeahead';
import ValidationMessage from 'components/ValidationMessage';

import FILTER_OPTIONS from 'enum/filter/options';

import './styles.scss';

const paypalSchema = yup.object({
  cardNumber: yup.string(),
  nameOnCard: yup.string(),
  expiryDate: yup.string(),
  cvv: yup.string(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  address: yup.string().required(),
  country: yup.string().required(),
  city: yup.string().required(),
  postalCode: yup.string().required(),
  phone: yup.string().required(),
});

const creditSchema = yup.object({
  cardNumber: yup.string().required(),
  nameOnCard: yup.string().required(),
  expiryDate: yup.string().required(),
  cvv: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  address: yup.string().required(),
  country: yup.string().required(),
  city: yup.string().required(),
  postalCode: yup.string().required(),
  phone: yup.string().required(),
});

type State = {
  model: Object,
  option: string,
};

class CheckoutContainer extends Component<{}, State> {
  state = {
    model: {
      cardNumber: '',
      nameOnCard: '',
      expiryDate: '',
      cvv: '',
      firstName: '',
      lastName: '',
      address: '',
      country: '',
      city: '',
      postalCode: '',
      phone: '',
    },
    option: 'paypal',
  };
  optionChange = (e: Object) => {
    this.setState({ option: e.target.id });
  };
  render() {
    const { option } = this.state;
    return (
      <div className="checkout row">
        <div className="column large-8">
          <Form
            schema={option === 'paypal' ? paypalSchema : creditSchema}
            value={this.state.model}
            onChange={model => this.setState({ model })}
            // onSubmit={e => this.props.makePayment()}
          >
            <h1 className="checkout__title mb-lg">Payment Type</h1>
            <div className="checkout__section mb-mx">
              <div className="row">
                <div className="column">
                  <div className="mb-tn">
                    <input
                      type="radio"
                      id="paypal"
                      name="paymentOption"
                      checked={option === 'paypal'}
                      onChange={this.optionChange}
                    />
                    <label htmlFor="paypal">PayPal</label>
                  </div>
                  <p className="checkout__optionDesc">
                    You will be redirected to PayPal website to complete your
                    purchase securely.
                  </p>
                </div>
              </div>
            </div>
            <div className="checkout__section mb-xl">
              <div className="row mb-lg">
                <div className="column">
                  <div className="mb-tn">
                    <input
                      type="radio"
                      id="credit"
                      name="paymentOption"
                      checked={option === 'credit'}
                      onChange={this.optionChange}
                    />
                    <label htmlFor="credit">Credit Card</label>
                  </div>
                  <p className="checkout__optionDesc">
                    Safe money transfer using your bank account. Visa, Maestro,
                    Discover, American Express.
                  </p>
                </div>
              </div>
              <div className="row mb-lg">
                <div className="column">
                  <div className="checkout__fieldGroup">
                    <label className="checkout__label" htmlFor="cardNumber">
                      Card Number
                    </label>
                    <Field
                      className="accent"
                      name="cardNumber"
                      id="cardNumber"
                      placeholder="0000 0000 0000 0000"
                    />
                    <ValidationMessage for="cardNumber" />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column large-6">
                  <div className="checkout__fieldGroup">
                    <label className="checkout__label" htmlFor="cardNumber">
                      Name on Card
                    </label>
                    <Field
                      className="accent"
                      name="cardNumber"
                      id="cardNumber"
                    />
                    <ValidationMessage for="cardNumber" />
                  </div>
                </div>
                <div className="column large-3">
                  <div className="checkout__fieldGroup">
                    <label className="checkout__label" htmlFor="cardNumber">
                      Expiry Date
                    </label>
                    <Field
                      className="accent"
                      name="cardNumber"
                      id="cardNumber"
                      placeholder="MM / YY"
                    />
                    <ValidationMessage for="cardNumber" />
                  </div>
                </div>
                <div className="column large-3">
                  <div className="checkout__fieldGroup">
                    <label className="checkout__label" htmlFor="cardNumber">
                      CVV Code
                    </label>
                    <Field
                      className="accent"
                      name="cardNumber"
                      id="cardNumber"
                    />
                    <ValidationMessage for="cardNumber" />
                  </div>
                </div>
              </div>
            </div>
            <h1 className="checkout__title mb-lg">Billing Information</h1>
            <div className="row mb-lg">
              <div className="column">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="firstName">
                    First Name
                  </label>
                  <Field className="accent" name="firstName" id="firstName" />
                  <ValidationMessage for="firstName" />
                </div>
              </div>
              <div className="column">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="lastName">
                    Last Name
                  </label>
                  <Field className="accent" name="lastName" id="lastName" />
                  <ValidationMessage for="lastName" />
                </div>
              </div>
            </div>
            <div className="row mb-lg">
              <div className="column">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="address">
                    Address
                  </label>
                  <Field className="accent" name="address" id="address" />
                  <ValidationMessage for="address" />
                </div>
              </div>
            </div>
            <div className="row mb-lg">
              <div className="column">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="country">
                    Country
                  </label>
                  <Typeahead
                    className="large"
                    value={this.state.model.country}
                    clearable={false}
                    options={FILTER_OPTIONS.COUNTRY_OPTIONS}
                    placeholder="Select country"
                    sortAlphabetically={false}
                    onChange={e => {
                      this.setState(state => ({
                        model: {
                          ...state.model,
                          country: e.value,
                        },
                      }));
                    }}
                  />
                  <ValidationMessage for="country" />
                </div>
              </div>
              <div className="column">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="city">
                    City
                  </label>
                  <Field className="accent" name="city" id="city" />
                  <ValidationMessage for="city" />
                </div>
              </div>
            </div>
            <div className="row mb-lg">
              <div className="column">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="postalCode">
                    Postal Code
                  </label>
                  <Field className="accent" name="postalCode" id="postalCode" />
                  <ValidationMessage for="postalCode" />
                </div>
              </div>
              <div className="column">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="phone">
                    Phone
                  </label>
                  <Field className="accent" name="phone" id="phone" />
                  <ValidationMessage for="phone" />
                </div>
              </div>
            </div>
            <div className="row align-right">
              <div className="column shrink">
                <Button
                  className="button primary t-uppercase"
                  type="submit"
                  element={Form.Button}
                >
                  Submit Payment
                </Button>
              </div>
            </div>
          </Form>
        </div>
        <div className="column large-4" />
      </div>
    );
  }
}

export default CheckoutContainer;
