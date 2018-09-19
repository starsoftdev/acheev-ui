// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import ReactModal from 'react-modal';
import Button from 'components/Button';
import Icon from 'components/Icon';
import IconClose from 'images/sprite/close.svg';
import './styles.scss';

if (document && document.getElementById('#app'))
  ReactModal.setAppElement('#app');

type Props = {
  title?: string,
  isOpen?: boolean,
  promptText?: string,
  linkText?: string,
  linkClassName?: string,
  buttonClassName?: string,
  submitText?: string,
  textIsButton?: boolean,
  unlockFunction?: Function,
  submitFunction?: Function,
  onCloseModal?: Function,
  onOpenModal?: Function,
  children?: any,
};

type State = {
  isOpen: boolean,
};

class FormModal extends Component<Props, State> {
  constructor(props: Object) {
    super();
    this.state = { isOpen: props.isOpen };
  }
  componentWillReceiveProps(newProps: Object) {
    this.setState({ isOpen: newProps.isOpen });
  }

  openModal = () => {
    this.setState({ isOpen: true });
    if (this.props.onOpenModal) this.props.onOpenModal();
  };
  closeModal = () => {
    this.setState({ isOpen: false });
    if (this.props.onCloseModal) this.props.onCloseModal();
  };

  render() {
    const {
      title,
      promptText,
      linkText,
      linkClassName,
      buttonClassName,
      textIsButton,
      unlockFunction,
      submitFunction,
      submitText,
    } = this.props;
    const link = (
      <Link className={linkClassName} onClick={() => this.openModal()}>
        {linkText}
      </Link>
    );
    const setPrompt = () => {
      if (textIsButton) {
        return (
          <Button
            className={buttonClassName || linkClassName}
            onClick={() => this.openModal()}
          >
            {linkText}
          </Button>
        );
      }
      return (
        <span className="fs-tn">
          {promptText}&nbsp;{link}
        </span>
      );
    };
    return (
      <span>
        {setPrompt()}
        <ReactModal
          shouldCloseOnOverlayClick
          isOpen={this.state.isOpen}
          onRequestClose={() => this.closeModal()}
          closeTimeoutMS={0}
          className="formModal__content small-12 columns"
          overlayClassName="formModal row-fluid"
          contentLabel="formModal"
        >
          <Icon
            glyph={IconClose}
            size={16}
            className="formModal__closeButton"
            onClick={() => this.closeModal()}
          />
          <div className="row">
            <div className="small-12 columns">
              {title && <h3 className="formModal__title mb-md">{title}</h3>}

              {this.props.children}

              {unlockFunction && (
                <Button
                  onClick={unlockFunction}
                  className="formModal__unlockButton large expanded secondary"
                >
                  {linkText}
                </Button>
              )}

              {submitFunction && (
                <Button
                  onClick={submitFunction}
                  className="formModal__submitButton large expanded secondary"
                >
                  {submitText}
                </Button>
              )}
            </div>
          </div>
        </ReactModal>
      </span>
    );
  }
}

export default FormModal;
