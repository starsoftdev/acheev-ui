// @flow
import * as React from 'react';

import Modal from 'react-modal';
import cx from 'classnames';

import './styles.scss';

type Props = {
  children: React.Node,
  className?: string,
  isOpen: boolean,
};

const BaseModal = ({ children, isOpen, className }: Props) => (
  <Modal
    overlayClassName="baseModal__layout"
    className={cx('baseModal__content', className)}
    isOpen={isOpen}
  >
    {children}
  </Modal>
);

export default BaseModal;
