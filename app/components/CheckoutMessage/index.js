// @flow

import * as React from 'react';
import { generate } from 'shortid';

import './styles.scss';

type Props = {
  data: Object,
};

const CheckoutMessage = ({ data }: Props) => {
  let orderPrice = data && data.get('price');
  if (data && data.get('extra_services')) {
    data.get('extra_services').map(extra => {
      orderPrice += extra.get('price');
      return extra;
    });
  }
  if (!data) return null;
  return (
    <div className="checkoutMessage">
      <div className="row align-middle mb-xl">
        <div className="column shrink">
          <div
            className="checkoutMessage__offerImg"
            style={{
              backgroundImage: `url(${data &&
                data.getIn(['gallery', 0, 'src'])})`,
            }}
          />
        </div>
        <div className="column">
          <h1 className="checkoutMessage__offerName">
            {data && data.get('offer_name')}
          </h1>
          <span className="checkoutMessage__offerCategory">
            {data && data.get('category')}
          </span>
        </div>
      </div>
      <div className="row">
        <div className="column">
          <p className="checkoutMessage__summaryPrice c-darkest-gray fw-bold">
            Extra:
          </p>
        </div>
      </div>
      {data &&
        data.get('extra_services').map(extra => (
          <div className="row" key={generate()}>
            <div className="column">
              <p className="checkoutMessage__summaryDesc">
                {extra.get('description')}
              </p>
            </div>
            <div className="column text-right">
              <p className="checkoutMessage__summaryPrice">
                ${extra.get('price')}
              </p>
            </div>
          </div>
        ))}
      <div className="checkoutMessage__divider" />
      <div className="row" key={generate()}>
        <div className="column">
          <p className="checkoutMessage__summaryDesc c-darkest-gray">
            Total Cost:
          </p>
        </div>
        <div className="column text-right">
          <p className="checkoutMessage__summaryPrice c-darkest-gray fw-bold">
            ${orderPrice}
          </p>
        </div>
      </div>
    </div>
  );
};

export default CheckoutMessage;
