// @flow

import React, { Component } from 'react';
import { List } from 'immutable';

import SearchField from 'components/SearchField';
import Preloader from 'components/Preloader';
import CreateReviewCardList from 'components/CreateReview/CardList';
import Pagination from 'components/Pagination';

import './styles.scss';

type Props = {
  products: List<Map<string, Object>>,
  isLoading: boolean,
  pages: number,
  requestProducts: Function,
};

class CreateReview extends Component<Props> {
  onInputChange = (value: string) => {
    this.props.requestProducts(['model', 'q'], value);
  };
  render() {
    const { products, isLoading, pages } = this.props;
    return (
      <div className="createReview">
        <div className="createReview__top">
          <div className="row column text-center mb-sm">
            <h3>Search for a strain or oil</h3>
          </div>
          <div className="row align-middle">
            <div className="column">
              <SearchField className="dark" onChange={this.onInputChange} />
            </div>
          </div>
        </div>
        <div>
          {isLoading ? (
            <Preloader height={248} />
          ) : (
            <CreateReviewCardList products={products} />
          )}
          <Pagination
            pageCount={Math.ceil(pages)}
            onPageChange={e => this.props.requestProducts(['model', 'page'], e)}
          />
        </div>
      </div>
    );
  }
}

export default CreateReview;
