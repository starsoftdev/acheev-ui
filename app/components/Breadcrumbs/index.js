// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import Link from 'components/Link';
import { List, fromJS } from 'immutable';
import { startCase } from 'lodash-es';

import { setMetaJson } from 'containers/App/sagas';

import Icon from 'components/Icon';
import ChevronRight from 'images/sprite/chevron-right.svg';
import './styles.scss';

type Props = {
  path: List<Map<string, Object>>,
  setMetaJson: Function,
};

const Separator = () => (
  <div className="breadcrumbs__item">
    <Icon glyph={ChevronRight} width={10} height={10} />
  </div>
);
class Breadcrumbs extends Component<Props> {
  componentWillMount() {
    const { path } = this.props;
    const pathString = path
      ? path
          .toJS()
          .map(item => item.title)
          .join(' > ')
      : '';
    this.props.setMetaJson(['breadcrumb'], pathString);
  }
  componentWillReceiveProps(newProps: Props) {
    const pathString = newProps.path
      .toJS()
      .map(item => item.title)
      .join(' > ');
    this.props.setMetaJson(['breadcrumb'], pathString);
  }
  render() {
    const { path } = this.props;
    let tempPath = null;
    let filteredPath = null;
    let lastIndex = null;
    const homeCrumb = fromJS({
      link: '/',
      title: 'Home',
    });
    if (path) {
      tempPath = path.insert(0, homeCrumb);
      if (window.innerWidth < 400 && tempPath.size > 3) {
        tempPath = tempPath.slice(tempPath.size - 3, tempPath.size);
      }
      filteredPath = tempPath.entrySeq();
      lastIndex = filteredPath.size - 1;
    }
    return (
      <div className="row column">
        {filteredPath && (
          <div className="breadcrumbs">
            {filteredPath.map(([key, value]) => (
              <div key={key + 1} className="breadcrumbs__group">
                {key === lastIndex ? (
                  <div className="breadcrumbs__item breadcrumbs__item--current">
                    {startCase(value.get('title'))}
                  </div>
                ) : (
                  <div>
                    <div className="breadcrumbs__item">
                      <Link
                        className="breadcrumbs__link"
                        to={value.get('link')}
                      >
                        {startCase(value.get('title', ''))}
                      </Link>
                    </div>
                    <Separator />
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default connect(
  null,
  mapDispatchToProps
)(Breadcrumbs);
