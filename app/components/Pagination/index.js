// @flow

import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';

import Icon from 'components/Icon';

import ChevronLeft from 'images/sprite/chevron-left.svg';
import ChevronRight from 'images/sprite/chevron-right.svg';
import './styles.scss';

type Props = {
  initialPage?: number,
  forcePage?: number,
  pageCount: number,
  pageRangeDisplayed?: number,
  marginPagesDisplayed?: number,
  onPageChange: Function,
  onlyPaginator?: boolean,
  altTheme?: boolean,
};

type State = { currentPage: number };

class Pagination extends Component<Props, State> {
  static defaultProps = {
    initialPage: 1,
  };
  constructor(props: Object) {
    super();
    this.state = {
      currentPage: props.forcePage || props.initialPage,
    };
  }
  componentWillReceiveProps({ forcePage }: Props) {
    if (forcePage && forcePage !== this.state.currentPage) {
      this.setState({ currentPage: forcePage });
    }
  }
  render() {
    const {
      initialPage,
      forcePage,
      pageCount,
      pageRangeDisplayed = 1,
      marginPagesDisplayed = 2,
      onPageChange,
      onlyPaginator,
      altTheme,
    } = this.props;

    if (!pageCount || pageCount < 2) {
      return null;
    }

    const paginator = (
      <div className="small-12 medium-shrink column mb-sm">
        <ReactPaginate
          initialPage={Number(initialPage) - 1}
          forcePage={forcePage ? Number(forcePage) - 1 : null}
          pageCount={pageCount}
          pageRangeDisplayed={pageRangeDisplayed}
          marginPagesDisplayed={marginPagesDisplayed}
          containerClassName={altTheme ? 'pagination-alt' : 'pagination'}
          previousClassName="pagination-previous"
          nextClassName="pagination-next"
          activeClassName="current"
          previousLabel={<Icon glyph={ChevronLeft} size={10} />}
          nextLabel={<Icon glyph={ChevronRight} size={10} />}
          onPageChange={e => {
            this.setState({ currentPage: e.selected + 1 });
            onPageChange(e.selected + 1);
          }}
          disableInitialCallback
        />
      </div>
    );

    if (onlyPaginator) {
      return paginator;
    }

    return (
      <div className="row align-middle mb-lg">
        <div className="small-12 medium-expand column fs-mn c-darkest-primary mb-sm">
          Showing page {this.state.currentPage} of {this.props.pageCount}
        </div>
        {paginator}
      </div>
    );
  }
}

export default Pagination;
