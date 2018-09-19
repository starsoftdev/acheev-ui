// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import cx from 'classnames';
import type { List } from 'immutable';

import BorderedTitle from 'components/BorderedTitle';
import Button from 'components/Button';

import './styles.scss';

type Props = {
  cards: List<Object>,
  centered?: boolean,
  borderedTitle?: boolean,
};

class HighlightCards extends Component<Props> {
  static defaultProps = {
    centered: true,
  };
  render() {
    const { cards, centered, borderedTitle } = this.props;
    if (!cards) return null;
    return (
      <div className="row column">
        <div className="highlightCard row">
          {cards.entrySeq().map(([key, item]) => {
            const src = item.get('src', '');
            const title = item.get('title', '');
            const desc = item.get('desc', '');
            const btnText = item.get('btnText', '');
            const linkTo = item.get('linkTo', '');
            const icon = item.get('icon', '');
            return (
              <div
                className="highlightCard__item small-12 medium-4 column"
                key={key}
              >
                <Link to={linkTo}>
                  <img
                    className="mb-lg"
                    src={src}
                    alt={title}
                    style={centered ? { height: '160px' } : {}}
                  />
                </Link>
                <Link className="highlightCard__title" to={linkTo}>
                  {borderedTitle ? (
                    <BorderedTitle
                      element="h4"
                      className="borderedTitle fw-bd"
                      centered={centered}
                    >
                      {icon && (
                        <img
                          src={icon}
                          alt="Number Icon"
                          className="highlightCard__icon"
                        />
                      )}
                      {title}
                    </BorderedTitle>
                  ) : (
                    <h4>
                      {icon && (
                        <img
                          src={icon}
                          alt="Number Icon"
                          className="highlightCard__icon"
                        />
                      )}
                      <strong>{title}</strong>
                    </h4>
                  )}
                </Link>
                <p className={cx({ highlightCard__desc: centered })}>{desc}</p>
                {btnText && (
                  <Button element={Link} className="secondary" to={linkTo}>
                    {btnText}
                  </Button>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default HighlightCards;
