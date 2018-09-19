// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';

import Preloader from 'components/Preloader';
import ContributorsList from 'components/Magazine/ContributorsList';

import { requestContributors } from 'pages/Magazine/sagas';

type Props = {
  contributors: Map<string, *>,
  requestContributors: Function,
  isLoading: boolean,
};

class MagazinePage extends React.Component<Props> {
  componentDidMount() {
    if (!this.props.contributors) this.props.requestContributors();
  }
  render() {
    const { contributors, isLoading } = this.props;
    return (
      <div className="magazineBG">
        {isLoading ? <Preloader /> : <ContributorsList data={contributors} />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  contributors: state.getIn(['magazine', 'contributors', 'items']),
  isLoading: state.getIn(['magazine', 'contributors', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestContributors: () => dispatch(requestContributors()),
});

export default connect(mapStateToProps, mapDispatchToProps)(MagazinePage);
