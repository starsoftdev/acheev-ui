// @flow

import React, { Component } from 'react';

import Icon from 'components/Icon';
import classNames from 'classnames';
import './styles.scss';

type Props = {
  icon: string,
  link: string,
  className?: string,
};

class SocialLink extends Component<Props> {
  render() {
    const { link, icon, className } = this.props;
    if (!link) {
      return null;
    }
    return (
      <a href={link} target="_blank">
        <Icon
          glyph={icon}
          className={classNames('socialLink', className)}
          width={36}
          height={36}
        />
      </a>
    );
  }
}
export default SocialLink;
