// @flow

import * as React from 'react';
import type { List, Map } from 'immutable';
import { connect } from 'react-redux';
import { getIn } from 'utils/immutable';
import marked from 'utils/marked';

import Preloader from 'components/Preloader';
import Chapters from 'components/Cannabis101/Chapters';

import { requestHomepage } from './sagas';

type Props = {
  isLoading: boolean,
  homepage: Map<*, *>,
  chapters: List<Map<*, *>>,
  requestHomepage: Function,
  match: Object,
};

class Cannabis101HomePage extends React.Component<Props> {
  componentDidMount() {
    this.props.requestHomepage();
  }

  render() {
    const {
      homepage,
      chapters,
      isLoading,
      match: { url },
    } = this.props;
    return isLoading ? (
      <Preloader />
    ) : (
      <div className="row column c101homepage">
        <div className="c101__articles">
          {homepage &&
            getIn(homepage, ['article']).map(item => {
              const image = getIn(item, [
                'fields',
                'image',
                'fields',
                'file',
                'url',
              ]);
              const title = getIn(item, ['fields', 'title']);
              return (
                <div className="mb-xl" key={getIn(item, ['sys', 'id'])}>
                  {title && <h3>{title}</h3>}
                  {image && (
                    <p>
                      <img alt={getIn(item, ['fields', 'title'])} src={image} />
                    </p>
                  )}
                  <div
                    className="c101__articleBody contentful"
                    dangerouslySetInnerHTML={{
                      __html: marked(getIn(item, ['fields', 'content'])),
                    }}
                  />
                </div>
              );
            })}
        </div>
        <Chapters data={chapters} url={url} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['c101', 'homepage', 'isLoading']),
  homepage: state.getIn(['c101', 'homepage', 'data', 0, 'fields']),
  chapters: state.getIn(['c101', 'chapters', 'data']),
});

const mapDispatchToProps = dispatch => ({
  requestHomepage: () => dispatch(requestHomepage()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Cannabis101HomePage);
