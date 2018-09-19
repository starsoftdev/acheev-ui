// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import './styles.scss';

type Props = {
  message: string,
};

type State = {
  showMore: boolean,
};
class EllipsisMessage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      showMore: false,
    };
  }
  render() {
    const { message } = this.props;
    let shortMsg = '';
    const messageTemplate = (
      <div className="ellipsisMessage__body">{message}</div>
    );
    if (message.length > 400) {
      shortMsg = `${message.substr(0, 400)}...`;
    }
    if (shortMsg === '') return messageTemplate;
    return (
      <div className="ellipsisMessage">
        {this.state.showMore ? (
          <div>{messageTemplate}</div>
        ) : (
          <div className="ellipsisMessage__body">
            {shortMsg}
            <Link
              className="ml-mn"
              onClick={() => this.setState({ showMore: true })}
            >
              Show More
            </Link>
          </div>
        )}
      </div>
    );
  }
}

export default EllipsisMessage;
