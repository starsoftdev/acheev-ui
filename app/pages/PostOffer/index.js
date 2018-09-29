// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { List } from 'immutable';
import { convertToRaw } from 'draft-js';
import draftToHtml from 'draftjs-to-html';

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
import Link from 'components/Link';
import ValidationMessage from 'components/ValidationMessage';

import FILTER_OPTIONS from 'enum/filter/options';

import './styles.scss';

const schema = yup.object({
  job_name: yup.string().required(),
  category: yup.string().required(),
  price: yup
    .number()
    .required()
    .min(1)
    .max(20),
  description: yup.string().required(),
  time_of_delivery: yup.number().required(),
  opening_message: yup.string().required(),
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
    price: number,
    time_of_delivery: number,
    description: string,
    opening_message: string,
  },
  editorState: ?Object,
  uploadedFiles: Array<Object>,
};

class PostOfferPage extends Component<Props, State> {
  state = {
    model: {
      job_name: '',
      category: '',
      description: '',
      opening_message: '',
    },
    editorState: null,
    uploadedFiles: [],
  };
  componentDidUpdate(prevProps: Props) {
    const { isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      this.setState({
        model: {
          job_name: '',
          category: '',
          description: '',
          opening_message: '',
        },
        editorState: null,
        uploadedFiles: [],
      });
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
  onDrop = (accepted: Array<Object>) => {
    // eslint-disable-next-line
    console.log('*********', accepted);
    // const uploadedFiles = this.state.uploadedFiles;
    // const photosCount = uploadedFiles.length;
    // const newState = cloneDeep(this.state);
    // newState.uploadedFiles = uploadedFiles.concat(accepted);
    const photosCount = 0;
    for (let index = 0; index < accepted.length; index += 1) {
      //const gIndex = index + photosCount;
      var reader = new FileReader();

      // Closure to capture the file information.
      reader.onload = e => {
        console.log(e);
        this.props.uploadPhoto(0, e.target.result);
      };

      // Read in the image file as a data URL.
      reader.readAsBinaryString(accepted[index]);

      //newState.uploadedFiles[gIndex].progress = 0;
    }
    //this.setState(newState);
  };
  triggerFileDialog = () => {
    this.refDiv.click();
  };
  dropzoneRef: ?Object;
  refDiv: HTMLElement;
  render() {
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
                  <div className="postOfferPage__fieldGroup nb">
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
                  <div className="postOfferPage__fieldGroup nb">
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
                      <div className="column">
                        <Link
                          className="postOfferPage__btnUpload"
                          onClick={this.triggerFileDialog}
                        >
                          + Upload Images
                        </Link>
                      </div>
                      <div className="column shrink text-right npr">
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
                      </div>
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
              />
              <ValidationMessage for="opening_message" />
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
  uploadPhoto: (index, payload) =>
    dispatch(requestOfferPhotoUpload(index, payload)),
});

export default compose(
  injectSagas({ key: 'offer', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PostOfferPage);
