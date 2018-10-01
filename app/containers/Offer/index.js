// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { List, Map } from 'immutable';

import injectSagas from 'utils/injectSagas';

import PageBanner from 'components/PageBanner';

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
              {offers &&
                offers.size > 0 &&
                offers.map(offer => (
                  <div className="column large-4" key={offer.get('_id')}>
                    {offer.get('offer_name')}
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
