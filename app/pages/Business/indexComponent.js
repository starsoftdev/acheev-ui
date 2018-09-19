// @flow

import React, { Component } from 'react';
import { matchPath } from 'react-router';

import BusinessSearch from 'containers/BusinessSearch';

type Props = {
  match: Object,
};

const data = {
  clinics: {
    category: 'Clinic',
  },
  producers: {
    category: 'Producer',
  },
};

class BusinessPage extends Component<Props> {
  render() {
    const { url } = this.props.match;
    const {
      params: { slug },
    } = matchPath(url, {
      path: '/:slug',
    });
    const { category } = data[slug];
    return <BusinessSearch category={category} slug={slug} {...this.props} />;
  }
}

export default BusinessPage;
