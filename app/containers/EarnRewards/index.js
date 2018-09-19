// @flow

import React, { Component } from 'react';

import EarnPointLinkPanel from 'components/EarnPointLinkPanel';
import PromoCodePanel from 'components/PromoCodePanel';
import IconProfile from 'images/sprite/profile-white.svg';
import IconProductReview from 'images/sprite/ProductReview.svg';
import IconBusinessReview from 'images/sprite/BusinessReview.svg';

type Props = {
  redeemPromoCode: Function,
  requestUser: Function,
  error: string,
  success: string,
  isLoading: boolean,
};

class EarnRewardsContainer extends Component<Props> {
  render() {
    const { error, success, isLoading } = this.props;
    return (
      <div>
        <PromoCodePanel
          redeemPromoCode={this.props.redeemPromoCode}
          requestUser={this.props.requestUser}
          error={error}
          success={success}
          isLoading={isLoading}
        />
        <EarnPointLinkPanel
          to="/me"
          title="Complete your profile"
          point={200}
          icon={IconProfile}
          buttonTitle="Complete profile"
        >
          Complete your profile and earn 200 Lift Points!
        </EarnPointLinkPanel>
        <EarnPointLinkPanel
          to="/create-review"
          title="Leave a product review"
          point={300}
          icon={IconProductReview}
          buttonTitle="Leave a review"
        >
          {`Write a review on a strain or oil and receive up to 300 Lift Points.
          If that product has less than 5 reviews, you'll get double the
          points!`}
        </EarnPointLinkPanel>
        <EarnPointLinkPanel
          to="/producers"
          title="Leave a business review"
          point={80}
          icon={IconBusinessReview}
          buttonTitle="Leave a review"
        >
          Write a review for your favorite business and earn up to 80 Lift
          Points!
        </EarnPointLinkPanel>
      </div>
    );
  }
}

export default EarnRewardsContainer;
