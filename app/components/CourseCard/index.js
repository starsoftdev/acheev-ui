// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';

import StarRating from 'components/StarRating';

import './styles.scss';

type Props = {
  data: Object,
};

class CourseCard extends Component<Props, {}> {
  render() {
    const { data } = this.props;
    return (
      <div className="courseCard">
        <div
          className="courseCard__image"
          style={{
            backgroundImage: `url('${data.get('img')}')`,
          }}
        />
        <div className="courseCard__info">
          <h2 className="courseCard__courseName">{data.get('name')}</h2>
          <p className="courseCard__creator">{data.get('creator')}</p>
        </div>
        <div className="courseCard__rating row align-middle">
          <div className="column shrink">
            <StarRating initialRating={data.get('rating')} size={23} />
          </div>
          <div className="courseCard__rate column">{data.get('rating')}</div>
          <div className="courseCard__price column">${data.get('price')}</div>
        </div>
        <div className="courseCard__students">
          {data.get('students').map(student => (
            <div
              key={generate()}
              className="courseCard__studentImage"
              style={{
                backgroundImage: `url('${student}')`,
              }}
            />
          ))}
          <div className="courseCard__studentsCount">
            +{data.get('studentsCount')} Students
          </div>
        </div>
      </div>
    );
  }
}

export default CourseCard;
