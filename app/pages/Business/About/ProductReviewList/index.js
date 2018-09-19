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
  category: string,
  location: Object,
  business: Map<*, *>,
};

class BusinessProductReviewListPage extends Component<Props> {
  render() {
    const { slug, category, location, business } = this.props;
    return (
      <Fragment>
        <Helmet
          title={title({
            name: get(business, 'name'),
            type: get(business, '__t'),
            postfix: 'Cannabis Products Reviews',
          })}
        />
        <ReviewList
          category={category}
          type="product"
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

export default connect(mapStateToProps)(BusinessProductReviewListPage);
