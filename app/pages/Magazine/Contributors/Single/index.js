// @flow

import React from 'react';
import { connect } from 'react-redux';
import type { List, Map } from 'immutable';
import { getIn } from 'utils/immutable';

import Helmet from 'components/Helmet';

import PostList from 'components/Magazine/PostList';

import { requestContributor } from 'pages/Magazine/sagas';

import './styles.scss';

type Props = {
  contributor: Map<string, *>,
  posts: List<Map<string, *>>,
  requestContributor: Function,
  match: Object,
  isLoading: boolean,
};

class MagazineContributorPage extends React.Component<Props> {
  componentDidMount() {
    this.props.requestContributor(this.props.match.params.slug);
  }
  render() {
    const { contributor, posts, isLoading } = this.props;
    const contributorName = getIn(
      contributor,
      ['fields', 'name'],
      'Contributor'
    );
    return (
      <div className="magazineContributorPage magazineBG">
        <Helmet title={`${contributorName} - Lift & Co.`} />
        {contributor && (
          <div className="magazineContributorPage__about row align-middle">
            <div className="shrink column">
              <div
                className="magazineContributorPage__avatar"
                style={{
                  backgroundImage: `url(${contributor.getIn(
                    ['fields', 'profilePhoto', 'fields', 'file', 'url'],
                    ''
                  )})`,
                }}
              />
            </div>
            <div className="column">
              <h2 className="magazineContributorPage__name">
                {contributorName}
              </h2>
            </div>
          </div>
        )}
        <PostList
          isLoading={isLoading}
          data={posts}
          noPostsMessage="This author doesn't have any posts yet."
        />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  contributor: state.getIn(['magazine', 'contributor', 'about']),
  posts: state.getIn(['magazine', 'contributor', 'posts', 'items']),
  isLoading: state.getIn(['magazine', 'contributor', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestContributor: slug => dispatch(requestContributor(slug)),
});

export default connect(mapStateToProps, mapDispatchToProps)(
  MagazineContributorPage
);
