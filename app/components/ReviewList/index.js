// @flow

import React, { Component } from 'react';
import ReviewItem from 'components/ReviewList/ReviewItem';
import CannabisProductReviewItem from 'components/ReviewList/CannabisProductReviewItem';
import Preloader from 'components/Preloader';
import { List } from 'immutable';

type Props = {
  data: List<Map<string, Object>>,
  category: string,
  slug: string,
  isLoading: boolean,
  voteReview: Function,
  deleteReview: Function,
  currentUser: Object,
  context?: string,
  lpVersion?: boolean,
};

class ReviewList extends Component<Props> {
  render() {
    const {
      data,
      slug,
      category,
      isLoading,
      voteReview,
      deleteReview,
      currentUser,
      context,
      lpVersion,
    } = this.props;
    return (
      <div>
        {isLoading ? (
          <Preloader />
        ) : (
          data &&
          data.entrySeq().map(([key, value]) => {
            const type = value.get('__t');
            if (type === 'CannabisProductReview') {
              return (
                <CannabisProductReviewItem
                  category={category}
                  slug={slug}
                  key={key}
                  data={value}
                  currentUser={currentUser}
                  voteReview={voteReview}
                  deleteReview={deleteReview}
                  context={context}
                  lpVersion={lpVersion}
                />
              );
            }
            return (
              <ReviewItem
                category={category}
                slug={slug}
                key={key}
                data={value}
                currentUser={currentUser}
                voteReview={voteReview}
                deleteReview={deleteReview}
                context={context}
                lpVersion={lpVersion}
              />
            );
          })
        )}
      </div>
    );
  }
}

export default ReviewList;
