// @flow
import React, { Component } from 'react';
import Link from 'components/Link';
import moment from 'moment';
import cx from 'classnames';

import pluralizeCategory from 'utils/pluralizeCategory';

import Cannabinoids from 'components/Cannabinoids';
import RequireAuth from 'components/RequireAuth';
import TimeAgo from 'components/TimeAgo';
import ProductPrice from 'components/ProductPrice';
import Label from 'components/Label';
import StarRating from 'components/StarRating';
import LightboxGallery from 'components/LightboxGallery';
import ProductCard from 'components/ProductCard';
import ItemDetail from './ItemDetail';

import './styles.scss';

type Props = {
  category: string,
  data: Object,
  slug: string,
  voteReview: Function,
  currentUser?: Object,
  deleteReview: Function,
  context?: string, // flag which is used to determine layout based on review list container.
  lpVersion?: boolean,
};

class CannabisProductReviewItem extends Component<Props> {
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
  handleChange = () => {};
  render() {
    const {
      data,
      currentUser,
      slug,
      category,
      context,
      lpVersion,
    } = this.props;

    let message = data.get('message');
    if (!message) {
      message = 'This user had nothing else to say.';
    }
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
    const title = data.get('title') ? data.get('title') : 'No topic';
    const guestName = data.getIn(['guest', 'name']);
    const rating = data.get('rating');
    const reviewDate = data.get('createdOn');
    const upVotesCount = data.get('upVotes') ? data.get('upVotes').size : 0;
    const downVotesCount = data.get('downVotes')
      ? data.get('downVotes').size
      : 0;
    const currentUserId = currentUser ? currentUser.get('_id') : 0;
    const currentUserRole = currentUser ? currentUser.get('role') : '';
    const canRemoveItem = !lpVersion && currentUserRole === 'admin';

    let purchasedDate = data.get('purchasedOn');
    const thc = data.get('thc');
    const cbd = data.get('cbd');
    const productData = data.get('product');

    let productCategory = category;
    let productSlug = slug;

    if (context === 'public') {
      productCategory = pluralizeCategory(
        data.getIn(['product', '__t'], '').toLowerCase()
      );
      productSlug = data.getIn(['product', 'slug'], '');
    }
    const productCategoryPlural = pluralizeCategory(productCategory);
    const productReviewLink = `/${productCategoryPlural}/reviews/${productSlug}/${reviewId}`;

    let purchaseValueClass = 'cannabisProductReviewItem__purchaseValue';
    if (data.get('wouldPurchaseAgain')) {
      purchaseValueClass = cx(
        purchaseValueClass,
        'cannabisProductReviewItem__purchaseValue--yes'
      );
    } else {
      purchaseValueClass = cx(
        purchaseValueClass,
        'cannabisProductReviewItem__purchaseValue--no'
      );
    }
    if (purchasedDate) {
      purchasedDate = moment(purchasedDate).format('MM/DD/YYYY');
    }
    return (
      <div className="cannabisProductReviewItem row column mb-lg">
        <div className="cannabisProductReviewItem__reviewItemRow">
          <div className="row mb-lg">
            {context === 'public' &&
              productData && (
                <div className="column small-12 medium-4 large-3">
                  <div className="cannabisProductReviewItem__cardContainer">
                    <ProductCard data={productData} hideReview />
                  </div>
                </div>
              )}
            {!lpVersion &&
              context !== 'public' && (
                <div className="shrink column small-12">
                  {userAvatar ? (
                    <div
                      className="cannabisProductReviewItem__image"
                      style={{ backgroundImage: `url('${userAvatar}')` }}
                    />
                  ) : (
                    <div className="cannabisProductReviewItem__image cannabisProductReviewItem__image--default" />
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
                        className="cannabisProductReviewItem__userName"
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
                    <div className="row">
                      <h1 className="cannabisProductReviewItem__productName shrink column">
                        {productData.get('name')}
                      </h1>
                      <span className="shrink column mt-tn">
                        <ProductPrice
                          price={productData.getIn(['variants', '0', 'price'])}
                          unit={productData.getIn([
                            'variants',
                            '0',
                            'doseUnit',
                          ])}
                          doseAmount={productData.getIn([
                            'variants',
                            '0',
                            'doseAmount',
                          ])}
                          unitLabel={
                            lpVersion && productData.get('__t') === 'Oil'
                              ? '(mg/ml)'
                              : undefined
                          }
                        />
                      </span>
                      <span className="shrink column mt-tn">
                        <Cannabinoids
                          thc={productData.get('thcHigh')}
                          cbd={productData.get('cbdHigh')}
                          category={productData.get('__t')}
                        />
                      </span>
                    </div>

                    {userAvatar ? (
                      <div
                        className="cannabisProductReviewItem__image cannabisProductReviewItem__image--lpVersion"
                        style={{ backgroundImage: `url('${userAvatar}')` }}
                      />
                    ) : (
                      <div className="cannabisProductReviewItem__image cannabisProductReviewItem__image--default" />
                    )}
                    {userId ? (
                      <Link
                        to={`/members/${userSlug}`}
                        className="cannabisProductReviewItem__userName cannabisProductReviewItem__userName--lpVersion"
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
                            className="cannabisProductReviewItem__smallImage"
                            style={{ backgroundImage: `url('${userAvatar}')` }}
                          />
                        ) : (
                          <div className="cannabisProductReviewItem__smallImage cannabisProductReviewItem__smallImage--default" />
                        )}
                      </div>
                      <div className="shrink column">
                        {userId ? (
                          <Link
                            to={`/members/${userSlug}`}
                            className="cannabisProductReviewItem__userName"
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
                      <Link
                        className="cannabisProductReviewItem__reviewDate"
                        to={productReviewLink}
                      >
                        <TimeAgo data={reviewDate} />
                      </Link>
                    </div>
                    {canRemoveItem && (
                      <Link className="fs-md mr-md" onClick={this.deleteReview}>
                        Remove
                      </Link>
                    )}
                  </div>
                  <div className="mb-md">
                    {lpVersion ? (
                      <h1 className="fs-mx t-capitalize">{title}</h1>
                    ) : (
                      <Link
                        className="cannabisProductReviewItem__title"
                        to={productReviewLink}
                      >
                        {title}
                      </Link>
                    )}
                  </div>
                  <div className="cannabisProductReviewItem__ellipsisMessage">
                    <div dangerouslySetInnerHTML={{ __html: message }} />
                  </div>
                </div>
                <div className="cannabisProductReviewItem__batchSection column small-12 medium-4 large-3">
                  <div className="mb-md cannabisProductReviewItem__batchTitle fs-mx">
                    {lpVersion
                      ? 'User Submitted Information'
                      : 'Batch Information'}
                  </div>
                  {purchasedDate && (
                    <div className="fs-base mb-sm">
                      <div className="cannabisProductReviewItem__batchLabel">
                        Date Purchased
                      </div>
                      <div className="cannabisProductReviewItem__batchValue">
                        {purchasedDate}
                      </div>
                    </div>
                  )}

                  {thc ? (
                    <div className="fs-base mb-sm">
                      <div className="cannabisProductReviewItem__batchLabel">
                        THC%
                      </div>
                      <div className="cannabisProductReviewItem__batchValue">
                        {thc}%
                      </div>
                    </div>
                  ) : (
                    ''
                  )}

                  {cbd ? (
                    <div className="fs-base mb-sm">
                      <div className="cannabisProductReviewItem__batchLabel">
                        CBD%
                      </div>
                      <div className="cannabisProductReviewItem__batchValue">
                        {cbd}%
                      </div>
                    </div>
                  ) : (
                    ''
                  )}
                  <div className="mb-sm cannabisProductReviewItem__batchTitle">
                    Would you purchase again?
                  </div>
                  <div className={purchaseValueClass}>
                    {data.get('wouldPurchaseAgain') ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>

              <div
                className={cx({ 'hide-for-small-only': context === 'public' })}
              >
                <ItemDetail data={data} lpVersion={lpVersion} />
              </div>

              <LightboxGallery images={data.get('photos')} />
              {currentUserId !== userId && (
                <div className="row align-bottom">
                  <div className="column">
                    <div className="row mb-sm">
                      <div className="column fs-md t-uppercase">
                        <strong>Was this review helpful?</strong>
                      </div>
                    </div>
                    {currentUserId ? (
                      <div className="row mb-md">
                        <div className="column shrink">
                          <Link
                            className="cannabisProductReviewItem__voteLink"
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
                            className="cannabisProductReviewItem__voteLink"
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
                            <Link className="cannabisProductReviewItem__voteLink">
                              Yes
                            </Link>
                            <Label className="success fs-md" hasArrow>
                              {upVotesCount}
                            </Label>
                          </RequireAuth>
                        </div>
                        <div className="column shrink">
                          <RequireAuth toDo="vote reviews">
                            <Link className="cannabisProductReviewItem__voteLink">
                              No
                            </Link>
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

export default CannabisProductReviewItem;
