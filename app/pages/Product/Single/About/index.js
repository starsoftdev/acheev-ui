// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { history } from 'components/ConnectedRouter';
import { generate } from 'shortid';
import { get, getIn } from 'utils/immutable';
import pluralizeCategory from 'utils/pluralizeCategory';
import title from 'utils/title';

import ButtonGroup from 'components/ButtonGroup';
import Tab from 'components/RouterTab';
import BorderedTitle from 'components/BorderedTitle';
import Preloader from 'components/Preloader';
import ProductsList from 'components/ProductsList';
import ProductMeta from 'components/ProductMeta';
import Select from 'components/Select';
import Helmet from 'components/Helmet';
import NoReviewBanner from 'components/NoReviewBanner';
import Link from 'components/Link';

import {
  requestOtherProducts,
  requestMeta,
  setBreadcrumbPath,
} from 'containers/Product/sagas';

type Props = {
  data: Object,
  otherData: Object,
  otherIsLoading: boolean,
  metaData: Object,
  isMetaDataLoading: boolean,
  metaProductId: string,
  business: string,
  setBreadcrumbPath: Function,
  requestOtherProducts: Function,
  requestMeta: Function,
  slug: string,
};

class ProductAboutPage extends Component<Props> {
  componentDidMount() {
    const { data, metaProductId } = this.props;
    const id = get(data, '_id');

    if (data) {
      this.setBreadcrumbPath(data);
    }
    this.props.requestOtherProducts(id);
    if (data && metaProductId !== id) {
      this.props.requestMeta(id);
    }
  }

  componentDidUpdate(oldProps: Props) {
    const { data, otherIsLoading, metaProductId } = this.props;
    const id = get(data, '_id');
    const wasLoadingOtherProducts = oldProps.otherIsLoading;

    if (data && wasLoadingOtherProducts && !otherIsLoading) {
      this.setBreadcrumbPath(data);
    }
    if (data && metaProductId !== id) {
      this.props.requestMeta(id);
    }
  }

  setBreadcrumbPath = (data: Object) => {
    const category = pluralizeCategory(get(data, '__t'));
    const breadcrumbPath = fromJS([
      {
        link: `/${category}`,
        title: `${category}`,
      },
      {
        link: '',
        title: get(data, 'name', ''),
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  };

  render() {
    const {
      data,
      otherData,
      otherIsLoading,
      metaData,
      isMetaDataLoading,
    } = this.props;
    const type = get(data, '__t');
    const category = pluralizeCategory(type);
    const baseUrl = `/${category}/${this.props.slug}`;
    const tabOptions = ['About', 'Reviews'];
    const slug = get(data, 'slug');
    const reviewCount = get(data, 'reviewCount');
    const email = getIn(data, ['business', 'email']);
    const description = get(data, 'description');

    if (category !== 'accessories') {
      tabOptions.push('Photos');
    }
    return (
      <div>
        <div className="row column mb-xl">
          <Helmet
            title={title({ name: get(data, 'name'), type, prefix: 'About' })}
          />
          <ButtonGroup className="centered mb-lg hide-for-small-only">
            <Tab to={baseUrl}>About</Tab>
            <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
            {category !== 'accessories' && (
              <Tab to={`${baseUrl}/photos`}>Photos</Tab>
            )}
          </ButtonGroup>
          <Select
            className="blackTheme mb-lg show-for-small-only b-primary"
            value=""
            onChange={e =>
              history.push(`${baseUrl}/${e.target.value.toLowerCase()}`)
            }
          >
            {tabOptions.map(item => (
              <option key={generate()} value={item}>
                {item}
              </option>
            ))}
          </Select>
          <BorderedTitle>About</BorderedTitle>
          {get(data, 'description') ? (
            <section
              className="t-columns mb-xl"
              dangerouslySetInnerHTML={{
                __html: description,
              }}
            />
          ) : (
            <section className="fs-base mb-xl">
              This producer has yet to submit a product description.&nbsp;
              {email && (
                <span>
                  <Link
                    className="fs-base t-nt"
                    to={`mailto:${email}`}
                    target="_top"
                  >
                    Email
                  </Link>{' '}
                  them and let them know!
                </span>
              )}
            </section>
          )}
        </div>
        {category !== 'accessories' && (
          <div className="mb-xl">
            {isMetaDataLoading ? (
              <Preloader height={200} />
            ) : (
              <div>
                {reviewCount < 5 && (
                  <NoReviewBanner to={`/${category}/${slug}/create-review`} />
                )}
                {metaData &&
                  reviewCount >= 5 && <ProductMeta data={metaData} />}
              </div>
            )}
          </div>
        )}
        <div className="row column mb-xl">
          {otherIsLoading ? (
            <Preloader height={200} />
          ) : (
            <div>
              {otherData && (
                <div>
                  <BorderedTitle element="h4">
                    Other products you might like
                  </BorderedTitle>
                  <ProductsList data={otherData} noBorder />
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.getIn(['product', 'data', 'hits', 0]),
  metaData: state.getIn(['product', 'meta', 'data']),
  isMetaDataLoading: state.getIn(['product', 'meta', 'isLoading']),
  metaProductId: state.getIn(['product', 'meta', 'id']),
  otherData: state.getIn(['product', 'other', 'data']),
  otherIsLoading: state.getIn(['product', 'other', 'isLoading']),
  business: state.getIn(['product', 'business']),
});

const mapDispatchToProps = dispatch => ({
  requestMeta: productId => dispatch(requestMeta(productId)),
  requestOtherProducts: productId => dispatch(requestOtherProducts(productId)),
  setBreadcrumbPath: path => dispatch(setBreadcrumbPath(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductAboutPage);
