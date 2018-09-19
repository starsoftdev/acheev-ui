// @flow

import React, { Component } from 'react';
import { matchPath } from 'react-router';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Map, fromJS } from 'immutable';

import { getIn } from 'utils/immutable';
import injectSagas from 'utils/injectSagas';

import Helmet from 'components/Helmet';
import Breadcrumbs from 'components/Breadcrumbs';
import Preloader from 'components/Preloader';
import PageHeader from 'components/PageHeader';
import PageMenu from 'components/PageMenu';

import { setMetaJson } from 'containers/App/sagas';
import saga, { reducer, requestMemberProfile } from './sagas';

import Routes from './routes';

type Props = {
  match: Object,
  requestMemberProfile: Function,
  data: Map<string, string>,
  setMetaJson: Function,
  location: Object,
};

class MemberProfileContainer extends Component<Props> {
  componentWillMount() {
    this.props.requestMemberProfile(this.props.match.params.slug);
  }
  componentWillReceiveProps({ data }: Props) {
    let userMetaJson = {};

    if (data && data.size > 0) {
      userMetaJson = {
        '@type': 'Person',
        birthDate: data.getIn(['hits', '0', 'birthday']),
        givenName: data.getIn(['hits', '0', 'firstName']),
        familyName: data.getIn(['hits', '0', 'lastName']),
        gender: data.getIn(['hits', '0', 'gender']),
        image: data.getIn(['hits', '0', 'picture']),
        description: data.getIn(['hits', '0', 'bio']),
        address: {
          '@type': 'PostalAddress',
          addressLocality: data.getIn(['hits', '0', 'city']),
          addressRegion: data.getIn(['hits', '0', 'province']),
          postalCode: data.getIn(['hits', '0', 'postalCode']),
          streetAddress: data.getIn(['hits', '0', 'fullLocation']),
        },
      };
      this.props.setMetaJson(['mainEntity'], userMetaJson);
    }
  }
  render() {
    const { match: { params: { slug }, url }, data, location } = this.props;
    const title = getIn(
      matchPath(location.pathname, {
        path: '/members/:slug/:sub',
      }),
      ['params', 'sub'],
      'profile'
    );
    const pathname = `/members/${slug}`;
    let helmetTitle = `${title} - Lift`;
    if (data && data.get('count') === 0) {
      return (
        <div className="row column mb-xl">
          <h3>User not found</h3>
        </div>
      );
    }
    if (getIn(data, ['hits', '0', 'username'])) {
      helmetTitle = `${String(
        data.getIn(['hits', '0', 'username'])
      )} ${title} - Lift`;
    }
    const breadcrumbPath = [
      {
        link: '',
        title: 'Members',
      },
    ];
    if (title === 'profile') {
      breadcrumbPath.push({
        link: '',
        title: slug,
      });
    } else {
      breadcrumbPath.push({
        link: `/members/${slug}`,
        title: slug,
      });
      breadcrumbPath.push({
        link: '',
        title,
      });
    }
    const menuItems = fromJS([
      {
        name: 'Profile',
        link: pathname,
      },
      {
        name: 'Following',
        link: `${pathname}/following`,
      },
      {
        name: 'Reviews',
        link: `${pathname}/reviews`,
      },
    ]);
    return (
      <div>
        <Helmet title={helmetTitle} />
        <Breadcrumbs path={fromJS(breadcrumbPath)} />
        <PageHeader title={getIn(data, ['hits', '0', 'username'])} />
        <PageMenu
          data={menuItems}
          location={location}
          titlePath={['name']}
          slugPath={['link']}
        />
        {data ? (
          <Routes url={url} slug={slug} />
        ) : (
          <div className="row column">
            <Preloader height={375} />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.getIn(['memberProfile', 'profile', 'data']),
});

const mapDispatchToProps = dispatch => ({
  requestMemberProfile: slug => dispatch(requestMemberProfile(slug)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default compose(
  injectSagas({ key: 'memberProfile', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(MemberProfileContainer);
