// @flow

import * as React from 'react';
import Panel from 'components/Panel';

const FaqContactUs = () => (
  <Panel theme="green">
    <div className="row">
      <div className="small-12 large-shrink column">
        <h3>Can’t find your question? Let us know.</h3>
      </div>
      <div className="shrink column">
        <a
          className="button coral semiSpacious contactLink"
          href="mailto:hello@lift.co"
        >
          Contact us
        </a>
      </div>
    </div>
  </Panel>
);

export default FaqContactUs;
