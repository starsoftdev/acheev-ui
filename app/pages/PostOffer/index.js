// @flow

import React, { Component, Fragment } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { generate } from 'shortid';
import { cloneDeep } from 'lodash-es';

import injectSagas from 'utils/injectSagas';
import saga, {
  reducer,
  requestCreateOffer,
  requestOfferPhotoUpload,
} from 'containers/Offer/sagas';

import PageBanner from 'components/PageBanner';
import TextAreaField from 'components/TextAreaField';
import Typeahead from 'components/Typeahead';
import Button from 'components/Button';
import Editor from 'components/Editor';
import Dropzone from 'components/Dropzone';
import TagList from 'components/TagList';
import Link from 'components/Link';
import ValidationMessage from 'components/ValidationMessage';

import transformOptions from 'utils/transformOptions';
import FILTER_OPTIONS from 'enum/filter/options';

import './styles.scss';

const schema = yup.object({
  job_name: yup.string().required(),
  category: yup.string().required(),
  sub_category: yup.string(),
  price: yup
    .number()
    .required()
    .min(1)
    .max(20),
  time_of_delivery: yup.number().required(),
  description: yup.string().required(),
  gallery: yup.array(yup.string()).required(),
  opening_message: yup.string().required(),
  tags: yup.array(yup.string()).required(),
});

type Props = {
  requestCreateOffer: Function,
  uploadPhoto: Function,
  isLoading: boolean,
  error: string,
  uploadedPhotos: List<Map>,
  isUploading: boolean,
};

type State = {
  model: {
    job_name: string,
    category: string,
    sub_category: string,
    price: number,
    time_of_delivery: number,
    description: string,
    gallery: Array<string>,
    opening_message: string,
  },
  editorState: ?Object,
};

