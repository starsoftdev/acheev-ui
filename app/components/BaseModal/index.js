// @flow
import React, { Component } from 'react';

import Modal from 'react-modal';
import cx from 'classnames';

import './styles.scss';

type Props = {
  children: React.Node,
  className?: string,
  isOpen: boolean,
};

class BaseModal extends Component<Props, {}> {
  componentWillMount() {
    Modal.setAppElement('#app');
  }
  render() {
    const { children, isOpen, className } = this.props;
    return (
      <Modal
        overlayClassName="baseModal__layout"
        className={cx('baseModal__content', className)}
        isOpen={isOpen}
      >
        {children}
      </Modal>
    );
  }
}

export default BaseModal;
