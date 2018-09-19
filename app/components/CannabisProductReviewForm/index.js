// @flow

import React, { Component } from 'react';
import Form, { Field, Summary } from 'react-formal';
import yup from 'yup';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import cx from 'classnames';
import moment from 'moment';
import numeral from 'numeral';
import { generate } from 'shortid';
import { cloneDeep, sumBy, reject } from 'lodash-es';
import { fromJS } from 'immutable';

import Button from 'components/Button';
import RequireAuth from 'components/RequireAuth';
import transformOptions from 'utils/transformOptions';
import getPlainText from 'utils/plainText';
import isMobile from 'utils/checkMobile';
import ValidationMessage from 'components/ValidationMessage';
import Editor from 'components/Editor';
import TextAreaField from 'components/TextAreaField';
import StarRating from 'components/StarRating';
import TagList from 'components/TagList';
import RadioButtonGroup from 'components/RadioButtonGroup';
import ImageRadioGroup from 'components/ImageRadioGroup';
import DatePicker from 'components/DatePicker';
import Dropzone from 'components/Dropzone';
import ProgressBar from 'components/ProgressBar';

import Icon from 'components/Icon';

import FORM_OPTIONS from 'enum/form/options';

import CONFIG from 'conf';

import IconTrash from 'images/sprite/trash.svg';

import './styles.scss';

function messageTest() {
  const { message } = this.parent;
  const content = getPlainText(message);
  if (!message || content.length < 50) return false;
  return true;
}

const today = moment();

const schema = yup.object({
  // note some of these values are duplicated in ReviewSubmitRequest generator located at containers/Product/sagas.js
  rating: yup
    .number()
    .min(0.5, 'You must include an Overall Rating')
    .max(5)
    .required(),
  title: yup.string().required('You must include a Review Title'),
  message: yup
    .string()
    .test(
      'messageTest',
      'Reviews must be at least 50 characters.  Please tell us more...',
      messageTest
    )
    .required(),
  wouldPurchaseAgain: yup.boolean(),
  batch: yup.string().nullable(),
  purchasedOn: yup
    .date()
    .nullable()
    .max(
      today,
      `Purchased on date must be at earlier than ${today.format('MM-DD-YYYY')}`
    ),
  purchasedPrice: yup.number().nullable(),
  thc: yup.number().nullable(),
  cbd: yup.number().nullable(),
  prescribedFor: yup.array().of(yup.object().required()),
  symptomsHelped: yup.array().of(
    yup.object({
      value: yup.string().required(),
      strength: yup
        .number()
        .min(1)
        .max(10),
    })
  ),
  flavours: yup.array().of(yup.object().required()),
  positiveEffects: yup.array().of(
    yup.object({
      value: yup.string().required(),
      strength: yup
        .number()
        .min(1)
        .max(10),
    })
  ),
  negativeEffects: yup.array().of(
    yup.object({
      value: yup.string().required(),
      strength: yup
        .number()
        .min(1)
        .max(10),
    })
  ),
  methodOfConsumption: yup
    .mixed()
    .oneOf([null, 'vaporizer', 'joint', 'bong', 'edibles'])
    .nullable(),
  timeOfConsumption: yup
    .mixed()
    .oneOf([null, 'morning', 'daytime', 'evening'])
    .nullable(),
  durationOfEffect: yup.number().nullable(),
});

type Props = {
  submitReview: Function,
  isLoading: boolean,
  reviewId: string,
  errorMessage: string,
  successMessage: string,
  productId: string,
  productType: string,
  reviewData: Object,
  currentUser: Object,
  pendingUser: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
  removePhoto: Function,
  uploadPhoto: Function,
};

type State = {
  model: Object,
  uploadedFiles: Array<Object>,
  editorState: ?Object,
  showSecondaryMessage: boolean,
  showSecondaryTitle: boolean,
};