class PostOfferPage extends Component<Props, State> {
  state = {
    model: {
      job_name: '',
      category: '',
      sub_category: '',
      description: '',
      gallery: [],
      opening_message: '',
      tags: [],
    },
    editorState: null,
  };
  componentDidUpdate(prevProps: Props) {
    const { isLoading, error, isUploading, uploadedPhotos } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      this.setState({
        model: {
          job_name: '',
          category: '',
          sub_category: '',
          description: '',
          gallery: [],
          opening_message: '',
          tags: [],
        },
        editorState: null,
      });
    }
    if (prevProps.isUploading && !isUploading) {
      this.setState(state => ({
        model: {
          ...state.model,
          gallery: uploadedPhotos,
        },
      }));
    }
  }
  onEditorStateChange: Function = editorState => {
    this.setState({
      model: {
        ...this.state.model,
        description: draftToHtml(convertToRaw(editorState.getCurrentContent())),
      },
      editorState,
    });
  };
  onDrop = async (accepted: Array<Object>) => {
    const promises = accepted.map(this.setupReader);
    const data = await Promise.all(promises);
    this.props.uploadPhoto(data);
  };
  onChangeTaglist = (path: string, value?: Boolean) => {
    const model = cloneDeep(this.state.model);
    model[path] = value.map(v => v.value);
    this.setState({ model });
  };
  setupReader = file =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = e => {
        const block = e.target.result.split(';');
        const [, base64] = block;
        const [, realData] = base64.split(',');
        resolve(realData);
      };
      reader.onerror = () => {
        reject();
      };
      reader.readAsDataURL(file);
    });
  triggerFileDialog = () => {
    this.refDiv.click();
  };
  dropzoneRef: ?Object;
  refDiv: HTMLElement;
  render() {
    const { isUploading } = this.props;
    const [currentCategory] = FILTER_OPTIONS.CATEGORY_OPTIONS.filter(
      cat => this.state.model.category === cat.value
    );
    return (
      <div className="postOfferPage">
        <PageBanner title="Post Offer" expanded />
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestCreateOffer(e)}
        >
          <div className="row mb-xl">
            <div className="column large-8 large-offset-2">
              <div className="row align-middle mb-lg">
                <div className="column shrink">
                  <h1 className="postOfferPage__label">Basic Informations</h1>
                </div>
              </div>
              <div className="postOfferPage__fieldGroup row mb-lg np">
                <div className="column npl">
                  <div className="pt-lg pb-lg pr-xl pl-xl">
                    <h1 className="postOfferPage__label fs-mx mb-md">
                      Job name
                    </h1>
                    <Field
                      className="accent"
                      name="job_name"
                      id="job_name"
                      placeholder="Type job name here ..."
                    />
                    <ValidationMessage for="job_name" />
                  </div>
                </div>
                <div className="column npr">
                  <div className="pt-lg pb-lg pr-xl pl-xl">
                    <h1 className="postOfferPage__label fs-mx mb-md">
                      Category
                    </h1>
                    <Typeahead
                      className="large"
                      value={this.state.model.category}
                      clearable={false}
                      options={FILTER_OPTIONS.CATEGORY_OPTIONS}
                      placeholder="Select options"
                      sortAlphabetically={false}
                      onChange={e => {
                        this.setState(state => ({
                          model: {
                            ...state.model,
                            category: e.value,
                          },
                        }));
                      }}
                    />
                    <Field
                      className="postOfferPage__hiddenInput accent"
                      name="category"
                      id="category"
                    />
                    <ValidationMessage for="category" />
                    {currentCategory && (
                      <Fragment>
                        <h1 className="postOfferPage__label fs-mx mb-md mt-md">
                          Sub Category
                        </h1>
                        <Typeahead
                          className="large"
                          value={this.state.model.sub_category}
                          clearable={false}
                          options={
                            currentCategory ? currentCategory.sub_cat : []
                          }
                          placeholder="Select options"
                          sortAlphabetically={false}
                          onChange={e => {
                            this.setState(state => ({
                              model: {
                                ...state.model,
                                sub_category: e.value,
                              },
                            }));
                          }}
                        />
                        <Field
                          className="postOfferPage__hiddenInput accent"
                          name="sub_category"
                          id="sub_category"
                        />
                        <ValidationMessage for="sub_category" />
                      </Fragment>
                    )}
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="column npl">
                  <div className="postOfferPage__fieldGroup h100">
                    <h1 className="postOfferPage__label fs-mx mb-md">
                      Price (USD)
                    </h1>
                    <Field
                      className="accent"
                      name="price"
                      id="price"
                      placeholder="$1.00 - $20.00"
                    />
                    <ValidationMessage for="price" />
                  </div>
                </div>
                <div className="column npr">
                  <div className="postOfferPage__fieldGroup">
                    <h1 className="postOfferPage__label fs-mx mb-md">
                      Time of delivery
                    </h1>
                    <Field
                      className="accent"
                      name="time_of_delivery"
                      id="time_of_delivery"
                      placeholder="Type your time of delivery here ..."
                    />
                    <ValidationMessage for="time_of_delivery" />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-xl">
            <div className="column large-8 large-offset-2 np">
              <div className="row align-middle mb-lg">
                <div className="column shrink">
                  <h1 className="postOfferPage__label ml-mn">Description</h1>
                </div>
              </div>
              <Editor
                editorClassName="accent postOfferPage__description"
                editorState={this.state.editorState}
                onEditorStateChange={this.onEditorStateChange}
              />
              <ValidationMessage for="description" />
            </div>
          </div>
          <div className="row mb-xl">
            <div className="column large-8 large-offset-2 np">
              <div className="row align-middle mb-lg">
                <div className="column shrink">
                  <h1 className="postOfferPage__label ml-mn">Gallery</h1>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <div className="postOfferPage__uploader">
                    <div className="postOfferPage__uploaderToolbar row align-middle nm">
                      <div className="column shrink">
                        {isUploading ? (
                          <Link className="postOfferPage__btnUpload">
                            Loading ...
                          </Link>
                        ) : (
                          <Link
                            className="postOfferPage__btnUpload"
                            onClick={this.triggerFileDialog}
                          >
                            + Upload Images
                          </Link>
                        )}
                      </div>
                      {/* <div className="column shrink text-right npr">
                        <Link className="postOfferPage__uploaderToolbarButton">
                          Set as featured image
                        </Link>
                        <Link className="postOfferPage__uploaderToolbarButton">
                          Select
                        </Link>
                        <Link className="postOfferPage__uploaderToolbarButton">
                          Select All
                        </Link>
                        <Link className="postOfferPage__uploaderToolbarButton">
                          Remove
                        </Link>
                      </div> */}
                    </div>
                    <Dropzone
                      className="postOfferPage__dropzone"
                      ref={node => {
                        this.dropzoneRef = node;
                      }}
                      accept="image/*"
                      onDrop={this.onDrop}
                    >
                      <div className="text-center">
                        <p className="postOfferPage__labelDesc mb-sm">
                          Drag your image here
                        </p>
                        <p
                          className="postOfferPage__labelDesc"
                          ref={node => {
                            this.refDiv = node;
                          }}
                        >
                          and Select one picture for your featured image
                        </p>
                      </div>
                    </Dropzone>
                  </div>
                  <ValidationMessage for="gallery" />
                  <div className="postOfferPage__uploadedPhotos row">
                    {this.state.model.gallery.map(photo => (
                      <div className="column small-6 large-3" key={generate()}>
                        <img src={photo} alt={photo} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-xl">
            <div className="column large-8 large-offset-2 np">
              <div className="row align-middle mb-lg">
                <div className="column shrink">
                  <h1 className="postOfferPage__label ml-mn">
                    Opening message
                  </h1>
                </div>
                <div className="column text-right">
                  <h4 className="postOfferPage__labelDesc">
                    Opening message will displayed as your first message in the
                    order detail page.
                  </h4>
                </div>
              </div>
              <TextAreaField
                name="opening_message"
                id="opening_message"
                rows={10}
                placeholder="Type message here ..."
              />
              <ValidationMessage for="opening_message" />
            </div>
          </div>
          <div className="row mb-xl">
            <div className="column large-8 large-offset-2 np">
              <div className="row align-middle mb-lg">
                <div className="column shrink">
                  <h1 className="postOfferPage__label ml-mn">Tags</h1>
                </div>
              </div>
              <TagList
                value={transformOptions(this.state.model.tags)}
                typeaheadOptions={[]}
                inputPlaceholder="Enter tags"
                className="mb-mx"
                onChange={value => this.onChangeTaglist('tags', value)}
                creatable
              />
              <ValidationMessage for="tags" />
            </div>
          </div>
          <div className="row">
            <div className="column text-center c-danger mb-md">
              {this.props.error}
            </div>
          </div>
          <div className="row align-center">
            <div className="column shrink">
              <Button
                className="button bg-gradient nb"
                type="submit"
                element={Form.Button}
                isLoading={this.props.isLoading}
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['offer', 'isLoading']),
  error: state.getIn(['offer', 'error']),
  uploadedPhotos: state.getIn(['offer', 'uploadedPhotos']),
  isUploading: state.getIn(['offer', 'isUploading']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateOffer: payload => dispatch(requestCreateOffer(payload)),
  uploadPhoto: payload => dispatch(requestOfferPhotoUpload(payload)),
});

export default compose(
  injectSagas({ key: 'offer', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PostOfferPage);
