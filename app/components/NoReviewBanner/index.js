// @flow
import * as React from 'react';
import Link from 'components/Link';

import './styles.scss';

type Props = {
  to: string,
  type?: string,
};

const NoReviewBanner = ({ to, type }: Props) => (
  <div className="noReviewBanner">
    <div className="row align-center">
      <div className="column small-12 medium-shrink">
        <h2 className="noReviewBanner__title">
          Be one of the first to write for this&nbsp;
          {type && type === 'business' ? 'business' : 'product'} and earn 2x the
          amount of Lift Points!
        </h2>
      </div>
      <div className="column small-12 medium-shrink">
        <Link to={to} className="button noReviewBanner__button">
          Leave a review
        </Link>
      </div>
    </div>
  </div>
);

export default NoReviewBanner;
