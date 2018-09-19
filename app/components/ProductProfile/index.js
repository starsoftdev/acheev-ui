// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import type { Map } from 'immutable';
import cx from 'classnames';

import Button from 'components/Button';
import ReviewCount from 'components/ReviewCount';
import ProductPrice from 'components/ProductPrice';
import ProductAction from 'components/ProductAction';
import ProductGallery from 'components/ProductGallery';
import CustomSelect from 'components/CustomSelect';
import RequireAuth from 'components/RequireAuth';

import transformOptions from 'utils/transformOptions';
import pluralizeCategory from 'utils/pluralizeCategory';

import ProductCategory from 'components/ProductCategory';
import Cannabinoids from 'components/Cannabinoids';

import IconPlus from 'images/sprite/plus.svg';
import IconHeart from 'images/sprite/heart.svg';
import './styles.scss';

const quantities = ['1', '2', '3', '4', '5'];

type Props = {
  data: Map<string, any>,
  addToCart: Function,
  shopifyProduct: ?Object,
  followLikeProduct: Function,
  currentUser: Object,
  follows: Object,
  likes: Object,
};
type State = {
  quantity: string,
  product: ?Object,
};

class ProductProfile extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props) {
    const { shopifyProduct } = nextProps;
    return {
      product: shopifyProduct,
    };
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      quantity: '1',
      product: props.shopifyProduct,
    };
  }
  followLikeProduct = (actionType: string) => {
    this.props.followLikeProduct(this.props.data.get('_id'), actionType);
  };
  render() {
    const { data, addToCart, follows, likes, currentUser } = this.props;
    if (!data) return null;
    const { quantity, product } = this.state;

    const name = data.get('name');
    const photos = data.get('photos');
    const producer = data.getIn(['business', 'name']);
    const businessCategory = data.getIn(['business', '__t']);
    const businessCategoryPlural =
      businessCategory && pluralizeCategory(businessCategory);
    const businessSlug = data.getIn(['business', 'slug']);
    const productCategory = data.get('__t');
    const categoryPlural = pluralizeCategory(productCategory);
    const slug = data.get('slug');
    const price = data.getIn(['variants', 0, 'price']);
    const priceInfo = (
      <div>
        <span className="productProfile__price">
          <ProductPrice
            price={price}
            unit={data.getIn(['variants', '0', 'doseUnit'])}
            doseAmount={data.getIn(['variants', '0', 'doseAmount'])}
          />
        </span>
      </div>
    );
    const thumbnail =
      data.get('thumbnail') || data.getIn(['business', 'thumbnail']);
    return (
      <div className="productProfile row">
        <div
          className={cx(
            'small-12 columns',
            this.props.shopifyProduct ? 'medium-6' : 'medium-4'
          )}
        >
          {photos.size ? (
            <ProductGallery data={photos} title={name} />
          ) : (
            <div
              className="productProfile__thumbnail mb-md"
              style={{ backgroundImage: `url(${String(thumbnail)})` }}
            />
          )}
        </div>
        <div
          className={cx(
            'small-12 columns',
            this.props.shopifyProduct ? 'medium-6' : 'medium-8'
          )}
        >
          <h2 className="c-darkest-gray">{name}</h2>
          {producer &&
            businessCategoryPlural &&
            businessSlug && (
              <div className="productProfile__producerName">
                <Link
                  className="productProfile__producerNameLink"
                  to={`/${businessCategoryPlural}/${businessSlug}`}
                >
                  by {producer}
                </Link>
              </div>
            )}
          <div className="row">
            {data.get('category') && (
              <div className="shrink column">
                <ProductCategory data={data.get('category')} />
              </div>
            )}
            <div className="shrink column">
              <Cannabinoids
                thc={data.get('thcHigh')}
                cbd={data.get('cbdHigh')}
                category={productCategory}
              />
            </div>
          </div>
          <div className="row align-middle mb-md">
            <div className="column small-12 large-expand mb-md">
              <ReviewCount
                reviewCount={data.get('reviews').size}
                ratingsAverage={data.get('rating')}
                to={`/${categoryPlural}/${slug}/reviews`}
              />
            </div>
            <div className="shrink column mb-md">
              <Link
                to={`/${categoryPlural}/${slug}/create-review`}
                className="button secondary"
              >
                Review
              </Link>
            </div>
          </div>
          <div className="row align-middle mb-md">
            <div className="column">{priceInfo}</div>
            <div className="shrink column right">
              {currentUser ? (
                <ProductAction
                  glyph={IconPlus}
                  title="Follow"
                  count={follows && follows.get('count')}
                  onClick={() => this.followLikeProduct('follow')}
                />
              ) : (
                <RequireAuth toDo="follow products">
                  <ProductAction
                    glyph={IconPlus}
                    title="Follow"
                    count={follows && follows.get('count')}
                  />
                </RequireAuth>
              )}
            </div>
            <div className="shrink column">
              {currentUser ? (
                <ProductAction
                  glyph={IconHeart}
                  title="Like"
                  count={likes && likes.get('count')}
                  onClick={() => this.followLikeProduct('like')}
                />
              ) : (
                <RequireAuth toDo="like product">
                  <ProductAction
                    glyph={IconHeart}
                    title="Like"
                    count={likes && likes.get('count')}
                  />
                </RequireAuth>
              )}
            </div>
          </div>
          {product &&
            product.options.map(option => {
              if (option.values.length <= 1) {
                // products with no variants should not show the dropdown UI
                // see related: `var variant_title` and 'Default Title'
                return '';
              }
              return (
                <div className="row align-middle mb-sm" key={option.name}>
                  <div className="shrink column npr mb-sm">
                    <label htmlFor={option.name}>{option.name}</label>
                  </div>
                  <div className="column mb-sm">
                    <CustomSelect
                      className="large"
                      name={option.name}
                      options={transformOptions(option.values)}
                      clearable={false}
                      value={option.selected}
                      onChange={e => {
                        product.options.filter(
                          filteredOption => filteredOption.name === option.name
                        )[0].selected =
                          e.value;
                        this.setState({ product });
                      }}
                    />
                  </div>
                </div>
              );
            })}
          {product && (
            <div className="row align-middle">
              <div className="shrink column mb-md">
                <label htmlFor="qty">Quantity</label>
              </div>
              <div className="small-expand medium-shrink column mb-md">
                <CustomSelect
                  className="large"
                  name="qty"
                  options={transformOptions(quantities)}
                  value={quantity}
                  clearable={false}
                  onChange={e =>
                    this.setState({
                      quantity: e.value,
                    })
                  }
                />
              </div>
              <div className="small-12 medium-expand column mb-md">
                <Button
                  className="productProfile__addToBagButton expanded"
                  onClick={() => addToCart(product, quantity)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default ProductProfile;
