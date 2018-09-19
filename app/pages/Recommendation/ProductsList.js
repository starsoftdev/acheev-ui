// @flow

import React from 'react';
import RecommendProductList from 'containers/Recommendation';
import parseSearch from 'utils/parseSearch';

type Props = {
  match: { params: { category: string } },
  location: { search: string },
};

const Recommendation = (props: Props) => {
  const query = parseSearch(props.location.search);
  const {
    match: {
      params: { category },
    },
  } = props;
  return (
    <div className="recommendProductPage">
      <div className="row">
        <div className="small-12 text-center mb-lg">
          <h2 className="recommendProductPage__title mt-xl">
            Recommended {category}s
          </h2>
        </div>
        <div className="small-12 column">
          <RecommendProductList category={category} query={query} {...props} />
        </div>
      </div>
    </div>
  );
};

export default Recommendation;
