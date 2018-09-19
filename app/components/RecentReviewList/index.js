// @flow

import * as React from 'react';
import Link from 'components/Link';

import Carousel from 'components/Carousel';
import Preloader from 'components/Preloader';
import RecentReviewItem from './RecentReviewItem';

import './styles.scss';

type Props = {
  data: Object,
};

const carouselSettings = {
  responsive: [
    {
      breakpoint: 1024,
      settings: {
        dots: true,
        arrows: false,
      },
    },
    {
      breakpoint: 9999,
      settings: 'unslick',
    },
  ],
};

const RecentReviewList = ({ data }: Props) => {
  const items = data.getIn(['data', 'hits']);
  return (
    <div className="recentReviewList mb-xl">
      <div className="row column">
        <div>
          <div className="row align-bottom recentReviewList__titleContainer">
            <div className="small-12 medium-6 column mb-mn">
              <h2 className="recentReviewList__title">
                Recent Reviews
                <span className="recentReviewList__showAll show-for-small-only">
                  <Link className="fs-md" to="/reviews">
                    Read More
                  </Link>
                </span>
              </h2>
            </div>
            <div className="small-12 medium-6 column mb-mn text-right hide-for-small-only">
              <Link className="fs-md" to="/reviews">
                Read More
              </Link>
            </div>
          </div>
          {data.get('isLoading') ? (
            <Preloader height={423} />
          ) : (
            <div className="recentReviewList__carousel">
              <Carousel {...carouselSettings}>
                {items &&
                  items.entrySeq().map(([key, value]) => (
                    <div
                      className="recentReviewList__item small-12 medium-6 large-4 column"
                      key={key}
                    >
                      <RecentReviewItem data={value} />
                    </div>
                  ))}
              </Carousel>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentReviewList;
