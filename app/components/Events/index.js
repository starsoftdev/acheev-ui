// @flow

import * as React from 'react';
import { generate } from 'shortid';
import Link from 'components/Link';
import { fromJS } from 'immutable';

import Button from 'components/Button';
import './styles.scss';

type Props = {
  data: Array<Object>,
};

const exampleFakeEvents = fromJS([
  {
    image:
      'http://www.marijuana.com/wp-content/uploads/2016/06/header-2-702x336.jpeg',
    title: 'Lift Expo Toronto',
    place: 'Metro Toronto Convention Centre',
    date: 'may 26 - 28, 2017',
  },
  {
    image:
      'http://www.marijuana.com/wp-content/uploads/2016/06/header-2-702x336.jpeg',
    title: 'Lift Expo Toronto',
    place: 'Metro Toronto Convention Centre',
    date: 'may 26 - 28, 2017',
  },
]);

const Events = ({ data = exampleFakeEvents }: Props) => (
  <div className="row column">
    <div className="news">
      <div className="row align-middle mb-lg">
        <div className="column">
          <h2 className="nm">Upcoming Events</h2>
        </div>
        <div className="shrink column">
          <Link to="/events">see all</Link>
        </div>
      </div>
      <div className="row">
        {data.map(item => {
          const title = item.get('title');
          return (
            <div
              className="events__item small-12 medium-6 column"
              key={generate()}
            >
              <div className="events__image">
                <img src={item.get('image')} alt={title} />
              </div>
              <div className="row align-middle">
                <div className="column">
                  <h3 className="c-secondary">{item.get('title')}</h3>
                  <h5>{item.get('date')}</h5>
                  <p>{item.get('place')}</p>
                </div>
                <div className="small-12 medium-shrink column mb-mn">
                  <Button element="a" className="secondary mr-md">
                    Buy tickets
                  </Button>
                  <Button element="a">Learn more</Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
);

export default Events;
