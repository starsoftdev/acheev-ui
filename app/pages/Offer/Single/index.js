// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { generate } from 'shortid';

import Preloader from 'components/Preloader';
import UserInfoCard from 'components/UserInfoCard';
import UserMetaInfoCard from 'components/UserMetaInfoCard';
import Icon from 'components/Icon';
import OfferGallery from 'components/OfferGallery';
import Faq from 'components/Faq';
import ReviewsContainer from 'containers/Reviews';
import UserOffersContainer from 'containers/UserOffers';
import RecommendedOffersContainer from 'containers/RecommendedOffers';

import injectSagas from 'utils/injectSagas';

import InstagramIcon from 'images/sprite/instagram-circle.svg';
import TwitterIcon from 'images/sprite/twitter-circle.svg';
import FacebookIcon from 'images/sprite/facebook-circle.svg';
import LinkedInIcon from 'images/sprite/linkedin-circle.svg';
import StarIcon from 'images/sprite/star.svg';

import saga, {
  reducer,
  requestOffer,
  requestOrderOffer,
} from 'containers/Offer/sagas';

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
  checkout: Object,
  isLoading: boolean,
  requestOffer: Function,
  requestOrderOffer: Function,
  match: Object,
};

class OfferPage extends Component<Props> {
  componentDidMount() {
    this.props.requestOffer(this.props.match.params.id);
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.match.params.id !== this.props.match.params.id) {
      this.props.requestOffer(this.props.match.params.id);
    }
  }
  render() {
    const { data, checkout, isLoading } = this.props;
    if (isLoading) return <Preloader height={600} />;
    return (
      <div className="offerPage">
        <div className="row">
          <div className="column small-12 large-4">
            <div className="row column mb-lg">
              <UserInfoCard
                user={data.get('user')}
                offer={data}
                checkout={checkout}
                orderOffer={this.props.requestOrderOffer}
              />
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
          <div className="column small-12 large-8">
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
              <div className="offerPage__gallery">
                <OfferGallery
                  data={data.get('gallery')}
                  title={data.getIn(['user', 'username'])}
                />
              </div>
              <div className="offerPage__about">
                <div className="row">
                  <div className="column">
                    <h1 className="offerPage__title mb-lg">Description</h1>
                  </div>
                </div>
                <div className="row">
                  <div
                    className="column"
                    dangerouslySetInnerHTML={{
                      __html: data.get('description'),
                    }}
                  />
                </div>
              </div>
              {data.get('faq') &&
                data.get('faq').size > 0 && (
                  <div className="offerPage__faq">
                    <Faq questions={data.get('faq')} />
                  </div>
                )}
              <div className="offerPage__reviews">
                <ReviewsContainer />
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
  checkout: state.getIn(['offer', 'checkout']),
  isLoading: state.getIn(['offer', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestOffer: id => dispatch(requestOffer(id)),
  requestOrderOffer: payload => dispatch(requestOrderOffer(payload)),
});

export default compose(
  injectSagas({ key: 'offer', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OfferPage);
