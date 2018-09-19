// @flow

import React, { Component } from 'react';
import Dropzone from 'react-dropzone';

import './styles.scss';

type Props = {
  children?: React.Element<any>,
};

class DropzoneComponent extends Component<Props> {
  render() {
    return <Dropzone {...this.props}>{this.props.children}</Dropzone>;
  }
}

export default DropzoneComponent;
