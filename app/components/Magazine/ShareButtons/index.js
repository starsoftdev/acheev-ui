// @flow

import React from 'react';
import { ShareButtons } from 'react-share';
import cx from 'classnames';

import Icon from 'components/Icon';

import Facebook from 'images/sprite/facebook-circle.svg';
import Linkedin from 'images/sprite/linkedin-circle.svg';
import Twitter from 'images/sprite/twitter-circle.svg';

import './styles.scss';

const {
  FacebookShareButton,
  LinkedinShareButton,
  TwitterShareButton,
} = ShareButtons;

type Props = {
  shareUrl: string,
  shareTitle: string,
  shareDescription?: string,
  className?: string,
};

const SocialShareButtons = ({
  shareUrl,
  shareTitle,
  shareDescription,
  className,
}: Props) => {
  if (!shareUrl || !shareTitle) return null;
  return (
    <div className={cx('shareButtons', className)}>
      <div className="shareButtons__item">
        <FacebookShareButton
          url={shareUrl}
          quote={shareDescription || shareTitle}
        >
          <Icon glyph={Facebook} size={27} />
        </FacebookShareButton>
      </div>

      <div className="shareButtons__item">
        <TwitterShareButton url={shareUrl} title={shareTitle}>
          <Icon glyph={Twitter} size={27} />
        </TwitterShareButton>
      </div>

      <div className="shareButtons__item">
        <LinkedinShareButton
          url={shareUrl}
          title={shareTitle}
          description={shareDescription}
          windowWidth={750}
          windowHeight={600}
        >
          <Icon glyph={Linkedin} size={27} />
        </LinkedinShareButton>
      </div>
    </div>
  );
};

export default SocialShareButtons;
