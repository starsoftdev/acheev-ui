// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { Map, fromJS } from 'immutable';
import injectSagas from 'utils/injectSagas';

import Preloader from 'components/Preloader';
import ProductsList from 'components/ProductsList';
import Pagination from 'components/Pagination';

import { setProfileBreadcrumbPath } from 'containers/App/sagas';
import saga, { reducer, requestFollowings } from './sagas';

import './styles.scss';

type Props = {
  user: Object,
  isLoading: boolean,
  followings: Map<string, any>,
  pages: number,
  requestFollowings: Function,
  setProfileBreadcrumbPath: Function,
};

class MyFollowings extends Component<Props> {
  componentWillMount() {
    const breadcrumbPath = fromJS([
      {
        link: '/me',
        title: 'My Account',
      },
      {
        link: '',
        title: 'My Followings',
      },
    ]);
    this.props.setProfileBreadcrumbPath(breadcrumbPath);
  }
  componentDidMount() {
    this.props.requestFollowings(this.props.user.get('_id'));
  }
  render() {
    const { followings, isLoading, pages } = this.props;
    return (
      <div className="myFollowings">
        <div className="row column">
          {isLoading ? (
            <Preloader height={348} />
          ) : (
            !!followings && <ProductsList data={followings.get('hits')} />
          )}
          <Pagination
            pageCount={Math.ceil(pages)}
            onPageChange={e =>
              this.props.requestFollowings(
                this.props.user.get('_id'),
                ['model', 'page'],
                e
              )}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
  isLoading: state.getIn(['myfollowings', 'isLoading']),
  followings: state.getIn(['myfollowings', 'data']),
  pages: state.getIn(['myfollowings', 'data', 'pages']),
});

const mapDispatchToProps = dispatch => ({
  requestFollowings: (userId, path, value) =>
    dispatch(requestFollowings(userId, path, value)),
  setProfileBreadcrumbPath: path => dispatch(setProfileBreadcrumbPath(path)),
});

export default compose(
  injectSagas({ key: 'myfollowings', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(MyFollowings);
