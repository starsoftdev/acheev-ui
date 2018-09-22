// @flow

import React, { Component } from 'react';
import { fromJS } from 'immutable';
import { generate } from 'shortid';
import cx from 'classnames';

import Link from 'components/Link';
import Button from 'components/Button';
import BorderedTitle from 'components/BorderedTitle';
import CourseCard from 'components/CourseCard';

import POPULAR_COURSES from 'enum/courses/PopularCourses';

import './styles.scss';

const categories = fromJS([
  'All',
  'Creative',
  'Business',
  'Technology',
  'Lifestyle',
]);

type State = {
  selectedCategory: string,
};

class PopularCourseContainer extends Component<{}, State> {
  state = {
    selectedCategory: 'All',
  };
  render() {
    const { selectedCategory } = this.state;
    return (
      <div className="popularCourse">
        <div className="row column">
          <BorderedTitle className="nm mb-sm" centered>
            Discover Our Popular Course
          </BorderedTitle>
        </div>
        <div className="row align-center mb-xl">
          {categories.map(category => (
            <Link
              className={cx('popularCourse__category column shrink', {
                'popularCourse__category--current':
                  selectedCategory === category,
              })}
              key={generate()}
              onClick={() => this.setState({ selectedCategory: category })}
            >
              {category}
            </Link>
          ))}
        </div>
        <div className="row pt-xl">
          {POPULAR_COURSES.map(course => (
            <div
              className="column small-12 medium-6 large-4 mb-xl"
              key={generate()}
            >
              <CourseCard data={course} />
            </div>
          ))}
        </div>
        <div className="row column text-center">
          <Button element={Link}>Show more</Button>
        </div>
      </div>
    );
  }
}

export default PopularCourseContainer;
