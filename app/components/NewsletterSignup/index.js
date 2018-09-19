// @flow

import * as React from 'react';

import Button from 'components/Button';
import Input from 'components/Input';
import Panel from 'components/Panel';

const NewsletterSignup = () => (
  <div className="row column">
    <Panel theme="dark">
      <h2>Newsletter Signup</h2>
      <div className="row">
        <div className="small-12 medium-expand column">
          <Input placeholder="Email address" />
        </div>
        <div className="small-12 medium-shrink column">
          <Button className="large large-spacious secondary expanded">
            Subscribe
          </Button>
        </div>
      </div>
    </Panel>
  </div>
);

export default NewsletterSignup;
