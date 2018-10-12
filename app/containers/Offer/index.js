// @flow

import React, { Component, Fragment } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { List, Map } from 'immutable';
import qs from 'qs';
import { push, replace } from 'react-router-redux';

import PageBanner from 'components/PageBanner';
import OfferCard from 'components/OfferCard';
import Pagination from 'components/Pagination';
import OfferFilter from 'components/OfferFilter';
import Preloader from 'components/Preloader';

import injectSagas from 'utils/injectSagas';
import compareDeep from 'utils/compareDeepByVal';

import saga, {
  reducer,
  requestSearchOffers,
  setParams,
  changeParam,
} from './sagas';

type Props = {
  offers: List<Map<string, any>>,
  isLoading: boolean,
  params: Object,
  totalCount: number,
  searchOffers: Function,
  setParams: Function,
  changeParam: Function,
  push: Function,
  replace: Function,
  location: Object,
};

class OfferContainer extends Component<Props> {
  componentDidMount() {
    this.props.setParams(this.props.location.query);
    this.props.searchOffers();
  }
  componentDidUpdate(prevProps: Props) {
    const { params, location } = this.props;
    const search = `?${qs.stringify({
      ...params.toJS(),
    })}`;
    if (location.search === '') {
      this.props.replace(`${location.pathname}${search}`);
    } else if (!compareDeep(prevProps.params.toJS(), params.toJS())) {
      this.props.push({
        pathname: location.pathname,
        search,
      });
      this.props.searchOffers();
    }
  }
  render() {
    const { offers, isLoading, totalCount, params } = this.props;
    const pages = totalCount
      ? Math.ceil(totalCount / params.get('per_page'))
      : 0;
    return (
      <div className="offerContainer">
        <PageBanner title="Logo Design" expanded />
        <div className="row">
          <div className="column small-12 large-3">
            <OfferFilter />
          </div>
          <div className="column small-12 large-9">
            <div className="row">
              <div className="column">
                <h2 className="fs-xl mb-lg c-darkest-gray">
                  Search Filter Result
                </h2>
              </div>
            </div>
            {isLoading ? (
              <Preloader height={200} />
            ) : (
              <Fragment>
                <div className="row mb-hg">
                  {offers &&
                    offers.size > 0 &&
                    offers.map(offer => (
                      <div
                        className="column small-12 large-4 mb-lg"
                        key={offer.get('_id')}
                      >
                        <OfferCard data={offer} />
                      </div>
                    ))}
                </div>
                <div className="row align-center">
                  <Pagination
                    initialPage={params.get('page')}
                    pageCount={pages}
                    onPageChange={e => this.props.changeParam('page', e)}
                    altTheme
                    onlyPaginator
                  />
                </div>
              </Fragment>
            )}
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  offers: state.getIn(['offer', 'data', 'offers']),
  params: state.getIn(['offer', 'params']),
  totalCount: state.getIn(['offer', 'data', 'total']),
  isLoading: state.getIn(['offer', 'isLoading']),
  error: state.getIn(['offer', 'error']),
});

const mapDispatchToProps = dispatch => ({
  searchOffers: () => dispatch(requestSearchOffers()),
  setParams: params => dispatch(setParams(params)),
  changeParam: (path, value) => dispatch(changeParam(path, value)),
  push: query => dispatch(push(query)),
  replace: path => dispatch(replace(path)),
});

export default compose(
  injectSagas({ key: 'offer', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OfferContainer);