class CannabisProductReviewForm extends Component<Props, State> {
  static defaultProps = {
    reviewData: fromJS({}),
    successMessage: '',
  };
  constructor(props: Props) {
    super(props);
    const tempData = localStorage.getItem(props.productId);
    if (tempData) {
      this.state = {
        model: JSON.parse(tempData),
        editorState: null,
        uploadedFiles: [],
        showSecondaryMessage: false,
        showSecondaryTitle: false,
      };
      this.submitReview(JSON.parse(tempData));
      localStorage.removeItem(props.productId);
    } else {
      const { currentUser } = props;
      const prescribedFor =
        currentUser && currentUser.get('knownConditions')
          ? transformOptions(currentUser.get('knownConditions').toJS())
          : [];
      this.state = {
        model: {
          rating: 0,
          title: '',
          message: '',
          wouldPurchaseAgain: true,
          batch: '',
          purchasedOn: null,
          purchasedPrice: null,
          thc: null,
          cbd: null,
          prescribedFor,
          symptomsHelped: [],
          flavours: [],
          positiveEffects: [],
          negativeEffects: [],
          methodOfConsumption: null,
          timeOfConsumption: null,
          durationOfEffect: null,
          photos: [],
        },
        editorState: null,
        uploadedFiles: [],
        showSecondaryMessage: false,
        showSecondaryTitle: false,
      };
    }
    this.dropzoneRef = null;
  }
  componentWillMount() {
    const { reviewData, reviewId } = this.props;
    const prescribedFor = reviewData.getIn(['data', 'prescribedFor'])
      ? reviewData.getIn(['data', 'prescribedFor']).toJS()
      : [];
    const symptomsHelped = reviewData.getIn(['data', 'symptomsHelped'])
      ? reviewData.getIn(['data', 'symptomsHelped']).toJS()
      : [];
    const flavours = reviewData.getIn(['data', 'flavours'])
      ? reviewData.getIn(['data', 'flavours']).toJS()
      : [];
    const positiveEffects = reviewData.getIn(['data', 'positiveEffects'])
      ? reviewData.getIn(['data', 'positiveEffects']).toJS()
      : [];
    const negativeEffects = reviewData.getIn(['data', 'negativeEffects'])
      ? reviewData.getIn(['data', 'negativeEffects']).toJS()
      : [];

    if (reviewId && reviewData.get('data')) {
      const message = reviewData.getIn(['data', 'message']) || '';
      const contentBlock = htmlToDraft(message);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      this.setState({
        model: {
          rating: reviewData.getIn(['data', 'rating']),
          title: reviewData.getIn(['data', 'title']),
          message: reviewData.getIn(['data', 'message']),
          wouldPurchaseAgain: reviewData.getIn(['data', 'wouldPurchaseAgain']),
          batch: reviewData.getIn(['data', 'batch']),
          purchasedOn: moment(
            reviewData.getIn(['data', 'purchasedOn'])
          ).toDate(),
          purchasedPrice: reviewData.getIn(['data', 'purchasedPrice']),
          thc: reviewData.getIn(['data', 'thc']),
          cbd: reviewData.getIn(['data', 'cbd']),
          prescribedFor,
          symptomsHelped,
          flavours,
          positiveEffects,
          negativeEffects,
          methodOfConsumption: reviewData.getIn([
            'data',
            'methodOfConsumption',
          ]),
          timeOfConsumption: reviewData.getIn(['data', 'timeOfConsumption']),
          durationOfEffect: reviewData.getIn(['data', 'durationOfEffect']),
          photos: [],
        },
        editorState,
        uploadedFiles: [],
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
      newProps.error === '' &&
      !reviewId
    ) {
      this.setState({
        model: {
          rating: 0,
          title: '',
          message: '',
          wouldPurchaseAgain: true,
          batch: '',
          purchasedOn: null,
          purchasedPrice: null,
          thc: null,
          cbd: null,
          prescribedFor: [],
          symptomsHelped: [],
          flavours: [],
          positiveEffects: [],
          negativeEffects: [],
          methodOfConsumption: null,
          timeOfConsumption: null,
          durationOfEffect: null,
          photos: [],
        },
        editorState: null,
        uploadedFiles: [],
        showSecondaryMessage: false,
        showSecondaryTitle: false,
      });
    }

    if (newProps.isUploading === false && newProps.uploadedPhotos) {
      const newState = cloneDeep(this.state);
      const uploadedPhotos = newProps.uploadedPhotos.toJS();
      newState.model.photos = uploadedPhotos;
      for (let i = 0; i < this.state.uploadedFiles.length; i += 1) {
        if (uploadedPhotos[i]) {
          newState.uploadedFiles[i].progress = 100;
          newState.uploadedFiles[i].photo = uploadedPhotos[i];
          clearInterval(newState.uploadingFuncs[i]);
        }
      }
      this.setState(newState);
    }
  }
  componentWillUnmount() {
    this.props.clearReviewForm();
  }

  onChange = (model: Object) => {
    this.setState({ model });
  };

  onChangeRate = (rate: Number) => {
    const model = cloneDeep(this.state.model);
    model.rating = rate;
    this.props.completeReviewForm(['rating'], !!rate);
    this.onChange(model);
  };

  onChangePurchase = (value?: Boolean) => {
    const model = cloneDeep(this.state.model);
    model.wouldPurchaseAgain = value;
    this.onChange(model);
  };

  onChangeTaglist = (path: string, value?: Boolean) => {
    const model = cloneDeep(this.state.model);
    model[path] = value;
    this.onChange(model);
  };

  onChangeMethodOfConsumption = (value?: string) => {
    const model = cloneDeep(this.state.model);
    model.methodOfConsumption = value;
    this.onChange(model);
  };

  onChangeTimeOfConsumption = (value?: string) => {
    const model = cloneDeep(this.state.model);
    model.timeOfConsumption = value;
    this.onChange(model);
  };

  onRedirect = () => {
    const { productId, reviewId } = this.props;
    const postData = cloneDeep(this.state.model);
    postData.product = productId;
    postData.__t = 'CannabisProductReview';
    postData.id = reviewId;
    postData.url = window.location.pathname;
    localStorage.setItem(productId, JSON.stringify(postData));
  };

  onDrop = (accepted: Array<Object>) => {
    const photosCount = this.state.uploadedFiles.length;
    const newState = cloneDeep(this.state);
    newState.uploadedFiles = this.state.uploadedFiles.concat(accepted);
    newState.uploadingFuncs = [];
    for (let index = 0; index < accepted.length; index += 1) {
      const gIndex = index + photosCount;
      this.props.uploadPhoto(gIndex, accepted[index]);
      newState.uploadedFiles[gIndex].progress = 0;
      newState.uploadingFuncs.push(
        setInterval(
          funcIndex => {
            const { progress } = this.state.uploadedFiles[funcIndex];
            if (progress >= 95) {
              newState.uploadedFiles[funcIndex].progress =
                progress + Math.ceil((98 - progress) / 2);
            } else {
              newState.uploadedFiles[funcIndex].progress = progress + 5;
            }
          },
          80,
          gIndex
        )
      );
    }
    this.setState(newState);
  };

  onEditorStateChange: Function = editorState => {
    this.setState({
      model: {
        ...this.state.model,
        message: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      },
      editorState,
    });
  };

  dropzoneRef: ?Object;

  submitReview = (data: Object) => {
    const {
      productId,
      submitReview,
      reviewData,
      reviewId,
      currentUser,
    } = this.props;
    const reviewPhotos = reviewData.getIn(['data', 'photos'])
      ? reviewData.getIn(['data', 'photos']).toJS()
      : [];
    const postData = data;
    postData.product = productId;
    postData.__t = 'CannabisProductReview';
    postData.id = reviewId;
    postData.url = window.location.pathname;
    postData.photos = reviewPhotos.concat(this.state.model.photos);
    if (currentUser) {
      submitReview(postData, reviewData.getIn(['data', 'id']));
    }
  };

  removePhoto = (index: number) => {
    this.setState({ uploadedFiles: this.state.uploadedFiles.splice(index, 1) });
    this.props.removePhoto(index);
  };

  render() {
    const {
      isLoading,
      errorMessage,
      successMessage,
      currentUser,
      pendingUser,
      productType,
    } = this.props;
    const {
      model: { message },
    } = this.state;
    const messageLength = getPlainText(message).length;
    const minMessageLength = 50;
    const secondaryMessagePrompt =
      'Please elaborate on your experience: include how you felt before, during, and after. Describe your purchasing experience and anything else relevant to other cannabis product consumers.';
    const positiveEffectsPrompt = 'Creative, energetic, euphoric, etc...';
    const negativeEffectsPrompt = 'Nausea, anxiety, paranoia, etc...';
    const flavoursPrompt = 'Citrus, earthy, fruity, etc...';
    const prescribedForPrompt = 'Cancer, Glaucoma, HIV/AIDS, etc...';
    const symptomsHelpedPrompt = 'Anxiety, insomnia, pain, etc...';
    const reviewScores = {
      rating: 10,
      title: 20,
      message: 40,
      wouldPurchaseAgain: 10,
      batch: 20,
      purchasedOn: 10,
      purchasedPrice: 10,
      thc: 10,
      cbd: 10,
      prescribedFor: 20,
      symptomsHelped: 20,
      flavours: 20,
      positiveEffects: 20,
      negativeEffects: 20,
      methodOfConsumption: 20,
      timeOfConsumption: 20,
      photos: 20,
    };
    const totalPoints = sumBy(Object.values(reviewScores));
    const isOil = productType === 'Oil';
    const purchasedPriceLabel = () => {
      const unit = isOil ? 'Bottle' : 'Gram';
      return `Price Per ${unit} (${reviewScores.purchasedPrice}pts)`;
    };
    const cannabinoidLabel = cannabinoid => {
      const unit = isOil ? 'mg/ml' : '%';
      return `${cannabinoid} ${unit} (${reviewScores[cannabinoid]}pts)`;
    };
    const shouldConfirm = !currentUser && !!pendingUser;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={this.submitReview}
        className="cannabisProductReviewForm"
      >
        <div className="row">
          <div className="column">
            <h4 className="t-capitalize">
              Create Review (earn up to {totalPoints}
              pts)
            </h4>
          </div>
        </div>
        <div className="row mb-md">
          <div className="column">
            <label htmlFor="title">
              Overall Rating ({reviewScores.rating}
              pts)
            </label>
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
        <div className="row">
          <div className="column">
            <label htmlFor="title">
              Review Title ({reviewScores.title}
              pts)
            </label>
            <Field
              className="accent cannabisProductReviewForm__title"
              name="title"
              id="title"
              type="text"
              onChange={value =>
                this.props.completeReviewForm(['title'], !!value)
              }
              onFocus={() => this.setState({ showSecondaryTitle: true })}
              onBlur={() => this.setState({ showSecondaryTitle: false })}
            />
            {this.state.showSecondaryTitle ? (
              <div className="fs-md">
                Create a short, descriptive and accurate title for your review
              </div>
            ) : null}
            {!this.state.showSecondaryTitle && (
              <ValidationMessage for="title" />
            )}
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column pt-md">
            <label htmlFor="message">
              Review Comments ({reviewScores.message}
              pts)
            </label>
            {isMobile() ? (
              <TextAreaField
                className="accent cannabisProductReviewForm__message"
                name="message"
                id="message"
                onChange={value =>
                  this.props.completeReviewForm(['message'], !!value)
                }
                onFocus={() => this.setState({ showSecondaryMessage: true })}
                onBlur={() => this.setState({ showSecondaryMessage: false })}
              />
            ) : (
              <Editor
                editorClassName="accent cannabisProductReviewForm__message"
                editorState={this.state.editorState}
                onEditorStateChange={this.onEditorStateChange}
                onFocus={() => this.setState({ showSecondaryMessage: true })}
                onBlur={() => this.setState({ showSecondaryMessage: false })}
              />
            )}
            {this.state.showSecondaryMessage && (
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
            {!this.state.showSecondaryMessage && (
              <ValidationMessage for="message" />
            )}
          </div>
        </div>
        <div className="row mb-mx">
          <div className="column">
            <label htmlFor="wouldPurchaseAgain">
              Would you purchase this product again? (
              {reviewScores.wouldPurchaseAgain}
              pts)
            </label>
            <RadioButtonGroup
              id="wouldPurchaseAgain"
              name="wouldPurchaseAgain"
              className="expanded"
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
              onChange={this.onChangePurchase}
              selectedButton="Yes"
            />
          </div>
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Batch Information
            </a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              60pts
            </span>
          </div>
        </div>
        <div className="row mb-mx">
          <div className="columns small-12">
            <label htmlFor="batch">
              Batch or Lot ({reviewScores.batch}
              pts)
            </label>
            <Field className="accent" name="batch" id="batch" type="text" />
            <ValidationMessage for="batch" />
          </div>
          <div className="columns small-12">
            <label htmlFor="purchasedOn">
              Date Purchased On ({reviewScores.purchasedOn}
              pts)
            </label>
            <DatePicker
              value={this.state.model.purchasedOn}
              yearCounts={5}
              onChange={value => {
                this.setState({
                  model: {
                    ...this.state.model,
                    purchasedOn: value,
                  },
                });
              }}
            />
            <ValidationMessage for="purchasedOn" />
          </div>
          <div className="columns small-12 medium-4">
            <label htmlFor="purchasedPrice">{purchasedPriceLabel()}</label>
            <Field
              className="accent"
              name="purchasedPrice"
              id="purchasedPrice"
              type="text"
            />
            <ValidationMessage
              for="purchasedPrice"
              customError="Please type a number instead"
            />
          </div>
          <div className="columns small-12 medium-4">
            <label htmlFor="thc">{cannabinoidLabel('thc')}</label>
            <Field className="accent" name="thc" id="thc" type="text" />
            <ValidationMessage
              for="thc"
              customError="Please type a number instead"
            />
          </div>
          <div className="columns small-12 medium-4">
            <label htmlFor="cbd">{cannabinoidLabel('cbd')}</label>
            <Field className="accent" name="cbd" id="cbd" type="text" />
            <ValidationMessage
              for="cbd"
              customError="Please type a number instead"
            />
          </div>
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Conditions You Suffer From
            </a>
            <div className="fs-md">{prescribedForPrompt}</div>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.prescribedFor}
              pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={this.state.model.prescribedFor}
            typeaheadOptions={FORM_OPTIONS.PRESCRIBED_FOR_OPTIONS}
            inputPlaceholder="Type a condition here"
            className="mb-mx"
            onChange={value => this.onChangeTaglist('prescribedFor', value)}
          />
          <ValidationMessage for="prescribedFor" />
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Symptoms Helped
            </a>
            <div className="fs-md">{symptomsHelpedPrompt}</div>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.symptomsHelped}
              pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={this.state.model.symptomsHelped}
            typeaheadOptions={FORM_OPTIONS.SYMPTOMS_HELPED_OPTIONS}
            inputPlaceholder="Type a symptom here"
            className="mb-mx"
            showEffects
            onChange={value => this.onChangeTaglist('symptomsHelped', value)}
          />
          <ValidationMessage for="symptomsHelped" />
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Positive Effects
            </a>
            <div className="fs-md">{positiveEffectsPrompt}</div>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.positiveEffects}
              pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={this.state.model.positiveEffects}
            typeaheadOptions={FORM_OPTIONS.POSITIVE_EFFECTS_OPTIONS}
            inputPlaceholder="Type a positive effect here"
            className="mb-mx"
            showEffects
            onChange={value => this.onChangeTaglist('positiveEffects', value)}
          />
          <ValidationMessage for="positiveEffects" />
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Negative Effects
            </a>
            <div className="fs-md">{negativeEffectsPrompt}</div>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.negativeEffects}
              pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={this.state.model.negativeEffects}
            typeaheadOptions={FORM_OPTIONS.NEGATIVE_EFFECTS_OPTIONS}
            inputPlaceholder="Type a negative effect here"
            className="mb-mx"
            showEffects
            onChange={value => this.onChangeTaglist('negativeEffects', value)}
          />
          <ValidationMessage for="negativeEffects" />
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Flavours
            </a>
            <div className="fs-md">{flavoursPrompt}</div>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.flavours}
              pts
            </span>
          </div>
        </div>

