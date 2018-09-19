// @flow

import React, { Component } from 'react';
import Form from 'react-formal';
import yup from 'yup';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import cx from 'classnames';
import moment from 'moment';
import { cloneDeep, each } from 'lodash-es';
import { fromJS } from 'immutable';

import { history } from 'components/ConnectedRouter';
import Button from 'components/Button';
import getPlainText from 'utils/plainText';
import Icon from 'components/Icon';
import RequireAuth from 'components/RequireAuth';
import ValidationMessage from 'components/ValidationMessage';

import Link from 'components/Link';
import VerticalStepper from 'components/VerticalStepper';
import pluralizeCategory from 'utils/pluralizeCategory';

import NewProductReviewFormStep1 from 'components/NewProductReviewForm/Step1';
import NewProductReviewFormStep2 from 'components/NewProductReviewForm/Step2';
import NewProductReviewFormStep3 from 'components/NewProductReviewForm/Step3';
import NewProductReviewFormStep4 from 'components/NewProductReviewForm/Step4';
import NewProductReviewFormStep5 from 'components/NewProductReviewForm/Step5';
import NewProductReviewFormStep6 from 'components/NewProductReviewForm/Step6';

import Logo from 'images/sprite/logo.svg';

import ProductReviewSteps from 'enum/products/ReviewSteps';

import './styles.scss';

const today = moment();

function messageTest() {
  const { message } = this.parent;
  const content = getPlainText(message);
  if (content && content.length < 40) return false;
  return true;
}

function titleTest() {
  const { title } = this.parent;
  if (title && title.length < 20) return false;
  return true;
}

const reviewScores = {
  rating: 20,
  wouldPurchaseAgain: 10,
  positiveEffects: 30,
  negativeEffects: 20,
  symptomsHelped: 30,
  durationOfEffect: 20,
  onset: 20,
  flavours: 10,
  methodOfConsumption: 20,
  timeOfConsumption: 10,
  title: 20,
  message: 60,
  batch: 10,
  purchasedOn: 10,
  photos: 10,
};

const arrayFields = [
  'positiveEffects',
  'negativeEffects',
  'symptomsHelped',
  'flavours',
  'photos',
];

const getCurrentScore = data => {
  const total = {};
  each(data, (item, key) => {
    const isArray = arrayFields.indexOf(key) > -1;
    if (
      (isArray && item && item.length > 0) ||
      (!isArray && item) ||
      key === 'wouldPurchaseAgain' // false for wouldPurchaseAgain should get score
    ) {
      total[key] = reviewScores[key] || 0;
    }
  });
  return total;
};

