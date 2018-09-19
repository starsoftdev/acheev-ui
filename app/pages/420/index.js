// @flow

import React, { Component } from 'react';

import './styles.scss';

class FourTwoZeroPage extends Component<Object> {
  componentDidMount() {
    const script = document.createElement('script');

    script.src = 'https://js.gleam.io/e.js';
    script.async = true;

    if (document.body) {
      document.body.appendChild(script);
    }
  }
  render() {
    return (
      <div className="fourTwoZeroPage">
        <a
          className="e-widget no-button"
          href="https://gleam.io/noG9q/lift-420-contest"
          rel="nofollow"
        >
          Lift 420 Contest
        </a>
      </div>
    );
  }
}

export default FourTwoZeroPage;
