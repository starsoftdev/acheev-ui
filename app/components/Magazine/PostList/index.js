// @flow

import React, { Component, Fragment } from 'react';
import type { List, Map } from 'immutable';

import Post from 'components/Magazine/PostList/Item';
import Preloader from 'components/Preloader';
import Button from 'components/Button';

import './styles.scss';

type Props = {
  data: List<Map<*, *>>,
  noPostsMessage?: string,
  isLoading?: boolean,
  postsToShow: number,
};

type State = {
  postsToShow: number,
};

class PostList extends Component<Props, State> {
  static defaultProps = {
    postsToShow: 6,
  };
  constructor({ postsToShow }: Props) {
    super();
    this.state = {
      postsToShow,
    };
  }
  loadMore = () => {
    this.setState({
      postsToShow: this.state.postsToShow + this.props.postsToShow,
    });
  };
  render() {
    const { data, noPostsMessage = 'No posts here', isLoading } = this.props;
    if (isLoading) {
      return <Preloader />;
    }
    if (!data) {
      return null;
    }
    if (!data.size) {
      return (
        <div className="text-center pt-xl pb-xl">
          <h3 className="nm">{noPostsMessage}</h3>
        </div>
      );
    }
    const displayedPosts = data && data.take(this.state.postsToShow);
    return (
      <Fragment>
        <div className="postList row">
          {displayedPosts.entrySeq().map(([key, item]) => (
            <div className="small-12 medium-6 large-4 column mb-xl" key={key}>
              <Post data={item} />
            </div>
          ))}
        </div>
        {this.state.postsToShow < data.size && (
          <div className="text-center mb-hg">
            <Button className="secondary" onClick={this.loadMore}>
              Load more
            </Button>
          </div>
        )}
      </Fragment>
    );
  }
}

export default PostList;
