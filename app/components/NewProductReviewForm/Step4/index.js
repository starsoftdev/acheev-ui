// @flow

import React, { Component } from 'react';

import { Field } from 'react-formal';

import TextAreaField from 'components/TextAreaField';
import ValidationMessage from 'components/ValidationMessage';
import Editor from 'components/Editor';

import isMobile from 'utils/checkMobile';
import getPlainText from 'utils/plainText';

type Props = {
  reviewScores: Object,
  model: Object,
  editorState: ?Object,
  showSecondaryTitle: boolean,
  showSecondaryMessage: boolean,
  completeReviewForm: Function,
  onEditorStateChange: Function,
  onFocusTitle: Function,
  onBlurTitle: Function,
  onFocusMessage: Function,
  onBlurMessage: Function,
};
class NewProductReviewFormStep4 extends Component<Props> {
  render() {
    const {
      reviewScores,
      model: { message },
      showSecondaryTitle,
      showSecondaryMessage,
      editorState,
    } = this.props;
    const minMessageLength = 40;
    const messageLength = getPlainText(message).length;
    const secondaryMessagePrompt =
      'Please elaborate on your experience: include how you felt before, during, and after. Describe your purchasing experience and anything else relevant to other cannabis product consumers.';
    return (
      <div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Review Title
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.title}
              pts
            </span>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <Field
              className="accent cannabisProductReviewForm__title"
              name="title"
              id="title"
              type="text"
              onChange={value =>
                this.props.completeReviewForm(['title'], !!value)
              }
              onFocus={this.props.onFocusTitle}
              onBlur={this.props.onBlurTitle}
            />
            {showSecondaryTitle ? (
              <div className="fs-md">
                Create a short, descriptive and accurate title for your review
              </div>
            ) : null}
            {!showSecondaryTitle && <ValidationMessage for="title" />}
          </div>
        </div>
        <div className="row mb-sm">
          <div className="column pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Review Comments
            </a>
          </div>
          <div className="shrink column pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.message}
              pts
            </span>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            {isMobile() ? (
              <TextAreaField
                className="accent cannabisProductReviewForm__message"
                name="message"
                id="message"
                onChange={value =>
                  this.props.completeReviewForm(['message'], !!value)
                }
                onFocus={this.props.onFocusMessage}
                onBlur={this.props.onBlurMessage}
              />
            ) : (
              <Editor
                editorClassName="accent cannabisProductReviewForm__message"
                editorState={editorState}
                onEditorStateChange={this.props.onEditorStateChange}
                onFocus={this.props.onFocusMessage}
                onBlur={this.props.onBlurMessage}
              />
            )}
            {showSecondaryMessage && (
              <div className="fs-md">
                {secondaryMessagePrompt}
                {messageLength < minMessageLength && (
                  <span className="fs-md cannabisProductReviewForm__messageLength">
                    &nbsp;
                    {messageLength} of {minMessageLength} required&nbsp;
                    characters, tell us more...
                  </span>
                )}
              </div>
            )}
            <ValidationMessage for="message" />
          </div>
        </div>
      </div>
    );
  }
}

export default NewProductReviewFormStep4;
