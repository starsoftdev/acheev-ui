// @flow

import * as React from 'react';
import { history } from 'components/ConnectedRouter';
import Dotdotdot from 'react-dotdotdot';
import { get, getIn } from 'utils/immutable';

import CONFIG from '../../conf';
import Tooltip from 'components/Tooltip';
import ReviewCount from 'components/ReviewCount';
import Button from 'components/Button';
import Link from 'components/Link';

import './styles.scss';

type Props = {
  data: Object,
  hideReview?: boolean,
};

const BusinessCard = (props: Props) => {
  const { data, hideReview = false } = props;
  if (!data) return null;
  const type = get(data, '__t', '');
  const businessCategory = type === 'Doctor' ? 'Clinic' : type;
  const baseUrl =
    businessCategory === 'Dispensary'
      ? '/dispensaries'
      : `/${businessCategory.toLowerCase()}s`;
  const slug = get(data, 'slug');
  const changeRouteWithSlug = () => {
    history.push(`${baseUrl}/${slug}`);
  };
  const thumbnail =
    get(data, 'thumbnail') || getIn(data, ['business', 'thumbnail']);
  return (
    <div className="businessCard">
      <Link className="businessCard__link" to={`${baseUrl}/${slug}`}>
        {businessCategory ? (
          <Tooltip
            tooltipPosition="top"
            tooltipIndicator={false}
            tooltipContent={businessCategory}
            triggerFocus={false}
            triggerClick={false}
          >
            <div
              className="businessCard__image"
              style={{
                backgroundImage: `url('${CONFIG.APP.CDN_URL}/resize/78x78/${thumbnail}')`,
              }}
            />
          </Tooltip>
        ) : (
          <div
            className="businessCard__image"
            style={{
              backgroundImage: `url('${CONFIG.APP.CDN_URL}/resize/78x78/${thumbnail}')`,
            }}
          />
        )}
        <h4 className="businessCard__title">
          <Dotdotdot clamp={2}>{get(data, 'name')}</Dotdotdot>
        </h4>
      </Link>
      {!hideReview && (
        <ReviewCount
          className="align-center mb-mn"
          reviewCount={get(data, 'reviews').size}
          ratingsAverage={get(data, 'rating')}
          to={`${baseUrl}/${slug}/reviews`}
        />
      )}
      <div className="row">
        <div className="column text-center mt-md">
          <Button
            className="spacious secondary"
            onClick={() => changeRouteWithSlug()}
          >
            View
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BusinessCard;
