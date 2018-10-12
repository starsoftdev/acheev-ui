// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Preloader from 'components/Preloader';
import UserInfoCard from 'components/UserInfoCard';
import UserMetaInfoCard from 'components/UserMetaInfoCard';
import OfferReviewsContainer from 'containers/OfferReviews';

import injectSagas from 'utils/injectSagas';

import saga, { reducer, requestMemberProfile } from './sagas';

import './styles.scss';

type Props = {
  data: Object,
  isLoading: boolean,
  requestMemberProfile: Funciton,
  match: Object,
};

class MemberProfile extends Component<Props> {
  componentDidMount() {
    this.props.requestMemberProfile(this.props.match.params.username);
  }
  render() {
    const { data, isLoading } = this.props;
    if (isLoading) return <Preloader height={600} />;
    return (
      <div className="memberProfile">
        <div className="row">
          <div className="column small-12 large-4">
            <div className="row column mb-lg">
              <UserInfoCard user={data} />
            </div>
            <div className="row column mb-xl">
              <UserMetaInfoCard />
            </div>
          </div>
          <div className="column small-12 large-8">
            <div className="memberProfile__information">
              <div className="memberProfile__services">
                <h1 className="memberProfile__title">
                  {data && data.get('username')}
                  &apos;s Services
                </h1>
              </div>
              <div className="memberProfile__reviews">
                <OfferReviewsContainer />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.getIn(['member', 'data']),
  isLoading: state.getIn(['member', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestMemberProfile: username => dispatch(requestMemberProfile(username)),
});

export default compose(
  injectSagas({ key: 'member', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MemberProfile);
