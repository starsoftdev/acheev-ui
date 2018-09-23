// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';

import BorderedTitle from 'components/BorderedTitle';
import MARKET_OPTIONS from 'enum/market/options';

import CategoryCard from './CategoryCard';

import './styles.scss';

class ExploreMarketplace extends Component {
  render() {
    return (
      <div className="exploreMarketplace">
        <div className="row column">
          <BorderedTitle className="nm mb-sm" centered>
            Explore the Marketplace
          </BorderedTitle>
        </div>
        <div className="row column text-center mb-xl">
          <h6 className="exploreMarketplace__desc">
            Real people, flat rate services. Verified LinkedIn &amp; GitHub
            credentials.
          </h6>
        </div>
        <div className="row pt-xl">
          {MARKET_OPTIONS.CATEGORY_OPTIONS.map(category => (
            <div className="column small-6 large-3 mb-lg" key={generate()}>
              <CategoryCard data={category} />
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ExploreMarketplace;
