// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import About from 'containers/BusinessProfile/About';

import { setBreadcrumbPath } from 'containers/BusinessProfile/sagas';

type Props = {
  slug: string,
  business: Object,
  setBreadcrumbPath: Function,
  category: string,
};

class BusinessAboutPage extends Component<Props> {
  render() {
    const { slug, business, category } = this.props;
    return (
      <About
        category={category}
        slug={slug}
        business={business}
        setBreadcrumbPath={this.props.setBreadcrumbPath}
      />
    );
  }
}

const mapStateToProps = state => ({
  business: state.getIn(['profile', 'business', 'data']),
});

const mapDispatchToProps = dispatch => ({
  setBreadcrumbPath: path => dispatch(setBreadcrumbPath(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(BusinessAboutPage);
