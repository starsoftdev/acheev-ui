// @flow

import React, { Component } from 'react';

import numeral from 'numeral';
import { generate } from 'shortid';

import Dropzone from 'components/Dropzone';
import Button from 'components/Button';
import ProgressBar from 'components/ProgressBar';
import Icon from 'components/Icon';
import IconTrash from 'images/sprite/trash.svg';
import IconPhotoUpload from 'images/sprite/photo-upload.svg';

type Props = {
  reviewScores: Object,
  onRemovePhoto: Function,
  onDrop: Function,
  uploadedFiles: Array<Object>,
  uploadedPhotos: List<Map>,
};

class NewProductReviewFormStep6 extends Component<Props, {}> {
  dropzoneRef: ?Object;

  render() {
    const { uploadedFiles, uploadedPhotos, reviewScores } = this.props;
    return (
      <div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize newProductReviewForm__toggleHeader">
              Upload Photos
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.photos}
              pts
            </span>
          </div>
        </div>

        <div className="row mb-mx">
          <div className="column small-12 mb-md">
            <Dropzone
              className="newProductReviewForm__dropzone"
              ref={node => {
                this.dropzoneRef = node;
              }}
              accept="image/*"
              onDrop={this.props.onDrop}
            >
              <div className="text-center">
                <Icon
                  glyph={IconPhotoUpload}
                  size={20}
                  className="newProductReviewForm__dropzoneIcon"
                />
                <div className="newProductReviewForm__dropzoneLargeLabel">
                  Drag and drop
                </div>
                <div className="newProductReviewForm__dropzoneLabel">or</div>
                <Button
                  type="button"
                  className="newProductReviewForm__dropzoneButton secondary hollow"
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  Choose Files
                </Button>
              </div>
            </Dropzone>
          </div>
          {uploadedFiles &&
            uploadedFiles.length > 0 && (
              <div className="column small-12 fs-base">
                {uploadedFiles.map((item, index) => {
                  const link = uploadedPhotos.getIn([index, 'link'], '');
                  const error = uploadedPhotos.getIn([index, 'error'], '');
                  const progress =
                    uploadedPhotos.getIn([index, 'isLoading'], false) || error
                      ? 0
                      : 100;
                  return (
                    <div
                      className="row align-middle newProductReviewForm__photoRowLabel"
                      key={generate()}
                    >
                      <div className="column small-12 large-3 mb-sm">
                        {error ? (
                          <div className="c-danger">Failed</div>
                        ) : (
                          <img
                            className="newProductReviewForm__previewImage"
                            src={link}
                            alt={item.name}
                          />
                        )}
                      </div>
                      <div className="column small-12 large-9">
                        <div className="row align-middle">
                          <div className="column small-10 small-order-1 large-5 newProductReviewForm__photoName mb-sm">
                            {item.name}
                          </div>
                          <div className="column show-for-only-large large-2 mb-sm">
                            {numeral(item.size).format('0.00 b')}
                          </div>
                          <div className="column small-12 large-4 small-order-3 large-order-2 mb-sm">
                            <ProgressBar
                              value={progress}
                              maxValue={100}
                              width={8}
                              trailWidth={8}
                              color="#a0ce67"
                              initialAnimate={false}
                            />
                          </div>
                          <div className="column small-2 large-1 small-order-2 large-order-3 text-right mb-sm">
                            {progress === 100 ? (
                              <Icon
                                glyph={IconTrash}
                                size={14}
                                onClick={() => this.props.onRemovePhoto(index)}
                                className="newProductReviewForm__toggleIcon"
                              />
                            ) : (
                              `${progress}%`
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
        </div>
      </div>
    );
  }
}

export default NewProductReviewFormStep6;
