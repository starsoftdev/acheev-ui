// @flow

import CONFIG from '../../conf';
import React, { Component } from 'react';
import Link from 'components/Link';
import SocialLink from 'components/SocialLink';
import ReviewCount from 'components/ReviewCount';
import Button from 'components/Button';
import Label from 'components/Label';
import RequireAuth from 'components/RequireAuth';
import ProductAction from 'components/ProductAction';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import ExpandHourList from 'components/ExpandHourList';
import CannabisAwards from 'components/CannabisAwards';

import FacebookIcon from 'images/sprite/facebook-circle.svg';
import TwitterIcon from 'images/sprite/twitter-circle.svg';
import LinkedinIcon from 'images/sprite/linkedin-circle.svg';
import PinterestIcon from 'images/sprite/pinterest-circle.svg';
import GoogleIcon from 'images/sprite/google-circle.svg';
import FoursquareIcon from 'images/sprite/foursquare-circle.svg';
import YoutubeIcon from 'images/sprite/youtube-circle.svg';
import InstagramIcon from 'images/sprite/instagram-circle.svg';
import IconPlus from 'images/sprite/plus.svg';
import IconHeart from 'images/sprite/heart.svg';
import Active from 'images/sprite/active.svg';
import Promoted from 'images/sprite/promoted.svg';
import LiftPoints from 'images/sprite/Icon-LiftPoints.svg';
import Virtual from 'images/sprite/Icon-Virtual.svg';
import ProductReview from 'images/sprite/Icon-ProductReview.svg';
import BusinessReview from 'images/sprite/Icon-BusinessReview.svg';

import Phone from 'images/sprite/phone.svg';
import Envelope from 'images/sprite/envelope.svg';
import Globe from 'images/sprite/globe.svg';

import ImgAwardsBadge from 'components/CannabisProductProfile/awards-badge.png';
import './styles.scss';

type Props = {
  category: string,
  data: Object,
  slug: string,
  currentUser: Object,
  followLikeBusiness: Function,
  follows: Object,
  likes: Object,
};

