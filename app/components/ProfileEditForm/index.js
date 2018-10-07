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
  firstName: yup
    .string()
    .test('firstNameTest', validStringOnlyMessage, val =>
      isValidStringOnly(val)
    ),
  lastName: yup
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
  error: string,
  saveUserData: Function,
  uploadPhoto: Function,
  uploadedPhoto: string, // eslint-disable-line react/no-unused-prop-types
};

type State = {
  model: Object,
};

class ProfileEditForm extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.uploadedPhoto) {
      return {
        model: {
          ...prevState.model,
          picture: nextProps.uploadedPhoto,
        },
      };
    }
    return null;
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      model: {
        firstName: props.user.get('firstName'),
        lastName: props.user.get('lastName'),
        username: props.user.get('username'),
        picture: props.user.get('picture'),
        email: props.user.get('email'),
        bio: props.user.get('bio'),
        address: props.user.get('address'),
      },
    };
  }

  render() {
    const { isLoading, error } = this.props;
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
          <div className="small-12 large-shrink column mr-md text-center">
            <FileUpload
              picture={this.state.model.picture}
              uploadFunction={this.props.uploadPhoto}
            />
          </div>
        </div>
        <div className="row column mb-xl">
          <div className="row align-center mb-xl">
            <div className="small-12 medium-6 column">
              <label
                className="profileEditForm__inputLabel"
                htmlFor="firstName"
              >
                First Name
              </label>
              <Field
                className="accent"
                name="firstName"
                id="firstName"
                type="text"
              />
              <ValidationMessage for="firstName" />
            </div>
            <div className="small-12 medium-6 column">
              <label className="profileEditForm__inputLabel" htmlFor="lastName">
                Last Name
              </label>
              <Field
                className="accent"
                name="lastName"
                id="lastName"
                type="text"
              />
              <ValidationMessage for="lastName" />
            </div>
          </div>
          <div className="row align-center mb-xl">
            <div className="small-12 medium-6 column">
              <label className="profileEditForm__inputLabel" htmlFor="username">
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
            <div className="small-12 medium-6 column">
              <label className="profileEditForm__inputLabel" htmlFor="email">
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

          <div className="row align-center mb-xl">
            <div className="small-12 column mb-sm">
              <label className="profileEditForm__inputLabel" htmlFor="address">
                Street Address
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
            <div className="small-12 column">
              <label className="profileEditForm__inputLabel" htmlFor="bio">
                Bio
              </label>
              <Field
                className="accent profileEditForm__bioInput"
                name="bio"
                id="bio"
                type="textarea"
                rows="5"
              />
              <ValidationMessage for="bio" />
            </div>
          </div>
          <div className="text-center c-danger mb-md">{error}</div>
          <div className="mb-md">
            <Button
              className="button secondary spacious expanded"
              type="submit"
              element={Form.Button}
              isLoading={isLoading}
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default ProfileEditForm;
