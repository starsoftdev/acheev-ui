// @flow

import React, { Component } from 'react';
import ReviewStatusItem from 'components/ReviewStatusList/ReviewStatusItem';
import Preloader from 'components/Preloader';
import { List } from 'immutable';

type Props = {
  data: List<Map<string, Object>>,
  isLoading: boolean,
};

class ReviewStatusList extends Component<Props> {
  render() {
    const { data, isLoading } = this.props;
    return (
      <div>
        {isLoading ? (
          <Preloader />
        ) : (
          data &&
          data
            .entrySeq()
            .map(([key, value]) => <ReviewStatusItem key={key} data={value} />)
        )}
      </div>
    );
  }
}

export default ReviewStatusList;
