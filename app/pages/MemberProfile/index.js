// @flow

import React, { Component } from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Preloader from 'components/Preloader';
import UserInfoCard from 'components/UserInfoCard';
import UserMetaInfoCard from 'components/UserMetaInfoCard';
import ReviewsContainer from 'containers/Reviews';
import ServiceCard from 'components/ServiceCard';

import injectSagas from 'utils/injectSagas';

import saga, {
  reducer,
  requestMemberProfile,
  requestMemberServices,
} from './sagas';

import './styles.scss';

type Props = {
  data: Object,
  isLoading: boolean,
  services: Array<Object>,
  isServiceLoading: boolean,
  requestMemberProfile: Function,
  requestMemberServices: Function,
  match: Object,
};

class MemberProfile extends Component<Props> {
  componentDidMount() {
    this.props.requestMemberProfile(this.props.match.params.username);
  }
  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.size === 0 && this.props.data.size > 0) {
      this.props.requestMemberServices(this.props.data.get('_id'));
    }
  }
  render() {
    const { data, isLoading, services, isServiceLoading } = this.props;
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
                <h1 className="memberProfile__title mb-lg">
                  {data && data.get('username')}
                  &apos;s Services
                </h1>
                {isServiceLoading ? (
                  <Preloader height={200} />
                ) : (
                  <div className="row">
                    {services.map(service => (
                      <div
                        className="column small-12 large-6"
                        key={service.get('_id')}
                      >
                        <ServiceCard data={service} bigImage />
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="memberProfile__reviews">
                <ReviewsContainer />
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
  services: state.getIn(['member', 'services']),
  isServiceLoading: state.getIn(['member', 'isServiceLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestMemberProfile: username => dispatch(requestMemberProfile(username)),
  requestMemberServices: userId => dispatch(requestMemberServices(userId)),
});

export default compose(
  injectSagas({ key: 'member', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(MemberProfile);
