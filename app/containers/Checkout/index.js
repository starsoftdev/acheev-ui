// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import braintree from 'braintree-web';

import { history } from 'components/ConnectedRouter';
import Button from 'components/Button';

import { requestClientToken, requestPayment } from 'containers/Checkout/sagas';

import './styles.scss';

type Props = {
  checkout: Object,
  clientToken: string,
  isPaymentSending: boolean,
  paymentError: string,
  requestClientToken: Function,
  requestPayment: Function,
};

type State = {
  option: string,
  braintreeError: '',
};

class CheckoutContainer extends Component<Props, State> {
  state = {
    option: 'credit',
    braintreeError: '',
  };
  componentDidMount() {
    if (!this.props.checkout) {
      history.push('/');
    }
    this.props.requestClientToken();
  }
  componentDidUpdate(prevProps: Props) {
    if (this.props.clientToken && !this.hostedFieldsInstance) {
      braintree.client
        .create({
          authorization: this.props.clientToken,
        })
        .then(clientInstance =>
          braintree.hostedFields.create({
            client: clientInstance,
            fields: {
              number: {
                selector: '#cardNumber',
                placeholder: '4111 1111 1111 1111',
              },
              cvv: {
                selector: '#cvv',
                placeholder: '123',
              },
              expirationDate: {
                selector: '#expirationDate',
                placeholder: '10/2019',
              },
            },
          })
        )
        .then(hostedFieldsInstance => {
          this.hostedFieldsInstance = hostedFieldsInstance;
        })
        .catch(err => {
          this.setState({ braintreeError: err.message });
        });
    }
    if (
      prevProps.isPaymentSending &&
      !this.props.isPaymentSending &&
      !this.props.paymentError
    ) {
      history.push('/messages');
    }
  }
  optionChange = (e: Object) => {
    this.setState({ option: e.target.id });
  };
  makePayment = () => {
    const { checkout } = this.props;
    let orderPrice = checkout && checkout.get('price');
    if (checkout && checkout.get('extra_services')) {
      checkout.get('extra_services').map(extra => {
        orderPrice += extra.get('price');
        return extra;
      });
    }
    this.hostedFieldsInstance
      .tokenize()
      .then(payload => {
        const data = {
          amount: orderPrice,
          payment_method_nonce: payload.nonce,
          to: checkout.getIn(['user', '_id']),
        };
        this.props.requestPayment(data);
      })
      .catch(err => {
        this.setState({ braintreeError: err.message });
      });
  };
  hostedFieldsInstance: Object;
  render() {
    const { checkout, isPaymentSending, paymentError } = this.props;
    const { option, braintreeError } = this.state;
    let orderPrice = checkout && checkout.get('price');
    if (checkout && checkout.get('extra_services')) {
      checkout.get('extra_services').map(extra => {
        orderPrice += extra.get('price');
        return extra;
      });
    }
    return (
      <div className="checkout row">
        <div className="column large-8 checkout__form">
          <h1 className="checkout__title mb-lg">Payment Type</h1>
          <div className="checkout__section mb-xl">
            <div className="row mb-lg">
              <div className="column">
                <div className="mb-tn">
                  <input
                    type="radio"
                    id="paypal"
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
                  <div id="cardNumber" className="checkout__field" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="column large-3">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="expirationDate">
                    Expiry Date
                  </label>
                  <div id="expirationDate" className="checkout__field" />
                </div>
              </div>
              <div className="column large-3">
                <div className="checkout__fieldGroup">
                  <label className="checkout__label" htmlFor="cvv">
                    CVV Code
                  </label>
                  <div id="cvv" className="checkout__field" />
                </div>
              </div>
            </div>
            {braintreeError && (
              <div className="c-danger mt-md">{braintreeError}</div>
            )}
            {paymentError && (
              <div className="c-danger mt-md">{paymentError}</div>
            )}
          </div>
          <div className="row align-right">
            <div className="column shrink">
              <Button
                className="button primary t-uppercase"
                type="submit"
                onClick={this.makePayment}
                isLoading={isPaymentSending}
              >
                Submit Payment
              </Button>
            </div>
          </div>
        </div>
        <div className="column large-4 checkout__summary">
          <h1 className="checkout__title mb-lg">Summary</h1>
          <div className="row align-middle mb-xl">
            <div className="column shrink">
              <div
                className="checkout__offerImg"
                style={{
                  backgroundImage: `url(${checkout &&
                    checkout.getIn(['gallery', 0, 'src'])})`,
                }}
              />
            </div>
            <div className="column">
              <h1 className="checkout__offerName">
                {checkout && checkout.get('offer_name')}
              </h1>
              <span className="checkout__offerCategory">
                {checkout && checkout.get('category')}
              </span>
            </div>
          </div>
          <div className="row">
            <div className="column">
              <p className="checkout__summaryPrice c-darkest-gray fw-bold">
                Extra:
              </p>
            </div>
          </div>
          {checkout &&
            checkout.get('extra_services').map(extra => (
              <div className="row" key={generate()}>
                <div className="column">
                  <p className="checkout__summaryDesc">
                    {extra.get('description')}
                  </p>
                </div>
                <div className="column text-right">
                  <p className="checkout__summaryPrice">
                    ${extra.get('price')}
                  </p>
                </div>
              </div>
            ))}
          <div className="checkout__divider" />
          <div className="row" key={generate()}>
            <div className="column">
              <p className="checkout__summaryDesc c-darkest-gray">
                Total Cost:
              </p>
            </div>
            <div className="column text-right">
              <p className="checkout__summaryPrice c-darkest-gray fw-bold">
                ${orderPrice}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  checkout: state.getIn(['offer', 'checkout']),
  clientToken: state.getIn(['checkout', 'clientToken']),
  isLoading: state.getIn(['checkout', 'isLoading']),
  error: state.getIn(['checkout', 'error']),
  isPaymentSending: state.getIn(['checkout', 'isPaymentSending']),
  paymentError: state.getIn(['checkout', 'paymentError']),
});

const mapDispatchToProps = dispatch => ({
  requestClientToken: () => dispatch(requestClientToken()),
  requestPayment: payload => dispatch(requestPayment(payload)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CheckoutContainer);
