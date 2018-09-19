// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import moment from 'moment';
import cx from 'classnames';

import pluralizeCategory from 'utils/pluralizeCategory';

import TimeAgo from 'components/TimeAgo';
import Label from 'components/Label';
import StarRating from 'components/StarRating';
import RequireAuth from 'components/RequireAuth';
import ProductCard from 'components/ProductCard';
import BusinessCard from 'components/BusinessCard';

import './styles.scss';

type Props = {
  category: string,
  data: Object,
  slug: string,
  voteReview: Function,
  currentUser: ?Object,
  deleteReview: Function,
  context?: Function, // flag which is used to determine layout based on review list container.
  lpVersion?: boolean,
};

class ReviewItem extends Component<Props> {
  voteReview = (type: string) => {
    const { data } = this.props;
    const reviewId = data.get('_id');
    this.props.voteReview(reviewId, type);
  };
  deleteReview = () => {
    const { data } = this.props;
    const reviewId = data.get('_id');
    if (confirm("Are you sure you'd like to remove this review?")) {
      this.props.deleteReview(reviewId);
    }
  };
  render() {
    const {
      data,
      currentUser,
      slug,
      category,
      context,
      lpVersion,
    } = this.props;

    const reviewId = data.get('_id');
    const userAvatar = data.getIn(['user', 'picture']);
    const userName = data.getIn(['user', 'username']);
    const userId = data.getIn(['user', '_id']);
    const userSlug = data.getIn(['user', 'slug']);
    const userReputation = data.getIn(['user', 'reputation']);
    const helpfulReviewCount = data.getIn(['user', 'helpfulReviewCount']);
    const reviewCount = data.getIn(['user', 'reviewCount']);
    let userJoinDate = data.getIn(['user', 'createdOn']);
    if (userJoinDate) {
      userJoinDate = moment(userJoinDate).format('MM/YY');
    }
    const guestName = data.getIn(['guest', 'name'], '');
    const rating = data.get('rating');
    const reviewDate = data.get('createdOn');
    const upVotesCount = data.get('upVotes') ? data.get('upVotes').size : 0;
    const downVotesCount = data.get('downVotes')
      ? data.get('downVotes').size
      : 0;
    const title = data.get('title') ? data.get('title') : null;
    const currentUserId = currentUser ? currentUser.get('_id') : 0;
    const currentUserRole = currentUser ? currentUser.get('role') : '';
    const canRemoveItem =
      userId === currentUserId ||
      currentUserRole === 'admin' ||
      currentUserRole === 'ambassador';

    let targetCategory = category;
    let targetSlug = slug;

    const targetData = data.get(category);

    if (context === 'public') {
      if (category === 'product') {
        targetCategory = 'product';
        targetSlug = data.getIn(['product', 'slug']);
      } else if (category === 'business') {
        targetCategory = data.getIn(['business', '__t'], '').toLowerCase();
        targetSlug = data.getIn(['business', 'slug']);
      }
    }

    const categoryPlural = pluralizeCategory(targetCategory);

    let purchaseValueClass = 'reviewItem__purchaseValue';
    if (data.get('wouldPurchaseAgain')) {
      purchaseValueClass = cx(
        purchaseValueClass,
        'reviewItem__purchaseValue--yes'
      );
    } else {
      purchaseValueClass = cx(
        purchaseValueClass,
        'reviewItem__purchaseValue--no'
      );
    }

    let message = data.get('message');
    if (!message && rating) {
      message = `${userName} rated this ${category} ${rating}/5`;
    }
    return (
      <div className="reviewItem row column mb-md">
        <div className="reviewItem__reviewItemRow">
          <div className="row mb-md">
            {context === 'public' &&
              targetData && (
                <div className="column small-12 medium-4 large-3">
                  <div className="reviewItem__cardContainer">
                    {category === 'business' ? (
                      <BusinessCard data={targetData} hideReview />
                    ) : (
                      <ProductCard data={targetData} hideReview />
                    )}
                  </div>
                </div>
              )}
            {!lpVersion &&
              context !== 'public' && (
                <div className="shrink column small-12">
                  {userAvatar ? (
                    <div
                      className="reviewItem__image"
                      style={{ backgroundImage: `url('${userAvatar}')` }}
                    />
                  ) : (
                    <div className="reviewItem__image reviewItem__image--default" />
                  )}
                </div>
              )}
            {!lpVersion &&
              context !== 'public' && (
                <div className="column small-12 medium-3">
                  <div className="mb-mn">
                    {userId ? (
                      <Link
                        to={`/members/${userSlug}`}
                        className="reviewItem__userName"
                      >
                        {userName}
                      </Link>
                    ) : (
                      <div className="t-lowercase fs-xl">{guestName}</div>
                    )}
                  </div>

                  {userId && (
                    <div>
                      <div className="t-uppercase fs-sm">
                        Reputation <strong>{userReputation}</strong>
                      </div>
                      <div className="t-uppercase fs-sm">
                        Helpful Reviews <strong>{helpfulReviewCount}</strong>
                      </div>
                      <div className="t-uppercase fs-sm">
                        Reviews <strong>{reviewCount}</strong>
                      </div>
                      <div className="t-uppercase fs-sm">
                        Joined <strong>{userJoinDate}</strong>
                      </div>
                      <Link to={`/members/${userSlug}/reviews`}>
                        View Reviews
                      </Link>
                    </div>
                  )}
                </div>
              )}
            <div className="column">
              <div className="row mb-md">
                {lpVersion && (
                  <div className="mb-sm column small-12">
                    {userAvatar ? (
                      <div
                        className="reviewItem__image reviewItem__image--lpVersion"
                        style={{ backgroundImage: `url('${userAvatar}')` }}
                      />
                    ) : (
                      <div className="reviewItem__image reviewItem__image--default" />
                    )}
                    {userId ? (
                      <Link
                        to={`/members/${userSlug}`}
                        className="reviewItem__userName reviewItem__userName--lpVersion"
                      >
                        {userName}
                      </Link>
                    ) : (
                      <div className="t-lowercase fs-xl">{guestName}</div>
                    )}
                  </div>
                )}
                <div className="column small-12 medium-8 large-9">
                  {context === 'public' && (
                    <div className="row align-middle mb-md">
                      <div className="shrink column">
                        {userAvatar ? (
                          <div
                            className="reviewItem__smallImage"
                            style={{ backgroundImage: `url('${userAvatar}')` }}
                          />
                        ) : (
                          <div className="reviewItem__smallImage reviewItem__smallImage--default" />
                        )}
                      </div>
                      <div className="shrink column">
                        {userId ? (
                          <Link
                            to={`/members/${userSlug}`}
                            className="reviewItem__userName"
                          >
                            {userName}
                          </Link>
                        ) : (
                          <div className="t-lowercase fs-xl">{guestName}</div>
                        )}
                      </div>
                    </div>
                  )}
                  <div className="row align-middle mb-md">
                    <div className="column shrink">
                      <StarRating initialRating={rating} />
                    </div>
                    <div className="column shrink">
                      <TimeAgo data={reviewDate} />
                    </div>
                    {canRemoveItem && (
                      <Link className="fs-md mr-md" onClick={this.deleteReview}>
                        Remove
                      </Link>
                    )}
                  </div>
                  {title && lpVersion ? (
                    <div className="fs-mx t-capitalize">{title}</div>
                  ) : (
                    <div className="mb-md">
                      <Link
                        className="reviewItem__title"
                        to={`/${categoryPlural}/${targetSlug}/reviews/${reviewId}`}
                      >
                        {title}
                      </Link>
                    </div>
                  )}
                  <div className="reviewItem__ellipsisMessage">
                    <div dangerouslySetInnerHTML={{ __html: message }} />
                  </div>
                </div>
                <div className="column small-12 medium-4 large-3">
                  <div className="mb-mn reviewItem__batchTitle">
                    Would you purchase again?
                  </div>
                  <div className={purchaseValueClass}>
                    {data.get('wouldPurchaseAgain') ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
              {currentUserId !== userId &&
                !lpVersion && (
                  <div className="row align-bottom">
                    <div className="column">
                      <div className="row mb-sm">
                        <div className="column fs-md t-uppercase">
                          <strong>Was this review helpful?</strong>
                        </div>
                      </div>
                      {currentUserId && currentUserId !== userId ? (
                        <div className="row mb-md">
                          <div className="column shrink">
                            <Link
                              className="reviewItem__voteLink"
                              onClick={() => {
                                this.voteReview('up');
                              }}
                            >
                              Yes
                            </Link>
                            <Label className="success fs-md" hasArrow>
                              {upVotesCount}
                            </Label>
                          </div>
                          <div className="column shrink">
                            <Link
                              className="reviewItem__voteLink"
                              onClick={() => {
                                this.voteReview('down');
                              }}
                            >
                              No
                            </Link>
                            <Label className="danger fs-md" hasArrow>
                              {downVotesCount}
                            </Label>
                          </div>
                        </div>
                      ) : (
                        <div className="row mb-md">
                          <div className="column shrink">
                            <RequireAuth toDo="vote reviews">
                              <Link className="reviewItem__voteLink">Yes</Link>
                              <Label className="success fs-md" hasArrow>
                                {upVotesCount}
                              </Label>
                            </RequireAuth>
                          </div>
                          <div className="column shrink">
                            <RequireAuth toDo="vote reviews">
                              <Link className="reviewItem__voteLink">No</Link>
                              <Label className="danger fs-md" hasArrow>
                                {downVotesCount}
                              </Label>
                            </RequireAuth>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default ReviewItem;
