// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import type { Map } from 'immutable';

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
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';
import CannabisAwards from 'components/CannabisAwards';

import IconPlus from 'images/sprite/plus.svg';
import IconHeart from 'images/sprite/heart.svg';
import IconQuestion from 'images/sprite/question-circle.svg';
import ImgAwardsBadge from './awards-badge.png';
import './styles.scss';

const quantities = ['1', '2', '3', '4', '5'];

type Props = {
  data: Map<string, any>,
  addToCart: Function,
  shopifyProduct: ?Object,
  followLikeProduct: Function,
  currentUser: Object,
  follows: Map<string, any>,
  likes: Object,
};
type State = {
  quantity: string,
  product: ?Object,
};

class CannabisProductProfile extends Component<Props, State> {
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
    const availabilityStatus = data.getIn([
      'variants',
      '0',
      'availabilityStatus',
    ]);
    const awards = data.get('awards');
    const stockTooltipContent = `Always check with ${String(
      producer
    )} to confirm availability`;
    const productCategory = data.get('__t');
    const categoryPlural = pluralizeCategory(productCategory);
    const slug = data.get('slug');
    const price = data.getIn(['variants', 0, 'price']);
    const priceInfo = (
      <div>
        <span className="cannabisProductProfile__price">
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
      <div className="cannabisProductProfile row">
        <div className="shrink column hide-for-small-only">
          {photos.size ? (
            <ProductGallery data={photos} title={name} />
          ) : (
            <div
              className="cannabisProductProfile__thumbnail mb-md"
              style={{ backgroundImage: `url(${String(thumbnail)})` }}
            >
              {awards &&
                awards.size > 0 && <img alt="awards" src={ImgAwardsBadge} />}
            </div>
          )}
        </div>
        <div className="column small-12 medium-expand">
          <div className="row">
            <div className="column small-12 medium-7">
              <h1 className="cannabisProductProfile__title small-only-text-center">
                {name}
              </h1>
            </div>
            <div className="column small-12 medium-5 text-right hide-for-small-only">
              <div className="mt-mx mb-tn">{priceInfo}</div>
              {availabilityStatus === 'discontinued' && (
                <div className="cannabisProductProfile__availabilityStatus">
                  {availabilityStatus}
                  <Tooltip
                    tooltipPosition="top"
                    tooltipIndicator={false}
                    tooltipContent={stockTooltipContent}
                    triggerFocus={false}
                    triggerClick={false}
                  >
                    <div className="cannabisProductProfile__questionIconContainer">
                      <Icon
                        glyph={IconQuestion}
                        size={12}
                        className="cannabisProductProfile__questionIcon"
                      />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
          {producer &&
            businessCategoryPlural &&
            businessSlug && (
              <div className="cannabisProductProfile__producerName small-only-text-center">
                <Link
                  className="cannabisProductProfile__producerNameLink"
                  to={`/${businessCategoryPlural}/${businessSlug}`}
                >
                  by {producer}
                </Link>
              </div>
            )}
          <div className="row">
            {data.get('category') && (
              <div className="shrink column mb-sm">
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
          <div className="row column">
            <div className="bb-light-gray mb-md show-for-small-only" />
          </div>
          <div className="row align-middle mb-sm">
            <div className="column small-6 large-expand mb-md">
              <ReviewCount
                reviewCount={data.get('reviews').size}
                ratingsAverage={data.get('rating')}
                to={`/${categoryPlural}/${slug}/reviews`}
              />
            </div>

            <div className="column small-6 medium-shrink text-right show-for-small-only mb-md">
              {!!price && priceInfo}
              {availabilityStatus === 'discontinued' && (
                <div className="cannabisProductProfile__availabilityStatus">
                  {availabilityStatus}
                  <Tooltip
                    tooltipPosition="top"
                    tooltipIndicator={false}
                    tooltipContent={stockTooltipContent}
                    triggerFocus={false}
                  >
                    <div className="cannabisProductProfile__questionIconContainer">
                      <Icon
                        glyph={IconQuestion}
                        size={12}
                        className="cannabisProductProfile__questionIcon"
                      />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
          </div>
          <div className="row align-middle mb-sm">
            <div className="column small-12 medium-expand">
              <div className="row">
                <div className="shrink column mb-lg">
                  {currentUser ? (
                    <Link
                      to={`/${categoryPlural}/${slug}/create-review`}
                      className="button small secondary"
                    >
                      Review
                    </Link>
                  ) : (
                    <RequireAuth toDo="review product">
                      <Link className="button small secondary">Review</Link>
                    </RequireAuth>
                  )}
                </div>
              </div>
            </div>
            <div className="column small-12 medium-shrink">
              <div className="row align-middle">
                <div className="shrink column ">
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
                <div className="shrink column ">
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
            <div className="cannabisProductProfile__buySection row align-middle">
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
                  className="cannabisProductProfile__addToBagButton expanded"
                  onClick={() => addToCart(product, quantity)}
                >
                  Add to Cart
                </Button>
              </div>
            </div>
          )}
        </div>
        <div className="column small-12">
          <CannabisAwards data={awards} />
        </div>
      </div>
    );
  }
}

export default CannabisProductProfile;
