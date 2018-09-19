// @flow

import React, { Component } from 'react';
import type { List, Map } from 'immutable';
import cx from 'classnames';
import { getIn } from 'utils/immutable';

import InternalLinks from 'enum/InternalLinks';

import Link from 'components/Link';
import Icon from 'components/Icon';

import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';

import './styles.scss';

type Props = {
  data: List<Map<string, *>>,
  className?: string,
  currentSlug: string,
  pathname: string, // eslint-disable-line react/no-unused-prop-types
};

type State = {
  isOpen: boolean,
  pathname: string,
};

class PageMenu extends Component<Props, State> {
  static getDerivedStateFromProps({ pathname }: Props, prevState: State) {
    if (pathname !== prevState.pathname) {
      return {
        isOpen: false,
        pathname,
      };
    }
    return {
      pathname,
    };
  }
  state = {
    isOpen: false,
    pathname: '', // eslint-disable-line react/no-unused-state
  };
  render() {
    const { data, className, currentSlug } = this.props;
    if (!data) {
      return null;
    }
    const mergedClassName = cx(
      'magazineCategoriesMenu',
      { open: this.state.isOpen },
      className
    );
    return (
      <div className={mergedClassName}>
        <div className="row align-justify">
          {data.map(item => {
            const slug = getIn(item, ['fields', 'slug']);
            const title = getIn(item, ['fields', 'title']);
            const isCurrentSlug = slug === currentSlug;
            return (
              <div
                className={cx(
                  'magazineCategoriesMenu__item small-12 large-shrink column',
                  isCurrentSlug
                    ? 'magazineCategoriesMenu__item--active small-order-1 large-order-1'
                    : 'small-order-2 large-order-1'
                )}
                key={getIn(item, ['sys', 'id'])}
              >
                <div className="row align-middle">
                  <div className="column">
                    <Link
                      className={cx('magazineCategoriesMenu__link plain-link', {
                        'magazineCategoriesMenu__link--active': isCurrentSlug,
                      })}
                      to={`/${InternalLinks.MAGAZINE_CATEGORY}/${slug}`}
                    >
                      {title}
                    </Link>
                  </div>
                  {isCurrentSlug && (
                    <div className="magazineCategoriesMenu__chevron shrink column hide-for-large">
                      <Icon
                        glyph={this.state.isOpen ? ChevronUp : ChevronDown}
                        onClick={() =>
                          this.setState({ isOpen: !this.state.isOpen })
                        }
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default PageMenu;
