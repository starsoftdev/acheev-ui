// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import type { Map } from 'immutable';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { isEmpty } from 'lodash-es';

import Link from 'components/Link';
import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import FileUpload from 'components/FileUpload';
import Editor from 'components/Editor';
import HoursOfOperation from 'components/HoursOfOperation';
import Preloader from 'components/Preloader';

import DEFAULT_HOURS_OF_OPERATION from 'enum/HoursOfOperation';

import {
  requestBusinesses,
  uploadLogo,
  updateProducerProfile,
} from 'pages/LP/sagas';

import './styles.scss';

type Props = {
  business: Map<*, *>,
  user: Object,
  requestBusinesses: Function,
  businessIsLoading: boolean,
  profileIsLoading: boolean,
  error: string,
  uploadLogo: Function,
  updateProducerProfile: Function,
};

type State = {
  model: Object,
  editorState: ?Object,
};

const schema = yup.object({
  thumbnail: yup.string(),
  twitter: yup.string(),
  facebook: yup.string(),
  linkedin: yup.string(),
  google: yup.string(),
  pinterest: yup.string(),
  youtube: yup.string(),
  instagram: yup.string(),
  description: yup.string(),
  hoursOfOperation: yup.array(),
  __t: yup.string(),
});

const socials = [
  {
    label: 'twitter',
    value: 'twitter',
  },
  {
    label: 'facebook',
    value: 'facebook',
  },
  {
    label: 'linkedin',
    value: 'linkedin',
  },
  {
    label: 'googleplus',
    value: 'google',
  },
  {
    label: 'pinterest',
    value: 'pinterest',
  },
  {
    label: 'youtube',
    value: 'youtube',
  },
  {
    label: 'instagram',
    value: 'instagram',
  },
];

class LpProfilePage extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {},
      editorState: null,
    };
  }
  componentDidMount() {
    const { user, business } = this.props;
    if (business) {
      this.initializeModel(this.props);
    } else {
      this.props.requestBusinesses(user.get('id'));
    }
  }
  componentWillReceiveProps(newProps: Object) {
    const { business, thumbnail } = newProps;
    if (!this.props.business && business) {
      this.initializeModel(newProps);
    }
    if (thumbnail && thumbnail !== this.state.model.thumbnail) {
      this.setState({
        model: {
          ...this.state.model,
          thumbnail,
        },
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
  onHoursChange: Function = hoursOfOperation => {
    this.setState({
      model: {
        ...this.state.model,
        hoursOfOperation,
      },
    });
  };
  initializeModel = ({ business }: Object) => {
    const description = business.get('description') || '';
    const contentBlock = htmlToDraft(description);
    const contentState = ContentState.createFromBlockArray(
      contentBlock.contentBlocks
    );
    const editorState = EditorState.createWithContent(contentState);
    const hoursOfOperation = business.get('hoursOfOperation').toJS();
    this.setState({
      model: {
        thumbnail: business.get('thumbnail') || '',
        twitter: business.get('twitter'),
        facebook: business.get('facebook'),
        linkedin: business.get('linkedin'),
        google: business.get('google'),
        pinterest: business.get('pinterest'),
        youtube: business.get('youtube'),
        instagram: business.get('instagram'),
        hoursOfOperation: !isEmpty(hoursOfOperation)
          ? hoursOfOperation
          : DEFAULT_HOURS_OF_OPERATION,
        __t: business.get('__t'),
        description,
      },
      editorState,
    });
  };
  render() {
    const { business, businessIsLoading, error, profileIsLoading } = this.props;
    if (businessIsLoading) return <Preloader />;
    return business ? (
      <div className="lpProfilePage row column mt-lg">
        <div className="mb-xl text-center">
          <div
            className="lpProfilePage__photo"
            style={{
              backgroundImage: `url(${this.state.model.thumbnail})`,
            }}
          />
          <h5 className="c-secondary">Producer profile</h5>
          <h2 className="c-primary">{business.get('name')}</h2>
        </div>
        <Form
          className="profileEditForm"
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => {
            this.props.updateProducerProfile(business.get('_id'), e);
          }}
        >
          <div className="row">
            <div className="small-12 large-shrink column mr-md text-center">
              <FileUpload
                picture={this.state.model.thumbnail}
                uploadFunction={this.props.uploadLogo}
                buttonText="Upload new logo"
                fieldName="thumbnail"
              />
            </div>
            <div className="column">
              <div className="row column mb-xl">
                <div className="row mb-xl">
                  {socials.map(i => (
                    <div className="small-12 medium-6 column" key={i.value}>
                      <label
                        className="profileEditForm__inputLabel"
                        htmlFor={i.value}
                      >
                        {i.label}
                      </label>
                      <Field
                        className="accent"
                        name={i.value}
                        id={i.value}
                        type="text"
                      />
                      <ValidationMessage for={i.value} />
                    </div>
                  ))}
                </div>

                <label
                  htmlFor="hoursOfOperation"
                  className="profileEditForm__inputLabel"
                >
                  Hours of operations
                </label>
                <HoursOfOperation
                  id="hoursOfOperation"
                  data={this.state.model.hoursOfOperation}
                  onChange={this.onHoursChange}
                />

                <div className="mb-xl">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="description"
                  >
                    Description
                  </label>
                  <Editor
                    editorState={this.state.editorState}
                    onEditorStateChange={this.onEditorStateChange}
                  />
                  <ValidationMessage for="description" />
                </div>
                <div className="fs-mn mb-xxl">
                  Personal details will only be visible to you while you&apos;re
                  logged in. Visit our&nbsp;
                  <Link to="/privacy" target="_blank">
                    privacy policy
                  </Link>
                  &nbsp;for more information.
                </div>
                <div className="text-center c-danger mb-md">{error}</div>
                <div className="mb-md">
                  <Button
                    className="button secondary spacious expanded"
                    type="submit"
                    element={Form.Button}
                    isLoading={profileIsLoading}
                  >
                    Submit
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Form>
      </div>
    ) : null;
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
  business: state.getIn(['lp', 'businesses', 'data', 0]),
  businessIsLoading: state.getIn(['lp', 'businesses', 'isLoading']),
  thumbnail: state.getIn(['lp', 'logo', 'path']),
  profileIsLoading: state.getIn(['lp', 'producerProfile', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinesses: id => dispatch(requestBusinesses(id)),
  uploadLogo: payload => dispatch(uploadLogo(payload)),
  updateProducerProfile: (id, data) =>
    dispatch(updateProducerProfile(id, data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LpProfilePage);
