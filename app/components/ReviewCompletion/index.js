// @flow

import * as React from 'react';

import CircleProgressBar from 'components/CircleProgressBar';
import CompletionItem from './CompletionItem';

import './styles.scss';

// type Props = {
//   reviewCompletion: Object,
// }

const ReviewCompletion = ({ reviewCompletion }: Props) => {
  const options = {
    strokeWidth: 5,
    color: '#FFFFFF',
    trailColor: '#3eb5be',
    trailWidth: 4.5,
  };
  let completed = 0;
  if (reviewCompletion.get('rating')) completed += 1;
  if (reviewCompletion.get('title')) completed += 1;
  if (reviewCompletion.get('message')) completed += 1;
  const setPoints = points => {
    let value;
    switch (points) {
      case 1:
        value = 20;
        break;
      case 2:
        value = 30;
        break;
      case 3:
        value = 50;
        break;
      default:
        value = 0;
    }
    return `${value} pts`;
  };
  return (
    <div className="reviewCompletion">
      <div className="reviewCompletion__header">
        Earn points for this review
      </div>
      <div className="reviewCompletion__progress">
        <div className="text-center c-white">
          <CircleProgressBar
            progress={completed / 3}
            text={setPoints(completed)}
            options={options}
            initialAnimate={false}
            radius={75}
          />
          <div className="reviewCompletion__shortDesc mt-md">
            <strong>200</strong> average
          </div>
          <div className="reviewCompletion__shortDesc">
            <strong>500</strong> high quality
          </div>
        </div>
      </div>
      <div className="reviewCompletion__info">
        <h4 className="reviewCompletion__description">
          Complete these steps to increase the quality of your review.
        </h4>
        <CompletionItem
          title="Add star ratings"
          completed={reviewCompletion.get('rating')}
        />
        <CompletionItem
          title="Add review title"
          completed={reviewCompletion.get('title')}
        />
        <CompletionItem
          title="Add detailed review"
          completed={reviewCompletion.get('message')}
        />
      </div>
    </div>
  );
};

export default ReviewCompletion;
