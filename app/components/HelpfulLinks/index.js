// @flow

import * as React from 'react';

import Icon from 'components/Icon';
import IconAccountHelp from 'images/sprite/account-help.svg';
import IconDownload from 'images/sprite/download.svg';

import './styles.scss';

const HelpfulLinks = () => (
  <div className="helpfulLinks">
    <div className="helpfulLinks__header">Helpful Links</div>
    <div className="helpfulLinks__membership column">
      <Icon className="mr-md" glyph={IconAccountHelp} size={50} />
      <a className="helpfulLinks__link" href="/me">
        Membership and account help
      </a>
    </div>
    <div className="helpfulLinks__patientGuide column">
      <Icon className="mr-md" glyph={IconDownload} size={50} />
      <a className="helpfulLinks__link" href="/about">
        Download the Patient Guide
      </a>
    </div>
  </div>
);

export default HelpfulLinks;
