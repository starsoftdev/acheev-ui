// @flow
import CONFIG from '../../conf';
import React, { Component } from 'react';
import Link from 'components/Link';
import type { List, Map } from 'immutable';

import BorderedTitle from 'components/BorderedTitle';
import './styles.scss';

type Props = {
  logos: List<Map<*, *>>,
  title: string,
};

class LogoList extends Component<Props> {
  render() {
    const { logos, title } = this.props;
    return (
      <div className="logoList">
        <BorderedTitle centered className="c-darkest-gray">
          {title}
        </BorderedTitle>
        <div className="row align-center">
          {logos.entrySeq().map(([key, item]) => {
            const businessCategory = item.get('__t');
            const baseUrl =
              businessCategory === 'Dispensary'
                ? '/dispensaries'
                : `/${item.get('__t').toLowerCase()}s`;
            const slug = item.get('slug');
            return (
              <div className="logoList__imageContainer" key={key}>
                <img
                  className="logoList__image"
                  src={`${CONFIG.APP.CDN_URL}/resize/260x260/${item.get(
                    'thumbnail'
                  )}`}
                  alt="Partner Logo"
                />
                <div className="logoList__imageOverlay">
                  <Link
                    className="logoList__imageLink"
                    to={`${baseUrl}/${slug}`}
                  >
                    {item.get('name')}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default LogoList;
