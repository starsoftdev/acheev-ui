// @flow
import React, { Component } from 'react';

import Form, { Field } from 'react-formal';
import yup from 'yup';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import FileUpload from 'components/FileUpload';

import { USERNAME_SCHEMA } from 'enum/constants';
import isValidStringOnly from 'utils/isValidStringOnly';

import './styles.scss';

const validStringOnlyMessage =
  'Please do not use numbers or special characters ($, %, #, etc)';
const schema = yup.object({
  first_name: yup
    .string()
    .test('firstNameTest', validStringOnlyMessage, val =>
      isValidStringOnly(val)
    ),
  last_name: yup
    .string()
    .test('lastNameTest', validStringOnlyMessage, val =>
      isValidStringOnly(val)
    ),
  username: USERNAME_SCHEMA,
  email: yup.string(),
  address: yup.string(),
  bio: yup.string(),
  picture: yup.string(),
});

type Props = {
  user: Object,
  isLoading: boolean,
  isUploading: boolean,
  error: string,
  saveUserData: Function,
  uploadPhoto: Function,
};

type State = {
  model: Object,
};

class ProfileEditForm extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.user.get('image')) {
      return {
        model: {
          ...prevState.model,
          picture: nextProps.user.getIn(['image', 'src']),
        },
      };
    }
    return null;
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        first_name: props.user.get('first_name'),
        last_name: props.user.get('last_name'),
        username: props.user.get('username'),
        picture: props.user.get('image')
          ? props.user.getIn(['image', 'src'])
          : '',
        email: props.user.get('email'),
        bio: props.user.get('bio'),
        address: props.user.get('address'),
      },
    };
  }

  render() {
    const { isLoading, error, isUploading } = this.props;
    return (
      <Form
        className="profileEditForm"
        schema={schema}
        value={this.state.model}
        onChange={model => this.setState({ model })}
        onSubmit={e => {
          const postData = e;
          if (postData.email) {
            delete postData.email;
          }
          this.props.saveUserData(postData);
        }}
      >
        <div className="row">
          <div className="column large-8 large-offset-2">
            <div className="row mb-xl">
              <div className="column">
                <FileUpload
                  picture={this.state.model.picture}
                  uploadFunction={this.props.uploadPhoto}
                  isUploading={isUploading}
                />
              </div>
            </div>
            <div className="row column mb-lg">
              <div className="row align-center mb-xl">
                <div className="small-12 medium-6 column npl">
                  <div className="profileEditForm__fieldGroup">
                    <label
                      className="profileEditForm__inputLabel"
                      htmlFor="first_name"
                    >
                      First Name
                    </label>
                    <Field
                      className="accent"
                      name="first_name"
                      id="first_name"
                      type="text"
                    />
                    <ValidationMessage for="first_name" />
                  </div>
                </div>
                <div className="small-12 medium-6 column npr">
                  <div className="profileEditForm__fieldGroup">
                    <label
                      className="profileEditForm__inputLabel"
                      htmlFor="last_name"
                    >
                      Last Name
                    </label>
                    <Field
                      className="accent"
                      name="last_name"
                      id="last_name"
                      type="text"
                    />
                    <ValidationMessage for="last_name" />
                  </div>
                </div>
              </div>
              <div className="row align-center mb-lg">
                <div className="small-12 medium-6 column npl">
                  <div className="profileEditForm__fieldGroup">
                    <label
                      className="profileEditForm__inputLabel"
                      htmlFor="username"
                    >
                      Username
                    </label>
                    <Field
                      className="accent"
                      name="username"
                      id="username"
                      type="text"
                    />
                    <ValidationMessage for="username" />
                  </div>
                </div>
                <div className="small-12 medium-6 column npr">
                  <div className="profileEditForm__fieldGroup">
                    <label
                      className="profileEditForm__inputLabel"
                      htmlFor="email"
                    >
                      E-mail
                    </label>
                    <Field
                      className="accent"
                      name="email"
                      id="email"
                      type="text"
                      disabled
                    />
                    <ValidationMessage for="email" />
                  </div>
                </div>
              </div>
              <div className="profileEditForm__fieldGroup row align-center mb-lg">
                <div className="small-12 column np">
                  <label className="profileEditForm__inputLabel" htmlFor="bio">
                    Short Bio
                  </label>
                  <Field
                    className="accent profileEditForm__bioInput"
                    name="bio"
                    id="bio"
                    type="textarea"
                    rows="5"
                    placeholder="Type your bio here ..."
                  />
                  <ValidationMessage for="bio" />
                </div>
              </div>
              <div className="profileEditForm__fieldGroup row align-center mb-lg">
                <div className="small-12 column mb-sm np">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="address"
                  >
                    Location
                  </label>
                  <Field
                    className="accent"
                    name="address"
                    id="address"
                    type="text"
                    placeholder="Street and number, P.O. box, apartment, unit, building, etc"
                  />
                  <ValidationMessage for="address" />
                </div>
              </div>
              <div className="text-center c-danger mb-md">{error}</div>
              <div className="row">
                <div className="column npl">
                  <Button
                    className="button"
                    type="submit"
                    element={Form.Button}
                    isLoading={isLoading}
                  >
                    Save Changes
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default ProfileEditForm;
