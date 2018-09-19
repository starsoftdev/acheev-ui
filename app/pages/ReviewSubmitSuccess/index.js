// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { history } from 'components/ConnectedRouter';
import Link from 'components/Link';
import FeatureList from 'components/FeatureList';

import AnalyticsPages from 'enum/analytics/pages';

import './styles.scss';

type Props = {
  user: Object,
};

type State = {
  points: number,
};

class ReviewSubmitSuccessPage extends Component<Props, State> {
  constructor(props: Object) {
    super(props);
    const points = parseInt(localStorage.getItem('points') || 0, 10);
    this.state = {
      points,
    };
    localStorage.removeItem('points');
  }
  componentDidMount() {
    if (this.state.points === 0) {
      history.push('/');
    } else {
      analytics.page(AnalyticsPages.REVIEW_SUBMIT_SUCCESS);
    }
  }
  render() {
    const { user } = this.props;
    const { points } = this.state;
    return (
      <div className="reviewSubmitSuccessPage">
        <div className="row column text-center mb-lg">
          <h1 className="reviewSubmitSuccessPage__title">
            Thanks, {user && (user.get('firstName') || user.get('username'))}
          </h1>
          <h5 className="small-8 small-offset-2 c-secondary t-nt">
            <strong>
              Your review has been submitted and is pending approval. Review
              approval can take up to two business days. Check review
              status&nbsp;
              <Link to="me/reviews" className="reviewSubmitSuccessPage__link">
                here
              </Link>
            </strong>
          </h5>
        </div>
        <div className="row column text-center mb-lg">
          <div className="reviewSubmitSuccessPage__pointsCard">
            <h6 className="reviewSubmitSuccessPage__pointsCardSubtitle nm">
              You&rsquo;re eligible for
            </h6>
            <h1 className="reviewSubmitSuccessPage__pointsCardTitle mb-tn">
              {points}
            </h1>
            <h6 className="reviewSubmitSuccessPage__pointsCardSubtitle">
              lift points
            </h6>
          </div>
        </div>
        <div className="row column text-center mb-lg">
          <h6 className="reviewSubmitSuccessPage__msg">
            If you do not see your Lift Points in your account within two
            business days, please contact us at hello@lift.co.
          </h6>
        </div>
        <FeatureList />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'user']),
});

export default connect(mapStateToProps)(ReviewSubmitSuccessPage);
