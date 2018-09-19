// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import About from 'containers/BusinessProfile/About';

import {
  setBreadcrumbPath,
  setHelmetTitle,
} from 'containers/BusinessProfile/sagas';

type Props = {
  params: Object,
  business: Object,
  setBreadcrumbPath: Function,
  setHelmetTitle: Function,
};

class ProducerAboutPage extends Component<Props> {
  render() {
    const { params, business } = this.props;
    return (
      <About
        category="producer"
        params={params}
        business={business}
        setBreadcrumbPath={this.props.setBreadcrumbPath}
        setHelmetTitle={this.props.setHelmetTitle}
      />
    );
  }
}

const mapStateToProps = state => ({
  business: state.getIn(['profile', 'business', 'data']),
});

const mapDispatchToProps = dispatch => ({
  setBreadcrumbPath: path => dispatch(setBreadcrumbPath(path)),
  setHelmetTitle: title => dispatch(setHelmetTitle(title)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProducerAboutPage);
