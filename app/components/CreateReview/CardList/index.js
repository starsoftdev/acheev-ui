// @flow

import * as React from 'react';
import { List } from 'immutable';
import { generate } from 'shortid';

import BorderedTitle from 'components/BorderedTitle';
import CreateReviewCard from 'components/CreateReview/Card';
import './styles.scss';

type Props = {
  products: List<Map<string, Object>>,
};

const CreateReviewCardList = ({ products }: Props) => {
  if (products && products.size === 0) {
    return (
      <div className="text-center row mb-lg">
        <div className="column">Sorry no products found.</div>
      </div>
    );
  }
  return (
    <div className="createReviewCardList">
      {products &&
        products.size && (
          <div>
            <BorderedTitle
              element="h3"
              className="createReviewCardList__borderedTitle"
              centered
            >
              Click to review
            </BorderedTitle>
            <div className="row">
              {products.map(product => (
                <div key={generate()} className="small-12 medium-4 column">
                  <CreateReviewCard product={product} />
                </div>
              ))}
            </div>
          </div>
        )}
    </div>
  );
};

export default CreateReviewCardList;