const schema = yup.object({
  // note some of these values are duplicated in ReviewSubmitRequest generator located at containers/Product/sagas.js
  rating: yup
    .number()
    .min(0.5, 'You must include an Overall Rating')
    .max(5)
    .required('You must include an Overall Rating'),
  title: yup
    .string()
    .test(
      'titleTest',
      'Review Title must be at least 20 characters',
      titleTest
    ),
  message: yup
    .string()
    .test(
      'messageTest',
      'Review Message must be at least 40 characters. Please tell us more',
      messageTest
    ),
  wouldPurchaseAgain: yup.boolean(),
  batch: yup
    .string()
    .nullable()
    .max(20),
  purchasedOn: yup
    .date()
    .nullable()
    .max(
      today,
      `Purchased on date must be at earlier than ${today.format('MM-DD-YYYY')}`
    ),
  symptomsHelped: yup.array().of(
    yup.object({
      value: yup.string(),
      strength: yup
        .number()
        .min(0)
        .max(10),
    })
  ),
  positiveEffects: yup.array().of(
    yup.object({
      value: yup.string(),
      strength: yup
        .number()
        .min(0)
        .max(10),
    })
  ),
  negativeEffects: yup.array().of(
    yup.object({
      value: yup.string(),
      strength: yup
        .number()
        .min(0)
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
  onset: yup.number().nullable(),
});

type Props = {
  saveReviewDraft: Function,
  submitReview: Function,
  isLoading: boolean,
  reviewId: string,
  error: string,
  errorMessage: string,
  successMessage: string,
  productId: string,
  productType: string,
  reviewData: Object,
  reviewDraft: Object,
  data: Object,
  currentUser: Object,
  completeReviewForm: Function,
  clearReviewForm: Function,
  removePhoto: Function,
  uploadPhoto: Function,
  isUploading: boolean,
  uploadedPhotos: List<Map>,
  step?: number,
};

type State = {
  model: Object,
  uploadedFiles: Array<Object>,
  editorState: ?Object,
  showSecondaryMessage: boolean,
  showSecondaryTitle: boolean,
  wasUploading: boolean,
  wasLoading: boolean,
  reviewId: string,
  toggled: boolean,
};
class NewReviewFormContainer extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { reviewId, wasLoading, wasUploading } = prevState;
    const uploadComplete = wasUploading && !nextProps.isUploading;
    if (
      wasLoading === true &&
      nextProps.isLoading === false &&
      nextProps.error === '' &&
      !reviewId
    ) {
      return {
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
        wasUploading: nextProps.isUploading,
        wasLoading: nextProps.isLoading,
        reviewId: nextProps.reviewId,
      };
    }
    if (uploadComplete) {
      const newState = cloneDeep(prevState);
      const uploadedPhotos = nextProps.uploadedPhotos
        .map(item => item.get('link'))
        .filter(item => item !== '')
        .toJS();
      newState.model.photos = uploadedPhotos;
      newState.wasUploading = nextProps.isUploading;
      newState.wasLoading = nextProps.isLoading;
      newState.error = nextProps.error;
      return newState;
    }
    return {
      wasUploading: nextProps.isUploading,
      wasLoading: nextProps.isLoading,
      error: nextProps.error,
      reviewId: nextProps.reviewId,
    };
  }
  static defaultProps = {
    reviewData: fromJS({}),
    successMessage: '',
  };
  constructor(props: Props) {
    super(props);
    const { reviewDraft, productId } = props;
    let initialData = reviewDraft;
    const getProp = property => initialData.getIn(['data', property]);
    const getProptoJs = (property, defaultValue) => {
      const propVal = getProp(property);
      return propVal ? propVal.toJS() : defaultValue;
    };
    if (reviewDraft.getIn(['data', 'productId']) !== productId) {
      this.props.saveReviewDraft({});
      initialData = fromJS({});
    }
    const symptomsHelped = getProptoJs('symptomsHelped', []);
    const positiveEffects = getProptoJs('positiveEffects', []);
    const negativeEffects = getProptoJs('negativeEffects', []);
    const flavours = getProptoJs('flavours', []);
    const message = getProptoJs('message') || '';
    const contentBlock = htmlToDraft(message);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const uploadedFiles = getProptoJs('uploadedFiles', []);
    const photos = getProptoJs('photos', []);
    const purchasedOn = initialData.getIn(['data', 'purchasedOn'])
      ? moment(initialData.getIn(['data', 'purchasedOn'])).toDate()
      : null;
    const editorState = EditorState.createWithContent(contentState);
    this.state = {
      model: {
        rating: initialData.getIn(['data', 'rating'], null),
        title: initialData.getIn(['data', 'title'], ''),
        message: initialData.getIn(['data', 'message'], ''),
        wouldPurchaseAgain: initialData.getIn(
          ['data', 'wouldPurchaseAgain'],
          true
        ),
        batch: initialData.getIn(['data', 'batch'], ''),
        purchasedOn,
        symptomsHelped,
        flavours,
        positiveEffects,
        negativeEffects,
        methodOfConsumption: initialData.getIn(
          ['data', 'methodOfConsumption'],
          null
        ),
        timeOfConsumption: initialData.getIn(
          ['data', 'timeOfConsumption'],
          null
        ),
        durationOfEffect: initialData.getIn(['data', 'durationOfEffect'], null),
        onset: initialData.getIn(['data', 'onset'], null),
        photos,
      },
      editorState,
      uploadedFiles,
      showSecondaryMessage: false,
      showSecondaryTitle: false,
      wasUploading: props.isUploading, // eslint-disable-line react/no-unused-state
      wasLoading: props.isLoading, // eslint-disable-line react/no-unused-state
      error: props.error, // eslint-disable-line react/no-unused-state
      reviewId: props.reviewId, // eslint-disable-line react/no-unused-state
      toggled: false,
    };
  }

  componentDidMount() {
    const { reviewDraft } = this.props;
    if (!reviewDraft.getIn(['data', 'rating'], null)) {
      this.goToStep(1);
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

  onChangeTaglist = (path: string, value?: Boolean) => {
    const model = cloneDeep(this.state.model);
    model[path] = value;
    this.onChange(model);
  };

  onChangePurchase = (value?: Boolean) => {
    const model = cloneDeep(this.state.model);
    model.wouldPurchaseAgain = value;
    this.onChange(model);
  };

  onRedirect = () => {
    const { model, uploadedFiles } = this.state;
    const draftData = model;
    draftData.uploadedFiles = uploadedFiles;
    this.props.saveReviewDraft(draftData);
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

  onEditorStateChange: Function = editorState => {
    const message = draftToHtml(convertToRaw(editorState.getCurrentContent()))
    this.setState({
      model: {
        ...this.state.model,
        message,
      },
      editorState,
    });
  };

  onDrop = (accepted: Array<Object>) => {
    // eslint-disable-next-line
    const uploadedFiles = this.state.uploadedFiles;
    const photosCount = uploadedFiles.length;
    const newState = cloneDeep(this.state);
    newState.uploadedFiles = uploadedFiles.concat(accepted);
    for (let index = 0; index < accepted.length; index += 1) {
      const gIndex = index + photosCount;
      this.props.uploadPhoto(gIndex, accepted[index]);
      newState.uploadedFiles[gIndex].progress = 0;
    }
    this.setState(newState);
  };

  removePhoto = (index: number) => {
    const { uploadedFiles } = this.state;
    uploadedFiles.splice(index, 1);
    this.setState({ uploadedFiles });

    this.props.removePhoto(index);
  };

  handleSubmit = (data: Object) => {
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
    this.saveCurrentData();
    postData.product = productId;
    postData.__t = 'CannabisProductReview';
    postData.id = reviewId;
    postData.url = window.location.pathname;
    postData.photos = reviewPhotos.concat(this.state.model.photos);
    if (currentUser) {
      submitReview(postData, reviewData.getIn(['data', 'id']));
    }
  };

  saveCurrentData = () => {
    const { model, uploadedFiles } = this.state;
    const draftData = model;
    const { productId } = this.props;
    draftData.uploadedFiles = uploadedFiles;
    draftData.productId = productId;
    this.props.saveReviewDraft(draftData);
  };

  goToStep = (step: number) => {
    const { model, uploadedFiles } = this.state;
    const { data } = this.props;
    const draftData = model;
    const catgories = pluralizeCategory(data.get('__t'));
    const slug = data.get('slug');
    this.saveCurrentData();
    draftData.uploadedFiles = uploadedFiles;
    history.push(`/${catgories}/${slug}/create-review/${step}`);
  };

  handleToggle = () => {
    const { toggled } = this.state;
    this.setState({ toggled: !toggled });
  };

  render() {
    const {
      step = 1,
      isLoading,
      isUploading,
      errorMessage,
      successMessage,
      currentUser,
      productType,
      data,
      uploadedPhotos,
    } = this.props;
    const { uploadedFiles, toggled } = this.state;
    const isOil = productType === 'Oil';
    const currentScoreData = getCurrentScore(this.state.model);
    const catgories = pluralizeCategory(data.get('__t'));
    const slug = data.get('slug');
    return (
      <div className="newProductReviewForm">
        <div className="newProductReviewForm__container">
          <div className="newProductReviewForm__header">
            <Link to="/">
              <Icon
                glyph={Logo}
                width={100}
                height={35}
                className="newProductReviewForm__logo"
              />
            </Link>
            <Link
              to={`/${catgories}/${slug}`}
              className="newProductReviewForm__skipLink"
            >
              Close
            </Link>
          </div>
          <Form
            schema={schema}
            value={this.state.model}
            onChange={this.onChange}
            onSubmit={this.handleSubmit}
            className={cx('newProductReviewForm__body', {
              'newProductReviewForm__body--bg': step === 1,
            })}
          >
            <div className="row">
              {step > 1 && (
                <VerticalStepper
                  className="column small-3 medium-6"
                  stepsClassName="newProductReviewForm__steps"
                  data={ProductReviewSteps}
                  currentScoreData={currentScoreData}
                  totalScoreData={reviewScores}
                  goToStep={this.goToStep}
                  step={step - 1}
                  toggled={toggled}
                  onToggle={this.handleToggle}
                  showButton={successMessage === ''}
                  currentUser={currentUser}
                  isLoading={isLoading}
                  isUploading={isUploading}
                  onRedirect={this.onRedirect}
                />
              )}
              <div
                className={cx(
                  'newProductReviewForm__stepBody column',
                  step === 1 || toggled ? 'small-12' : 'small-9',
                  step === 1 ? 'medium-4' : 'medium-6'
                )}
              >
                <h1 className="mb-sm">{data && data.get('name')}</h1>
                <h6 className="mb-lg">
                  By {data && data.getIn(['business', 'name'])}
                </h6>
                {step === 1 && (
                  <NewProductReviewFormStep1
                    reviewScores={reviewScores}
                    model={this.state.model}
                    onChangeRate={this.onChangeRate}
                    onChangePurchase={this.onChangePurchase}
                    productType={productType}
                  />
                )}
                {step === 2 && (
                  <NewProductReviewFormStep2
                    reviewScores={reviewScores}
                    model={this.state.model}
                    onChangeTaglist={this.onChangeTaglist}
                  />
                )}

                {step === 3 && (
                  <NewProductReviewFormStep3
                    reviewScores={reviewScores}
                    model={this.state.model}
                    isOil={isOil}
                    onChangeMethodOfConsumption={
                      this.onChangeMethodOfConsumption
                    }
                    onChangeTimeOfConsumption={this.onChangeTimeOfConsumption}
                    onChangeTaglist={this.onChangeTaglist}
                  />
                )}

                {step === 4 && (
                  <NewProductReviewFormStep4
                    reviewScores={reviewScores}
                    model={this.state.model}
                    editorState={this.state.editorState}
                    showSecondaryTitle={this.state.showSecondaryTitle}
                    showSecondaryMessage={this.state.showSecondaryMessage}
                    completeReviewForm={this.props.completeReviewForm}
                    onEditorStateChange={this.onEditorStateChange}
                    onFocusTitle={() =>
                      this.setState({ showSecondaryTitle: true })
                    }
                    onBlurTitle={() =>
                      this.setState({ showSecondaryTitle: false })
                    }
                    onFocusMessage={() =>
                      this.setState({ showSecondaryMessage: true })
                    }
                    onBlurMessage={() =>
                      this.setState({ showSecondaryMessage: false })
                    }
                  />
                )}

                {step === 5 && (
                  <NewProductReviewFormStep5
                    reviewScores={reviewScores}
                    model={this.state.model}
                    isOil={isOil}
                    onDatePickerChange={value => {
                      this.setState({
                        model: {
                          ...this.state.model,
                          purchasedOn: value,
                        },
                      });
                    }}
                  />
                )}

                {step === 6 && (
                  <NewProductReviewFormStep6
                    reviewScores={reviewScores}
                    uploadedFiles={uploadedFiles}
                    uploadedPhotos={uploadedPhotos}
                    onRemovePhoto={this.removePhoto}
                    onDrop={this.onDrop}
                  />
                )}
                {step !== 1 && (
                  <div className="row column">
                    <ValidationMessage for="rating" />
                  </div>
                )}
                {step !== 4 && (
                  <div className="row column">
                    <ValidationMessage for="title" />
                    <ValidationMessage for="message" />
                  </div>
                )}
                <div className="row column text-center c-danger">
                  {errorMessage}
                </div>
                <div
                  className={cx(
                    'row column mb-md',
                    step === 1 ? 'text-left' : 'text-right'
                  )}
                >
                  {step > 1 && (
                    <Button
                      onClick={() => this.goToStep(step - 1)}
                      className="newProductReviewForm__backBtn hollow secondary"
                      element={Link}
                    >
                      Back
                    </Button>
                  )}
                  {step === 1 && (
                    <div className="fs-mn mb-tn">
                      Earn 270 more Lift Points!
                    </div>
                  )}
                  {step === 1 && (
                    <Button
                      onClick={() =>
                        this.state.model.rating && this.goToStep(step + 1)
                      }
                      className={cx('newProductReviewForm__nextBtn secondary', {
                        disabled: !this.state.model.rating,
                      })}
                      element={Link}
                    >
                      Continue
                    </Button>
                  )}
                  {step > 1 &&
                    step < 6 && (
                      <Button
                        onClick={() => this.goToStep(step + 1)}
                        className="newProductReviewForm__nextBtn hollow secondary"
                        element={Link}
                      >
                        Next
                      </Button>
                    )}
                  <div className="show-for-small-only">
                    {step === 6 &&
                      successMessage === '' &&
                      (currentUser ? (
                        <Button
                          className="button secondary large"
                          type="submit"
                          disabled={isUploading}
                          element={Form.Button}
                          isLoading={isLoading}
                        >
                          Submit
                        </Button>
                      ) : (
                        <div className="newProductReviewForm__authBtn">
                          <RequireAuth
                            toDo="create review"
                            onClickLogin={this.onRedirect}
                            onClickRegister={this.onRedirect}
                          >
                            <Button className="button secondary large">
                              Submit
                            </Button>
                          </RequireAuth>
                        </div>
                      ))}
                  </div>
                </div>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

export default NewReviewFormContainer;
