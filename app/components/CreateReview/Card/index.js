// @flow

import * as React from 'react';
import Link from 'components/Link';

import pluralizeCategory from 'utils/pluralizeCategory';

import './styles.scss';

type Props = {
  product: Object,
};
const CreateReviewCard = ({ product }: Props) => {
  if (!product) return null;
  const categoryPlural = pluralizeCategory(product.get('__t'));
  const slug = product.get('slug');
  return (
    <Link
      className="createReviewCard row align-middle"
      to={`/${categoryPlural}/${slug}/create-review`}
    >
      <div className="small-12 medium-12 column">
        <div className="createReviewCard__productName">
          {product.get('name')}
        </div>
        <div className="createReviewCard__producerName">
          {product.getIn(['business', 'name'])}
        </div>
      </div>
    </Link>
  );
};

export default CreateReviewCard;
