// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { List, Map } from 'immutable';

import injectSagas from 'utils/injectSagas';

import PageBanner from 'components/PageBanner';
import OfferCard from 'components/OfferCard';

import saga, { reducer, requestOffers } from './sagas';

type Props = {
  offers: List<Map>,
  searchOffers: Function,
};

class OfferContainer extends Component<Props> {
  componentDidMount() {
    this.props.searchOffers();
  }
  render() {
    const { offers } = this.props;
    return (
      <div className="offer">
        <PageBanner title="Logo Design" expanded />
        <div className="row">
          <div className="column large-3">Filter</div>
          <div className="column large-9">
            <div className="row">
              <div className="column">
                <h2 className="fs-xl mb-lg">Search Filter Result</h2>
              </div>
            </div>
            <div className="row">
              {offers &&
                offers.size > 0 &&
                offers.map(offer => (
                  <div className="column large-4 mb-lg" key={offer.get('_id')}>
                    <OfferCard data={offer} />
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  offers: state.getIn(['offer', 'data']),
  isLoading: state.getIn(['offer', 'isLoading']),
  error: state.getIn(['offer', 'error']),
});

const mapDispatchToProps = dispatch => ({
  searchOffers: () => dispatch(requestOffers()),
});

export default compose(
  injectSagas({ key: 'offer', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(OfferContainer);
