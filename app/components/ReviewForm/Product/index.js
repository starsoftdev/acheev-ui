// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import cx from 'classnames';

import getPlainText from 'utils/plainText';
import isMobile from 'utils/checkMobile';
import Editor from 'components/Editor';
import TextAreaField from 'components/TextAreaField';
import Button from 'components/Button';
import RequireAuth from 'components/RequireAuth';
import RadioGroup from 'components/RadioGroup';
import ValidationMessage from 'components/ValidationMessage';
import StarRating from 'components/StarRating';

import './styles.scss';

function messageTest() {
  const { message } = this.parent;
  const content = getPlainText(message);
  if (!message || content.length < 50) return false;
  return true;
}
const schema = yup.object({
  rating: yup
    .number()
    .min(0.5, 'must be rated.')
    .max(5),
  title: yup
    .string()
    .required()
    .max(150, 'maximum title length is 150 characters'),
  message: yup
    .string()
    .required()
    .test('messageTest', 'minimum review length is 50 characters', messageTest),
  wouldPurchaseAgain: yup.boolean().required(),
});

type Props = {
  submitReview: Function,
  isLoading: boolean,
  reviewId: string,
  errorMessage: string,
  successMessage: string,
  reviewData: Object,
  currentUser: Object,
  pendingUser: Object,
  productId: string,
  completeReviewForm: Function,
  clearReviewForm: Function,
};

class ProductReviewForm extends Component<
  Props,
  {
    model: Object,
    editorState: ?Object,
    showSecondaryTitle: boolean,
    showSecondaryMessage: boolean,
  }