        <div>
          <TagList
            value={this.state.model.flavours}
            typeaheadOptions={FORM_OPTIONS.FLAVOUR_OPTIONS}
            inputPlaceholder="Type a flavour here"
            className="mb-mx"
            onChange={value => this.onChangeTaglist('flavours', value)}
          />
          <ValidationMessage for="flavours" />
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Preferred Method Of Consumption
            </a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.methodOfConsumption}
              pts
            </span>
          </div>
        </div>

        <div>
          <ImageRadioGroup
            name="methodOfConsumption"
            itemClassName={cx(
              'column small-6',
              isOil ? 'medium-4' : 'medium-3'
            )}
            className="row mb-mx"
            value={this.state.model.methodOfConsumption}
            options={
              isOil
                ? reject(FORM_OPTIONS.CONSUMPTION_METHODS_OPTIONS, {
                    value: 'bong',
                  })
                : FORM_OPTIONS.CONSUMPTION_METHODS_OPTIONS
            }
            onChange={this.onChangeMethodOfConsumption}
          />
          <ValidationMessage for="methodOfConsumption" />
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Preferred Time Of Consumption
            </a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.timeOfConsumption}
              pts
            </span>
          </div>
        </div>

        <div>
          <ImageRadioGroup
            name="timeOfConsumption"
            itemClassName="column small-6 medium-4"
            className="row mb-mx"
            value={this.state.model.timeOfConsumption}
            options={FORM_OPTIONS.TIME_OF_CONSUMPTION_OPTIONS}
            onChange={this.onChangeTimeOfConsumption}
          />
          <ValidationMessage for="timeOfConsumption" />
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Hours of Effectiveness
            </a>
          </div>
          <div className="shrink column bt-light-gray pt-md" />
        </div>

        <div className="row mb-mx">
          <div className="column">
            <Field
              name="durationOfEffect"
              type="select"
              className="accent cannabisProductReviewForm__select"
            >
              <option value={null}>Select duration...</option>
              <option value={0.5}>0.5</option>
              <option value={1}>1</option>
              <option value={1.5}>1.5</option>
              <option value={2}>2</option>
              <option value={2.5}>2.5</option>
              <option value={3}>3</option>
              <option value={3.5}>3.5</option>
              <option value={4}>4</option>
              <option value={4.5}>4.5</option>
              <option value={5}>5</option>
              <option value={5.5}>5.5</option>
              <option value={6}>6</option>
            </Field>
            <ValidationMessage for="durationOfEffect" />
          </div>
        </div>

        <div className="row mb-mx">
          <div className="column bt-light-gray pt-md">
            <a className="fs-mx t-capitalize cannabisProductReviewForm__toggleHeader">
              Photos
            </a>
          </div>
          <div className="shrink column bt-light-gray pt-md">
            <span className="cannabisProductReviewForm__toggleLabel">
              {reviewScores.photos}
              pts
            </span>
          </div>
        </div>

        <div className="row mb-mx">
          <div className="column small-12 mb-md">
            <Dropzone
              className="cannabisProductReviewForm__dropzone"
              ref={node => {
                this.dropzoneRef = node;
              }}
              accept="image/*"
              onDrop={this.onDrop}
            >
              <div className="text-center">
                <Button
                  type="button"
                  className="cannabisProductReviewForm__dropzoneButton secondary"
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  Choose Files
                </Button>
                <div className="cannabisProductReviewForm__dropzoneLabel">
                  or drag’n’drop here
                </div>
              </div>
            </Dropzone>
          </div>
          {this.state.uploadedFiles &&
            this.state.uploadedFiles.length > 0 && (
              <div className="column small-12 fs-base">
                {this.state.uploadedFiles.map((item, index) => (
                  <div
                    className="row align-middle cannabisProductReviewForm__photoRowLabel"
                    key={generate()}
                  >
                    <div className="column shrink mb-sm">
                      <img
                        className="cannabisProductReviewForm__previewImage"
                        src={`${CONFIG.APP.CDN_URL}/resize/270x270/${
                          item.photo
                        }`}
                        alt={item.name}
                      />
                    </div>
                    <div className="column">
                      <div className="row align-middle">
                        <div className="column small-10 small-order-1 medium-3 cannabisProductReviewForm__photoName mb-sm">
                          {item.name}
                        </div>
                        <div className="column hide-for-small-only medium-2 mb-sm">
                          {numeral(item.size).format('0.00 b')}
                        </div>
                        <div className="column small-12 medium-6 small-order-3 medium-order-2 mb-sm">
                          <ProgressBar
                            value={item.progress}
                            maxValue={100}
                            width={8}
                            trailWidth={8}
                            color="#a0ce67"
                            initialAnimate={false}
                          />
                        </div>
                        <div className="column small-2 medium-1 small-order-2 medium-order-3 text-right mb-sm">
                          {item.progress === 100 ? (
                            <Icon
                              glyph={IconTrash}
                              size={14}
                              onClick={() => this.removePhoto(index)}
                              className="cannabisProductReviewForm__toggleIcon"
                            />
                          ) : (
                            `${item.progress}%`
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        <div className="small-12 column text-center c-danger">
          {errorMessage}
        </div>
        <Summary className="mb-md" />
        {successMessage === '' && (
          <div className="row">
            <div className="small-12 column mb-md bt-light-gray pt-md">
              {currentUser ? (
                <Button
                  className="cannabisProductReviewForm__submitButton button secondary large expanded"
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
                  <Button className="button secondary large expanded">
                    Submit
                  </Button>
                </RequireAuth>
              )}
            </div>
          </div>
        )}
      </Form>
    );
  }
}

export default CannabisProductReviewForm;
