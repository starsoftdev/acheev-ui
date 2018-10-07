// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { generate } from 'shortid';

import Preloader from 'components/Preloader';
import UserInfoCard from 'components/UserInfoCard';
import UserMetaInfoCard from 'components/UserMetaInfoCard';
import Icon from 'components/Icon';
import UserPortfolio from 'components/UserPortfolio';
import PackageCard from 'components/PackageCard';
import Faq from 'components/Faq';
import OfferReviewsContainer from 'containers/OfferReviews';
import UserOffersContainer from 'containers/UserOffers';
import RecommendedOffersContainer from 'containers/RecommendedOffers';

import injectSagas from 'utils/injectSagas';

import InstagramIcon from 'images/sprite/instagram-circle.svg';
import TwitterIcon from 'images/sprite/twitter-circle.svg';
import FacebookIcon from 'images/sprite/facebook-circle.svg';
import LinkedInIcon from 'images/sprite/linkedin-circle.svg';
import StarIcon from 'images/sprite/star.svg';

import saga, { reducer, requestOffer } from 'containers/Offer/sagas';

import './styles.scss';

const socialLinks = [
  {
    href: 'https://www.facebook.com/',
    glyph: FacebookIcon,
  },
  {
    href: 'https://twitter.com/',
    glyph: TwitterIcon,
  },
  {
    href: 'https://www.linkedin.com/',
    glyph: LinkedInIcon,
  },
  {
    href: 'https://www.instagram.com/',
    glyph: InstagramIcon,
  },
];

type Props = {
  data: Object,
  isLoading: boolean,
  requestOffer: Function,
  match: Object,
};

class OfferPage extends Component<Props> {
  componentDidMount() {
    this.props.requestOffer(this.props.match.params.id);
  }
  render() {
    const { data, isLoading } = this.props;
    if (isLoading) return <Preloader height={600} />;
    return (
      <div className="offerPage">
        <div className="row">
          <div className="column large-4">
            <div className="row column mb-lg">
              <UserInfoCard data={data.get('user')} />
            </div>
            <div className="row column mb-xl">
              <UserMetaInfoCard />
            </div>
            <div className="row align-center mb-lg">
              {socialLinks.map(({ href, glyph }) => (
                <a
                  className="offerPage__socialLink"
                  href={href}
                  target="_blank"
                  key={generate()}
                >
                  <Icon glyph={glyph} width={30} height={30} />
                </a>
              ))}
            </div>
          </div>
          <div className="column large-8">
            <div className="offerPage__information">
              <div className="offerPage__topLine">
                <div className="row align-middle mb-sm">
                  <div className="column">
                    <h1 className="offerPage__title">
                      {data.get('offer_name')}
                    </h1>
                  </div>
                  <div className="column shrink">4.5</div>
                  <div className="column shrink npl">
                    <Icon
                      className="offerPage__starIcon"
                      glyph={StarIcon}
                      size={23}
                    />
                  </div>
                </div>
                <div className="row align-middle">
                  <div className="column">
                    <h1 className="offerPage__category">
                      {`${data.get('category')} / ${data.get('sub_category')}`}
                    </h1>
                  </div>
                </div>
              </div>
              <div className="offerPage__portfolio">
                <UserPortfolio />
              </div>
              <div className="offerPage__packages">
                <div className="row">
                  <div className="column">
                    <h1 className="offerPage__title mb-lg mr-md ml-md">
                      Compare Packages
                    </h1>
                  </div>
                </div>
                <div className="row">
                  <div className="column large-4">
                    <PackageCard />
                  </div>
                  <div className="column large-4">
                    <PackageCard />
                  </div>
                  <div className="column large-4">
                    <PackageCard />
                  </div>
                </div>
              </div>
              <div className="offerPage__about">
                <div className="row">
                  <div className="column">
                    <h1 className="offerPage__title mb-lg">About This Gig</h1>
                  </div>
                </div>
                <div className="row">
                  <div className="column large-4">
                    <p>
                      {`This Gig is for 1 x month as your Digital Marketing Manager.  I pride the success of my business on offering my clients a clear and straightforward approach to online marketing that gets solid results`}
                    </p>
                    <p>
                      {`Keep your social media pages up to date with captivating posts that make potential customers engage with your business`}
                    </p>
                  </div>
                  <div className="column large-8">
                    <p className="t-uppercase fw-bold">What can you expect:</p>
                    <ul>
                      <li>1 months of Social Media Marketing done for you</li>
                      <li>Posts by a graphic designer</li>
                      <li>Posts by a Content writer, on brand and on point</li>
                      <li>
                        Promoting your brand, products/services/promotional
                        content
                      </li>
                      <li>Post Types: Images</li>
                      <li>
                        Posts are optimized with hashtags &amp; business
                        information
                      </li>
                      <li>
                        Facebook, Twitter, LinkedIn, Pinterest, Google+,
                        Instagram
                      </li>
                      <li>Creation/Optimisation of Social Media Pages</li>
                      <li>Drive traffic to your website/lead generation</li>
                      <li>Leverage Brand Authority &amp; Awareness</li>
                      <li>Posts scheduled days of your choice</li>
                      <li>Dashboard to track your return on investment</li>
                    </ul>
                    <p className="fw-bold">Choose from 3 Gigs:</p>
                    <ul>
                      <li>3 Days a week</li>
                      <li>7 Days a week</li>
                      <li>5 days a week (3 months in advance)</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="offerPage__faq">
                <Faq questions={data.get('faq')} />
              </div>
              <div className="offerPage__reviews">
                <OfferReviewsContainer />
              </div>
            </div>
          </div>
        </div>
        <div className="row column">
          <UserOffersContainer />
        </div>
        <div className="row column pb-xl" />
        <div className="row column">
          <RecommendedOffersContainer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.getIn(['offer', 'offer']),
  isLoading: state.getIn(['offer', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestOffer: id => dispatch(requestOffer(id)),
});

export default compose(
  injectSagas({ key: 'offer', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OfferPage);
