// @flow

import React, { Component } from 'react';
import { List } from 'immutable';
import title from 'utils/title';
import { get } from 'utils/immutable';

import Helmet from 'components/Helmet';
import BusinessInfo from 'components/BusinessInfo';
import Preloader from 'components/Preloader';
import Breadcrumbs from 'components/Breadcrumbs';

type Props = {
  category: string,
  isLoading: boolean,
  error: string,
  business: Object,
  slug: string,
  businessFollowLike: Object,
  followLikeBusiness: Function,
  currentUser: Object,
  follows: Object,
  likes: Object,
  breadcrumbPath: List<Map<string, Object>>,
  requestBusinessProfile: Function,
  requestBusinessFollows: Function,
  requestBusinessLikes: Function,
  setMetaJson: Function,
};

class BusinessProfileContainer extends Component<Props> {
  componentDidMount() {
    const { slug } = this.props;
    this.props.requestBusinessProfile(slug);
  }

  componentDidUpdate(oldProps: Props) {
    const { business, isLoading, error, businessFollowLike } = this.props;

    const wasLoadingBusiness = oldProps.isLoading;
    const isBusinessLoaded = isLoading === false && error === '';

    const wasFollowingOrLiking = oldProps.businessFollowLike.get('isLoading');
    const isFollowedOrLiked =
      businessFollowLike.get('isLoading') === false &&
      businessFollowLike.get('error') === '';

    let businessMetaJson = {};

    if (
      (wasLoadingBusiness && isBusinessLoaded) ||
      (wasFollowingOrLiking && isFollowedOrLiked)
    ) {
      this.props.requestBusinessFollows(business.get('_id'));
      this.props.requestBusinessLikes(business.get('_id'));
    }

    if (business.size > 0) {
      businessMetaJson = {
        '@type': 'Organization',
        name: business.get('name'),
        email: business.get('email'),
        faxNumber: business.get('fax'),
        logo: business.get('thumbnail'),
        description: business.get('description'),
        telephone: business.get('telephone'),
        url: business.get('website'),
        address: {
          '@type': 'PostalAddress',
          addressLocality: business.getIn(['locations', 0, 'city']),
          addressRegion: business.getIn(['locations', 0, 'province']),
          postalCode: business.getIn(['locations', 0, 'postalCode']),
          streetAddress: business.getIn(['locations', 0, 'address']),
        },
      };
      if (business.get('reviews') && business.get('reviews').size > 0) {
        businessMetaJson.aggregateRating = {
          '@type': 'AggregateRating',
          ratingValue: business.get('rating') ? business.get('rating') : 5,
          bestRating: 5,
          worstRating: 0,
          reviewCount: business.get('reviews').size,
        };
      }
      this.props.setMetaJson(['mainEntity'], businessMetaJson);
    }
  }

  render() {
    const {
      category,
      business,
      isLoading,
      error,
      slug,
      currentUser,
      businessFollowLike,
      follows,
      likes,
      breadcrumbPath,
    } = this.props;
    const lp = title({
      name: get(business, 'name'),
      type: get(business, '__t'),
    });

    if (isLoading) return <Preloader />;
    return business && error === '' ? (
      <div>
        <Helmet
          meta={[
            {
              name: 'description',
              content: `Read reviews on ${lp} and its cannabis products submitted by Lift & Co.'s Rewards members. Also see ${lp}'s company information and full product offering.`,
            },
          ]}
        />
        <Breadcrumbs path={breadcrumbPath} />
        <BusinessInfo
          category={category}
          data={business}
          slug={slug}
          businessFollowLike={businessFollowLike}
          followLikeBusiness={this.props.followLikeBusiness}
          currentUser={currentUser}
          follows={follows}
          likes={likes}
        />
      </div>
    ) : null;
  }
}

export default BusinessProfileContainer;
