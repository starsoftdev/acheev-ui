// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';
import { get } from 'utils/immutable';
import title from 'utils/title';

import Helmet from 'components/Helmet';
import ReviewList from 'containers/BusinessProfile/ReviewList';

type Props = {
  slug: string,
  location: Object,
  category: string,
  business: Map<*, *>,
};

class BusinessReviewListPage extends Component<Props> {
  render() {
    const { slug, location, category, business } = this.props;
    return (
      <Fragment>
        <Helmet
          title={title({
            name: get(business, 'name'),
            type: get(business, '__t'),
            prefix: 'Reviews on',
          })}
        />
        <ReviewList
          category={category}
          type="business"
          slug={slug}
          location={location}
          business={business}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  business: state.getIn(['profile', 'business', 'data']),
});

export default connect(mapStateToProps)(BusinessReviewListPage);
