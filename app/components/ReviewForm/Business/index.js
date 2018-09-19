// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import cx from 'classnames';
import { generate } from 'shortid';

import isMobile from 'utils/checkMobile';
import getPlainText from 'utils/plainText';
import TextAreaField from 'components/TextAreaField';
import Editor from 'components/Editor';
import Button from 'components/Button';
import RequireAuth from 'components/RequireAuth';
import RadioGroup from 'components/RadioGroup';
import ValidationMessage from 'components/ValidationMessage';
import StarRating from 'components/StarRating';

import { BUSINESS_REVIEW_FIELDS } from 'enum/constants';

import './styles.scss';

const experienceSchema = {
  producer: yup.object({
    experience: yup.object({
      pricing: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      speedOfDelivery: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      helpfulness: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      orderingProcess: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
    }),
  }),
  doctor: yup.object({
    experience: yup.object({
      customerService: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      knowledge: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      waitTime: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      facilities: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
    }),
  }),
  dispensary: yup.object({
    experience: yup.object({
      customerService: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      knowledge: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      pricing: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
      productSelection: yup
        .number()
        .min(0.5, 'must be rated.')
        .max(5),
    }),
  }),
};

function messageTest() {
  const { message } = this.parent;
  const content = getPlainText(message);
  if (!message || content.length < 50) return false;
  return true;
}

const schema = yup.object({
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
  category: string,
  submitReview: Function,
  isLoading: boolean,
  reviewId: string,
  businessId: string,
  error: string,
  slug: string,
  reviewData: Object,
  currentUser: Object,
  pendingUser: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
};

class BusinessReviewForm extends Component<
  Props,
  {
    model: Object,
    editorState: ?Object,
    showSecondaryTitle: boolean,
    showSecondaryMessage: boolean,
    schema: Object,
    message: string,
    starRatingFields: Array<*>,
  }
> {
  constructor(props: Object) {
    super(props);
    const { category } = props;
    const tempData = localStorage.getItem(props.businessId);
    const starRatingFields = BUSINESS_REVIEW_FIELDS[category];
    if (tempData) {
      this.state = {
        model: JSON.parse(tempData),
        showSecondaryTitle: false,
        showSecondaryMessage: false,
        message: '',
        editorState: null,
        schema: experienceSchema[category].concat(schema),
        starRatingFields,
      };
      this.submitReview(JSON.parse(tempData));
      localStorage.removeItem(props.businessId);
    } else {
      this.state = {
        model: {
          experience: this.createExperience(starRatingFields),
          title: '',
          message: '',
          wouldPurchaseAgain: true,
        },
        showSecondaryTitle: false,
        showSecondaryMessage: false,
        message: '',
        editorState: null,
        schema: experienceSchema[category].concat(schema),
        starRatingFields,
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
          experience: this.createExperience(
            this.state.starRatingFields,
            reviewData
          ),
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
    const pendingReview =
      isLoading === true &&
      newProps.isLoading === false &&
      newProps.error === '' &&
      !reviewId;
    if (pendingReview) {
      this.setState({
        model: {
          experience: this.createExperience(this.state.starRatingFields),
          title: '',
          message: '',
          wouldPurchaseAgain: true,
        },
        editorState: null,
        showSecondaryTitle: false,
        message:
          "Your review has been submitted and is pending approval. We'll let you know once it's approved. This usually takes a 24-48 hours.",
      });
    } else if (
      isLoading === true &&
      newProps.isLoading === false &&
      newProps.error !== '' &&
      !reviewId
    ) {
      this.setState({ message: '' });
    }
  }
  componentWillUnmount() {
    this.props.clearReviewForm();
  }
  onChange = (model: Object) => {
    this.setState({ model });
  };

  onChangeRate = (rate: Number, type: string) => {
    const { model } = this.state;
    model.experience[type] = rate;
    this.props.completeReviewForm(['rating'], !!rate);
    this.onChange(model);
  };

  onChangePurchase = (value?: Boolean) => {
    const { model } = this.state;
    model.wouldPurchaseAgain = value;
    this.onChange(model);
  };

  onRedirect = () => {
    const { slug, businessId } = this.props;
    const postData = this.state.model;
    postData.business = businessId;
    postData.slug = slug;
    postData.url = window.location.pathname;
    localStorage.setItem(businessId, JSON.stringify(postData));
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
    const {
      slug,
      submitReview,
      reviewData,
      businessId,
      currentUser,
    } = this.props;
    const postData = data;
    postData.business = businessId;
    postData.slug = slug;
    postData.url = window.location.pathname;
    if (currentUser) {
      submitReview(postData, reviewData.getIn(['data', 'id']));
    }
  };

  createExperience = (starRatingFields: Array<*>, reviewData?: Object) => {
    const exp = {};
    starRatingFields.forEach(({ model }) => {
      exp[model] = reviewData
        ? reviewData.getIn(['data', 'experience', model])
        : 0;
    });
    return exp;
  };

  render() {
    const { isLoading, error, category, currentUser, pendingUser } = this.props;
    const { model: { message } } = this.state;
    const starSize = 55;
    const totalPoints = 80;
    const reviewScores = {
      title: 20,
      message: 40,
      wouldPurchaseAgain: 10,
    };
    const messageLength = getPlainText(message).length;
    const shouldConfirm = !currentUser && !!pendingUser;
    return (
      <Form
        schema={this.state.schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={this.submitReview}
        className="businessReviewForm"
      >
        <div className="row mb-mx">
          <div className="column">
            <div className="fs-mx t-capitalize">
              Create Review {category} (earn up to {totalPoints}pts)
            </div>
          </div>
        </div>

        {this.state.starRatingFields.map(({ title, model }) => (
          <div className="row mb-md" key={generate()}>
            <div className="column">
              <label htmlFor="title">{title} (2.5 pts)</label>
              <StarRating
                initialRating={this.state.model.experience[model]}
                readonly={false}
                size={starSize}
                onChange={rate => {
                  this.onChangeRate(rate, model);
                }}
                id={`experience_${model}`}
              />
              <ValidationMessage for={`experience.${model}`} />
            </div>
          </div>
        ))}

        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="title">
              Review Title ({reviewScores.title}pts)
            </label>
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
            <label htmlFor="message">
              Review Message ({reviewScores.message}pts)
            </label>
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
                editorClassName="accent businessReviewForm__messageEditor"
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
              Would you purchase from this {category} again? ({reviewScores.wouldPurchaseAgain}pts)
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
        <div className="small-12 column text-center c-danger">{error}</div>
        <div className="small-12 column text-center c-green">
          <strong>{this.state.message}</strong>
        </div>
        {this.state.message === '' && (
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

export default BusinessReviewForm;