class BusinessInfo extends Component<Props> {
  followLikeBusiness = (actionType: string) => {
    this.props.followLikeBusiness(this.props.data.get('_id'), actionType);
  };
  render() {
    const { category, data, slug, currentUser, follows, likes } = this.props;
    if (!data) return null;
    const categorySingular = category.slice(0, -1);
    const email = data.get('email');
    const telephone = data.get('telephone');
    const address = data.getIn(['locations', 0, 'address']);
    const city = data.getIn(['locations', 0, 'city']);
    const province = data.getIn(['locations', 0, 'province']);
    const postalCode = data.getIn(['locations', 0, 'postalCode']);
    const name = data.get('name');
    const website = data.get('website');
    const thumbnail =
      data.get('thumbnail') ||
      `http://via.placeholder.com/260x260?text=${name}`;
    const reviewCount = data.get('reviews') ? data.get('reviews').size : 0;
    const rating = data.get('rating');
    const productReviewCount = data.get('productReviewCount')
      ? data.get('productReviewCount')
      : 0;
    const productRating = data.get('productRating');
    const hoursOfOperation = data.get('hoursOfOperation');

    const linkedinLink = data.get('linkedin');
    const facebookLink = data.get('facebook');
    const twitterLink = data.get('twitter');
    const pinterestLink = data.get('pinterest');
    const googleLink = data.get('google');
    const foursquareLink = data.get('foursquare');
    const youtubeLink = data.get('youtube');
    const instagramLink = data.get('instagram');
    const awards = data.get('awards');

    return (
      <div className="businessInfo mb-xl">
        <div className="row">
          <div className="columns medium-shrink text-center">
            <Label className="purple">{categorySingular}</Label>
          </div>
        </div>
        <div className="businessInfo__infoSection mt-md row">
          <div className="column small-12 medium-shrink text-center">
            <div
              className="businessInfo__image"
              style={{
                backgroundImage: `url('${
                  CONFIG.APP.CDN_URL
                }/resize/260x260/${thumbnail}')`,
              }}
            >
              {awards &&
                awards.size > 0 && (
                  <img
                    className="businessInfo__awardsBanner"
                    alt="awards"
                    src={ImgAwardsBadge}
                  />
                )}
            </div>
          </div>
          <div className="column small-12 medium-expand">
            <div className="row mb-sm">
              <div className="column businessInfo__profileSection">
                <div className="row businessInfo__tags">
                  {data.getIn(['features', 'promoted']) && (
                    <div className="shrink column npr mb-sm text-right">
                      <Tooltip
                        tooltipPosition="top"
                        tooltipIndicator={false}
                        tooltipContent="Featured business"
                      >
                        <div>
                          <Icon glyph={Promoted} size={20} />
                        </div>
                      </Tooltip>
                    </div>
                  )}
                  {!!data.get('admins').size && (
                    <div className="shrink column npr mb-sm">
                      <Tooltip
                        tooltipPosition="top"
                        tooltipIndicator={false}
                        tooltipContent="This business is active on Lift"
                      >
                        <div>
                          <Icon glyph={Active} size={20} />
                        </div>
                      </Tooltip>
                    </div>
                  )}
                  {data.getIn(['features', 'points']) && (
                    <div className="shrink column npr mb-sm">
                      <Tooltip
                        tooltipPosition="top"
                        tooltipIndicator={false}
                        tooltipContent="This business has products that you can buy with lift points"
                      >
                        <div>
                          <Icon glyph={LiftPoints} size={20} />
                        </div>
                      </Tooltip>
                    </div>
                  )}
                  {data.getIn(['features', 'virtual']) && (
                    <div className="shrink column npr mb-sm">
                      <Tooltip
                        tooltipPosition="top"
                        tooltipIndicator={false}
                        tooltipContent="Virtual business"
                      >
                        <div>
                          <Icon glyph={Virtual} size={20} />
                        </div>
                      </Tooltip>
                    </div>
                  )}
                </div>
                <h1 className="c-darkest-gray t-capitalize">{name}</h1>

                <div className="row align-middle">
                  {category === 'producers' && (
                    <div className="columns small-12 medium-shrink mb-sm mr-lg">
                      <ReviewCount
                        className="businessInfo__rating"
                        reviewCount={productReviewCount}
                        ratingsAverage={productRating}
                        to={`/${category}/${slug}/product-reviews`}
                        prefixIcon={ProductReview}
                        type="product"
                        centered
                      />
                    </div>
                  )}
                  <div className="columns small-12 medium-shrink mb-sm">
                    <ReviewCount
                      className="businessInfo__rating"
                      reviewCount={reviewCount}
                      ratingsAverage={rating}
                      to={`/${category}/${slug}/reviews`}
                      prefixIcon={BusinessReview}
                      type="business"
                      centered
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="row align-middle mb-sm">
              <div className="columns small-12 medium-shrink">
                {address && `${address}, `}
                {city && `${city}, `}
                {province && `${province}, `}
                {postalCode && `${postalCode}`}
              </div>
            </div>
            <div className="row align-middle mb-sm">
              <div className="columns small-12 medium-shrink">
                <ExpandHourList data={hoursOfOperation} />
              </div>
            </div>
            <div className="row align-top mb-md">
              <div className="column small-12 medium-shrink">
                <div className="row mb-md">
                  {telephone && (
                    <div className="columns small-12 medium-shrink businessInfo__actionLink">
                      <Icon glyph={Phone} size={12} className="mr-tn" />
                      <a
                        className="t-lowercase fs-sm"
                        href={`tel:${telephone}`}
                      >
                        {telephone}
                      </a>
                    </div>
                  )}
                  {email && (
                    <div className="columns small-12 medium-shrink businessInfo__actionLink">
                      <Icon glyph={Envelope} size={12} className="mr-tn" />
                      <a className="t-lowercase fs-sm" href={`mailto:${email}`}>
                        {email}
                      </a>
                    </div>
                  )}
                  {website && (
                    <div className="columns small-12 medium-shrink businessInfo__actionLink">
                      <Icon glyph={Globe} size={12} className="mr-tn" />
                      <a
                        className="t-lowercase fs-sm"
                        href={website}
                        target="_blank"
                      >
                        {website}
                      </a>
                    </div>
                  )}
                </div>
                <div className="row align-middle">
                  <div className="shrink column mb-sm">
                    <Link
                      className="businessInfo__actionLink"
                      to={`/${category}/${slug}/create-review`}
                    >
                      <Button element="button" className="secondary small">
                        REVIEW
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="column small-12 medium-expand">
                <div className="row mb-md">
                  <div className="columns hide-for-small-only" />
                  <div className="shrink column right">
                    {currentUser ? (
                      <ProductAction
                        glyph={IconPlus}
                        title="Follow"
                        count={follows.get('count')}
                        onClick={() => this.followLikeBusiness('follow')}
                      />
                    ) : (
                      <RequireAuth toDo="follow businesses">
                        <ProductAction
                          glyph={IconPlus}
                          title="Follow"
                          count={follows.get('count')}
                        />
                      </RequireAuth>
                    )}
                  </div>
                  <div className="shrink column">
                    {currentUser ? (
                      <ProductAction
                        glyph={IconHeart}
                        title="Like"
                        count={likes.get('count')}
                        onClick={() => this.followLikeBusiness('like')}
                      />
                    ) : (
                      <RequireAuth toDo="like business">
                        <ProductAction
                          glyph={IconHeart}
                          title="Like"
                          count={likes.get('count')}
                        />
                      </RequireAuth>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="column businessInfo__socialLinks">
                    <SocialLink link={facebookLink} icon={FacebookIcon} />
                    <SocialLink link={twitterLink} icon={TwitterIcon} />
                    <SocialLink link={linkedinLink} icon={LinkedinIcon} />
                    <SocialLink link={pinterestLink} icon={PinterestIcon} />
                    <SocialLink link={googleLink} icon={GoogleIcon} />
                    <SocialLink link={foursquareLink} icon={FoursquareIcon} />
                    <SocialLink link={youtubeLink} icon={YoutubeIcon} />
                    <SocialLink link={instagramLink} icon={InstagramIcon} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="column small-12">
            <CannabisAwards data={awards} />
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessInfo;
