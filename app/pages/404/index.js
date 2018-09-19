// @flow

import React, { Component } from 'react';

import Link from 'components/Link';

import BudA from './bud-a.png';
import BudB from './bud-b.png';

import './styles.scss';

class FourOneFourPage extends Component<{}> {
  render() {
    return (
      <div className="notFound">
        <div className="row column text-center">
          <div className="notFound__titleWrapper">
            <h1 className="notFound__title">404</h1>
            <img className="notFound__leftImg" src={BudA} alt="bud-a" />
            <img className="notFound__rightImg" src={BudB} alt="bud-b" />
          </div>
          <h1 className="notFound__desc">
            Oh snap! No page, no problem. Visit another or&nbsp;
            <Link to="/create-review">leave a review</Link>.
          </h1>
        </div>
      </div>
    );
  }
}

export default FourOneFourPage;
