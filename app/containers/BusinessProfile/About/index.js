// @flow

import React, { Component } from 'react';
import { history } from 'components/ConnectedRouter';
import { generate } from 'shortid';
import { fromJS } from 'immutable';
import type { Map } from 'immutable';
import { get } from 'utils/immutable';
import title from 'utils/title';

import Helmet from 'components/Helmet';
import BorderedTitle from 'components/BorderedTitle';
import Tab from 'components/RouterTab';
import ButtonGroup from 'components/ButtonGroup';
import Select from 'components/Select';
import NoReviewBanner from 'components/NoReviewBanner';

import pluralizeCategory from 'utils/pluralizeCategory';

type Props = {
  slug: string,
  category: string,
  business: Map<*, *>,
  setBreadcrumbPath: Function,
};

class AboutContainer extends Component<Props> {
  componentDidUpdate({ business }: Props) {
    if (this.props.business.size && !business.size) {
      this.setBreadcrumbPath(this.props.business);
    }
  }
  setBreadcrumbPath = (data: Object) => {
    const category = pluralizeCategory(this.props.category);
    const breadcrumbPath = fromJS([
      {
        link: '/businesses',
        title: 'Businesses',
      },
      {
        link: `/${category}`,
        title: category,
      },
      {
        link: '',
        title: get(data, 'name', ''),
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  };
  render() {
    const { category, business, slug } = this.props;
    const baseUrl = `/${category}/${slug}`;
    const description = business.get('description');
    const options = ['About', 'Reviews'];

    if (category === 'producers') {
      options.push('Products');
    }
    const reviewCount = business && business.get('reviewCount');
    return (
      <div>
        <Helmet
          title={title({
            name: get(business, 'name'),
            type: get(business, '__t'),
            postfix: 'Info',
          })}
        />
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={baseUrl}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>
            {category === 'producers' ? 'Business Reviews' : 'Reviews'}
          </Tab>
          {category === 'producers' && (
            <Tab to={`${baseUrl}/product-reviews`}>Product Reviews</Tab>
          )}
          {category === 'producers' && (
            <Tab to={`${baseUrl}/products`}>Products</Tab>
          )}
        </ButtonGroup>
        <div className="row">
          <div className="column">
            <Select
              className="blackTheme mb-lg show-for-small-only b-primary"
              value=""
              onChange={e => {
                if (e.target.value === 'About') {
                  history.push(baseUrl);
                } else {
                  history.push(`${baseUrl}/${e.target.value.toLowerCase()}`);
                }
              }}
            >
              {options.map(item => (
                <option key={generate()} value={item}>
                  {item}
                </option>
              ))}
            </Select>
          </div>
        </div>
        <div className="row column">
          {description ? (
            <div>
              <div className="row">
                <div className="column">
                  <BorderedTitle>About</BorderedTitle>
                </div>
              </div>
              <div className="row mb-lg fs-md">
                <div
                  className="column"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </div>
            </div>
          ) : (
            <BorderedTitle>No description yet</BorderedTitle>
          )}
        </div>
        {reviewCount < 5 && (
          <NoReviewBanner to={`${baseUrl}/create-review`} type="business" />
        )}
      </div>
    );
  }
}

export default AboutContainer;
