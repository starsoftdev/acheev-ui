// @flow
import React from 'react';
import './styles.scss';

type Props = {
  role?: string,
};

const LimitedFeaturesMessage = ({ role }: Props) =>
  role === 'business' && (
    <section className="limitedFeaturesMessage">
      <div className="row">
        <div className="small-12 column">
          <h1 className="limitedFeaturesMessage__title">
            Sorry, you&apos;re not a Lift Rewards Pro Partner so we can only
            show you an example template of this section!
          </h1>
          <p className="limitedFeaturesMessage__message">
            Lift Rewards Pro Partners have access to our full analytics
            dashboard, which offers patient and product insights aggregated from
            the largest database of consumer-reported information for legal
            cannabis products. For more information or to sign up, contact us at{' '}
            <a
              className="limitedFeaturesMessage__link"
              href="mailto:hello@lift.co"
            >
              hello@lift.co
            </a>
          </p>
        </div>
      </div>
    </section>
  );

export default LimitedFeaturesMessage;
