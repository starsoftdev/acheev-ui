// @flow

import React from 'react';

import { RECO_PRODUCT_CATEGORY } from 'enum/constants';

import RecommendProductList from 'containers/Recommendation';
import parseSearch from 'utils/parseSearch';

import './styles.scss';

type Props = {
  location: { search: string },
};

const Recommendation = (props: Props) => {
  const query = parseSearch(props.location.search);

  return (
    <div className="recommendProductPage">
      <div className="row">
        <div className="small-12 text-center mb-lg">
          <h1 className="recommendProductPage__title">
            For you, our users recommend
          </h1>
        </div>
      </div>
      {RECO_PRODUCT_CATEGORY.map(category => (
        <div className="row align-center mb-sm" key={category.type}>
          <div className="small-12 text-center mb-xl">
            <h2 className="recommendProductPage__subtitle nm">
              {category.text}
            </h2>
          </div>
          <RecommendProductList
            isMinimized
            category={category.type}
            query={query}
            {...props}
          />
        </div>
      ))}
    </div>
  );
};
export default Recommendation;
