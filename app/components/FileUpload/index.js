// @flow

import React, { Component } from 'react';
import { Field } from 'react-formal';
import ReactCrop, { makeAspectCrop } from 'react-image-crop';
import { toastr } from 'react-redux-toastr';
import cx from 'classnames';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';

import './styles.scss';

type Props = {
  picture: string,
  uploadFunction: Function,
  buttonText?: string,
  fieldName?: string,
  enableCrop?: boolean,
};

type State = {
  dataUrl: string,
  crop: Object,
  image?: HTMLImageElement,
};

class FileUpload extends Component<Props, State> {
  static defaultProps = {
    buttonText: 'Upload New Picture',
    fieldName: 'picture',
  };
  constructor(props: Props) {
    super(props);
    this.state = {
      dataUrl: '',
      crop: {
        x: 0,
        y: 0,
        aspect: 1,
      },
    };
  }
  onImageLoaded = (image: HTMLImageElement) => {
    this.setState({
      crop: makeAspectCrop(
        {
          x: 0,
          y: 0,
          aspect: 1,
        },
        1
      ),
      image,
    });
  };

  onCropComplete = (crop: Object, pixelCrop: Object) => {
    const canvas = document.createElement('canvas');
    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;
    const ctx = canvas.getContext('2d');

    if (this.state.image) {
      ctx.drawImage(
        this.state.image,
        pixelCrop.x,
        pixelCrop.y,
        pixelCrop.width,
        pixelCrop.height,
        0,
        0,
        pixelCrop.width,
        pixelCrop.height
      );
      canvas.toBlob(file => {
        const fileData = file;
        fileData.name = 'logo.jpg';
        this.props.uploadFunction(fileData);
      }, 'image/jpeg');
    }
  };
  onCropChange = (crop: Object) => {
    this.setState({ crop });
  };
  handleFileUpload = ({ target }: Event) => {
    const reader = new FileReader();
    reader.onload = e => {
      this.setState({
        dataUrl: e.target.result,
      });
    };
    if (target instanceof HTMLInputElement) {
      const [file] = target.files;
      if (file && file.type !== 'image/jpeg' && file.type !== 'image/png') {
        toastr.error(
          '',
          'Please choose correct format. Only JPEG and PNG is available'
        );
        return;
      }
      if (this.props.enableCrop) {
        reader.readAsDataURL(file);
      }
      this.props.uploadFunction(file);
    }
  };
  clickFileInput = (e: Event) => {
    e.preventDefault();
    if (this.fileInput) this.fileInput.click();
  };
  props: Props;
  fileInput: ?HTMLElement;
  render() {
    const { picture, buttonText, fieldName, enableCrop } = this.props;
    return (
      <div className="fileUpload">
        <div
          className={cx('fileUpload__image', {
            'fileUpload__image--circle': !enableCrop,
          })}
          style={{ backgroundImage: `url(${picture}` }}
          title="User picture"
        />
        {this.state.dataUrl && (
          <ReactCrop
            {...this.state}
            src={this.state.dataUrl}
            onImageLoaded={this.onImageLoaded}
            onComplete={this.onCropComplete}
            onChange={this.onCropChange}
          />
        )}
        <Field
          className="fileUpload__hiddenInput accent"
          name={fieldName}
          id={fieldName}
        />
        <ValidationMessage for={fieldName} />
        <div className="fileUpload__uploadButtonBox">
          <input
            className="fileUpload__hiddenInput"
            type="file"
            onChange={this.handleFileUpload}
            ref={input => {
              this.fileInput = input;
            }}
          />
          <Button
            className="button fileUpload__uploadButton"
            type="button"
            onClick={e => this.clickFileInput(e)}
          >
            {buttonText}
          </Button>
        </div>
      </div>
    );
  }
}

export default FileUpload;
