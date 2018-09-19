// @flow

import React, { Component } from 'react';
import type Moment from 'moment';
import type { Map, List } from 'immutable';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { reduce, xor, chunk } from 'lodash-es';
import qs from 'qs';
import parseSearch from 'utils/parseSearch';

import ReviewList from 'components/ReviewList';
import BusinessReviewsFilter from 'components/Filter/BusinessReviewsFilter';
import InfiniteScroll from 'components/InfiniteScroll';

import { requestBusinesses, requestBusinessReviews } from 'pages/LP/sagas';

type Props = {
  requestBusinesses: Function,
  requestBusinessReviews: Function,
  user: Map<*, *>,
  businessReviews: List<*>,
  isLoading: boolean,
  businessId: number,
  from: Moment,
  to: Moment,
  page: number,
  pages: number,
  slug: string,
  location: { pathname: string, query: {}, search: string },
  push: Function,
};

type State = {
  value: Map<*, *>,
  page: number,
};

class LpBusinessReviews extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const query = parseSearch(this.props.location.search);

    this.state = {
      value: fromJS(query.query) || fromJS({}),
      page: 1,
    };
  }

  componentDidMount() {
    const { user, businessId } = this.props;

    if (businessId) {
      this.requestBusinessReviews();
    } else {
      this.props.requestBusinesses(user.get('id'));
    }
  }

  componentDidUpdate(prevProps: Props) {
    const dateRangeChanged =
      this.props.from !== prevProps.from || this.props.to !== prevProps.to;

    if (prevProps.businessId !== this.props.businessId) {
      this.requestBusinessReviews();
    }

    if (this.props.location.search !== prevProps.location.search) {
      this.requestBusinessReviews();
    }

    if (dateRangeChanged) {
      this.props.push({
        pathname: this.props.location.pathname,
        search: `?${qs.stringify({
          from: this.props.from.format('DD-MM-YYYY'),
          to: this.props.to.format('DD-MM-YYYY'),
          query: this.state.value.toJS(),
        })}`,
      });
    }
  }

  handleLoadMore = () => {
    this.requestBusinessReviews();
  };

  requestBusinessReviews() {
    const query: {
      business: number,
      $or?: Array<{ rating: { $lte?: number, $gte?: number } }>,
      createdOn?: { $gte: Moment, $lte: Moment },
    } = {
      business: this.props.businessId,
    };

    if (this.state.value.get('rating')) {
      const ranges: {
        $gte: Array<number>,
        $lt: Array<number>,
      } = reduce(
        this.state.value
          .get('rating')
          .toJS()
          .sort(),
        (result: { $gte: Array<number>, $lt: Array<number> }, rating) => {
          result.$gte.push(rating - 0.5);
          result.$lt.push(parseInt(rating, 10) + 0.5);
          return result;
        },
        {
          $gte: [],
          $lt: [],
        }
      );

      query.$or = chunk(xor(ranges.$gte, ranges.$lt).sort(), 2).map(
        ([$gte, $lt]) => {
          const result = { rating: { $gte, $lt } };
          if ($gte === 0.5) delete result.rating.$gte;
          if ($lt === 5.5) delete result.rating.$lt;
          return result;
        }
      );
    }

    if (this.props.from && this.props.to) {
      query.createdOn = { $gte: this.props.from, $lte: this.props.to };
    }

    this.props.requestBusinessReviews(query, {
      populate: 'user',
      sort: '-createdOn',
      page: this.state.page,
    });
  }

  handleChange = value => {
    this.props.push({
      pathname: this.props.location.pathname,
      search: `?${qs.stringify({
        from: this.props.from.format('DD-MM-YYYY'),
        to: this.props.to.format('DD-MM-YYYY'),
        query: value.toJS(),
      })}`,
    });

    this.setState({ value });
  };

  handlePageChange = data => {
    this.setState({ page: data.value });
    this.props.push({
      pathname: this.props.location.pathname,
      search: `?${qs.stringify({
        from: this.props.from.format('DD-MM-YYYY'),
        to: this.props.to.format('DD-MM-YYYY'),
        query: this.state.value.toJS(),
        page: this.state.page,
      })}`,
    });
  };

  render() {
    const { slug, page, pages, isLoading, businessReviews } = this.props;

    return (
      <div>
        <div className="row">
          <div className="small-12 medium-4 large-3 column">
            <BusinessReviewsFilter
              value={this.state.value}
              onChange={this.handleChange}
            />
          </div>
          <div className="small-12 medium-8 large-9 column">
            {businessReviews &&
              businessReviews.size === 0 &&
              'Sorry! No reviews were found. Please try changing your query'}

            <ReviewList
              category="producer"
              type="business"
              slug={slug}
              data={businessReviews}
              isLoading={false}
              currentUser={fromJS({})}
              lpVersion
            />
          </div>
        </div>
        <InfiniteScroll
          className="mb-xl"
          isLoading={isLoading}
          page={page}
          pageCount={Math.ceil(pages)}
          loadMore={this.handleLoadMore}
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
  businessId: state.getIn(['lp', 'businesses', 'data', 0, 'id']),
  slug: state.getIn(['lp', 'businesses', 'data', 0, 'slug']),
  page: state.getIn(['lp', 'businessReviews', 'data', 'page']),
  pages: state.getIn(['lp', 'businessReviews', 'data', 'pages']),
  businessReviews: state.getIn(['lp', 'businessReviews', 'data', 'hits']),
  isLoading: state.getIn(['lp', 'businessReviews', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinesses: id => dispatch(requestBusinesses(id)),
  requestBusinessReviews: (query, q) =>
    dispatch(requestBusinessReviews(query, q)),
  push: query => dispatch(push(query)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LpBusinessReviews);
