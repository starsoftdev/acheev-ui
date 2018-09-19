// @flow

import React, { Component } from 'react';
import Preloader from 'components/Preloader';
type Props = {
  loadMore: Function,
  isLoading: boolean,
  page: number,
  pageCount: number,
  className?: string,
};

class InfiniteScroll extends Component<Props> {
  componentDidMount() {
    window.addEventListener('scroll', this.handleScroll);
    window.addEventListener('resize', this.handleScroll);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.handleScroll);
    window.removeEventListener('resize', this.handleScroll);
  }

  infiniteScroll: HTMLDivElement;

  handleScroll = (e: SyntheticEvent<HTMLDivElement>) => {
    const { isLoading, page, pageCount } = this.props;
    const { scrollingElement } = e.target;
    const scrollTop = scrollingElement && scrollingElement.scrollTop;
    const height = scrollingElement && scrollingElement.clientHeight;
    const { offsetTop } = this.infiniteScroll;
    const scrollBottom = scrollTop + height;

    if (isLoading || page >= pageCount || scrollBottom + 100 < offsetTop) {
      return;
    }

    this.props.loadMore();
  };

  render() {
    const { isLoading, className } = this.props;
    return (
      <div
        className={className}
        ref={instance => {
          this.infiniteScroll = instance;
        }}
      >
        {isLoading && <Preloader height={40} />}
      </div>
    );
  }
}

export default InfiniteScroll;
