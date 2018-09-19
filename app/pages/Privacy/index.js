// @flow

import * as React from 'react';
import privacy from './privacy';
const PrivacyPage = () => (
  <div
    className="row column"
    dangerouslySetInnerHTML={{ __html: privacy }}
  />
);

export default PrivacyPage;