> {
  constructor(props: Object) {
    super(props);
    const tempData = localStorage.getItem(props.productId);
    if (tempData) {
      this.state = {
        model: JSON.parse(tempData),
        showSecondaryTitle: false,
        showSecondaryMessage: false,
        editorState: null,
      };
      this.submitReview(JSON.parse(tempData));
      localStorage.removeItem(props.productId);
    } else {
      this.state = {
        model: {
          rating: 0,
          title: '',
          message: '',
          wouldPurchaseAgain: true,
        },
        editorState: null,
        showSecondaryTitle: false,
        showSecondaryMessage: false,
      };
    }
  }

  componentWillMount() {
    const { reviewData, reviewId } = this.props;
    const message = reviewData.getIn(['data', 'message']) || '';
    const contentBlock = htmlToDraft(message);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const editorState = EditorState.createWithContent(contentState);
    if (reviewId && reviewData.get('data')) {
      this.setState({
        model: {
          rating: reviewData.getIn(['data', 'rating']),
          title: reviewData.getIn(['data', 'title']),
          message,
          wouldPurchaseAgain: reviewData.getIn(['data', 'wouldPurchaseAgain']),
        },
        editorState,
        showSecondaryTitle: false,
      });
    }
  }
  componentDidMount() {
    const { reviewData, reviewId } = this.props;
    if (reviewId && reviewData.get('data')) {
      this.props.completeReviewForm(['rating'], true);
      this.props.completeReviewForm(['title'], true);
      this.props.completeReviewForm(['message'], true);
    }
  }
  componentWillReceiveProps(newProps: Object) {
    const { reviewId, isLoading } = this.props;

    if (
      isLoading === true &&
      newProps.isLoading === false &&
      newProps.errorMessage === '' &&
      !reviewId
    ) {
      this.setState({
        model: {
          rating: 0,
          title: '',
          message: '',
          wouldPurchaseAgain: true,
        },
        editorState: null,
        showSecondaryTitle: false,
      });
    }
  }
  componentWillUnmount() {
    this.props.clearReviewForm();
  }
  onChange = (model: Object) => {
    this.setState({ model });
  };

  onChangeRate = (rate: Number) => {
    const { model } = this.state;
    model.rating = rate;
    this.props.completeReviewForm(['rating'], !!rate);
    this.onChange(model);
  };

  onChangePurchase = (value?: Boolean) => {
    const { model } = this.state;
    model.wouldPurchaseAgain = value;
    this.onChange(model);
  };

  onRedirect = () => {
    const { productId } = this.props;
    const postData = this.state.model;
    postData.product = productId;
    postData.url = window.location.pathname;
    localStorage.setItem(productId, JSON.stringify(postData));
  };

  onEditorStateChange: Function = editorState => {
    const message = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    this.setState({
      model: {
        ...this.state.model,
        message,
      },
      editorState,
    });
    this.props.completeReviewForm(['message'], !!message);
  };

  submitReview = (data: Object) => {
    const { submitReview, productId, reviewId, currentUser } = this.props;
    const postData = data;
    postData.product = productId;
    postData.url = window.location.pathname;

    if (currentUser) {
      submitReview(postData, reviewId);
    }
  };

  render() {
    const {
      isLoading,
      errorMessage,
      successMessage,
      currentUser,
      pendingUser,
    } = this.props;
    const { model: { message } } = this.state;
    const messageLength = getPlainText(message).length;
    const shouldConfirm = !currentUser && !!pendingUser;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={this.submitReview}
        className="productReviewForm"
      >
        <div className="row mb-mx">
          <div className="column">
            <h5 className="t-capitalize">Review Product</h5>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column shrink">
            <div className="productReviewForm__ratingSection">
              <div className="row">
                <div className="column">
                  <label htmlFor="title">Overall Rating</label>
                  <StarRating
                    initialRating={this.state.model.rating}
                    readonly={false}
                    size={55}
                    onChange={rate => {
                      this.onChangeRate(rate);
                    }}
                    id="rating"
                  />
                  <ValidationMessage for="rating" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="title">Review Title</label>
            <Field
              className="accent"
              name="title"
              id="title"
              type="text"
              onChange={value =>
                this.props.completeReviewForm(['title'], !!value)}
              onFocus={() => this.setState({ showSecondaryTitle: true })}
              onBlur={() => this.setState({ showSecondaryTitle: false })}
            />
            {this.state.showSecondaryTitle ? (
              <div className="fs-md">
                A short summary of your review{' '}
                <span
                  className={cx({
                    'c-danger': this.state.model.title.length > 150,
                  })}
                >
                  {this.state.model.title.length}
                </span>{' '}
                /150 characters
              </div>
            ) : (
              <ValidationMessage for="title" />
            )}
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="message">Review Message</label>
            {isMobile() ? (
              <TextAreaField
                className="accent"
                name="message"
                id="message"
                onChange={value =>
                  this.props.completeReviewForm(['message'], !!value)}
                onFocus={() => this.setState({ showSecondaryMessage: true })}
                onBlur={() => this.setState({ showSecondaryMessage: false })}
              />
            ) : (
              <Editor
                editorClassName="accent productReviewForm__message"
                editorState={this.state.editorState}
                onEditorStateChange={this.onEditorStateChange}
                onFocus={() => this.setState({ showSecondaryMessage: true })}
              />
            )}
            {this.state.showSecondaryMessage &&
              messageLength < 50 && (
                <div className="fs-md c-danger">
                  Error: minimum review length is 50 characters.
                </div>
              )}
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="wouldPurchaseAgain">
              Would you purchase this product again?
            </label>
            <RadioGroup
              name="wouldPurchaseAgain"
              itemClassName="mr-md d-ib"
              options={[
                {
                  label: 'Yes',
                  value: true,
                },
                {
                  label: 'No',
                  value: false,
                },
              ]}
              value={this.state.model.wouldPurchaseAgain}
              onChange={this.onChangePurchase}
            />
          </div>
        </div>
        <div className="small-12 column text-center c-danger">
          {errorMessage}
        </div>
        {successMessage === '' && (
          <div className="row">
            <div className="small-12 column mb-md">
              {currentUser ? (
                <Button
                  className="button secondary"
                  type="submit"
                  element={Form.Button}
                  isLoading={isLoading}
                >
                  Submit
                </Button>
              ) : (
                <RequireAuth
                  toDo="create review"
                  shouldConfirm={shouldConfirm}
                  onClickLogin={this.onRedirect}
                  onClickRegister={this.onRedirect}
                >
                  <Button className="button secondary">Submit</Button>
                </RequireAuth>
              )}
            </div>
          </div>
        )}
      </Form>
    );
  }
}

export default ProductReviewForm;
