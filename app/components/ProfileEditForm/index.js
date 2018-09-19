// @flow
import React, { Component } from 'react';

import Form, { Field } from 'react-formal';
import yup from 'yup';
import moment from 'moment';
import { cloneDeep } from 'lodash-es';
import Link from 'components/Link';

import { history } from 'components/ConnectedRouter';
import Button from 'components/Button';
import CustomSelect from 'components/CustomSelect';
import Typeahead from 'components/Typeahead';
import ValidationMessage from 'components/ValidationMessage';
import UserRoleBadge from 'components/UserRoleBadge';
import Checkbox from 'components/Checkbox';
import QuestionBadge from 'components/Forum/Question/Badge';
import DatePicker from 'components/DatePicker';
import BorderedTitle from 'components/BorderedTitle';
import TagList from 'components/TagList';
import FileUpload from 'components/FileUpload';

import transformOptions from 'utils/transformOptions';

import FORM_OPTIONS from 'enum/form/options';
import FILTER_OPTIONS from 'enum/filter/options';
import { USERNAME_SCHEMA } from 'enum/constants';

import ALLOWED_RANGE_AGES from 'enum/allowed_range_ages';

import isValidPostalCode from 'utils/isValidPostalCode';
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
  birthday: yup.date('You must enter a valid date.').nullable(),
  yearOfBirth: yup.number(),
  address: yup.string(),
  city: yup
    .string()
    .test('cityTest', validStringOnlyMessage, val => isValidStringOnly(val)),
  province: yup.string(),
  postalCode: yup.mixed().test('match', code => isValidPostalCode(code)),
  bio: yup.string(),
  gender: yup.string().oneOf(['male', 'female', 'other']),
  picture: yup.string(),
  profileCompletedGift: yup.string(),
  cannabisExperience: yup.string(),
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
  isAnonymous: boolean,
  isProfileCompleted: ?string,
};

const setProfileHeader = (user: Object) => {
  if (!user) {
    return null;
  }
  const profileCompletion = user.get('profileCompletion');
  const profileCompletionCallout =
    'Complete your profile below to earn 100 Lift Points!';

  return profileCompletion === 1 ? profileCompletionCallout : '';
};

class ProfileEditForm extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const isProfileCompleted = setProfileHeader(nextProps.user);
    if (nextProps.uploadedPhoto) {
      return {
        model: {
          ...prevState.model,
          picture: nextProps.uploadedPhoto,
        },
        isProfileCompleted,
      };
    }
    return {
      isProfileCompleted,
    };
  }
  constructor(props: Props) {
    super(props);
    const birthday = props.user.get('birthday')
      ? moment(props.user.get('birthday')).toDate()
      : null;
    const yearOfBirth = props.user.get('yearOfBirth');
    this.state = {
      model: {
        firstName: props.user.get('firstName'),
        lastName: props.user.get('lastName'),
        username: props.user.get('username'),
        picture: props.user.get('picture'),
        email: props.user.get('email'),
        birthday,
        yearOfBirth,
        bio: props.user.get('bio'),
        gender: props.user.get('gender'),
        knownConditions:
          props.user && props.user.get('knownConditions')
            ? transformOptions(props.user.get('knownConditions').toJS())
            : [],
        address: props.user.get('address'),
        cannabisExperience: props.user.get('cannabisExperience'),
        city: props.user.get('city'),
        province: props.user.get('province'),
        postalCode: props.user.get('postalCode') || '',
      },
      isAnonymous: props.user.get('isAnonymous'),
      isProfileCompleted: '',
    };
  }
  componentDidMount() {
    if (this.props.user && !this.props.user.get('profileCompletion')) {
      history.push('/completeprofile');
    }
  }
  componentDidUpdate() {
    if (!this.props.user) {
      return;
    }
    if (!this.props.user.get('profileCompletion')) {
      history.push('/completeprofile');
    }
  }
  onChangeTaglist = (path: string, value?: Boolean) => {
    const model = cloneDeep(this.state.model);
    model[path] = value;
    this.setState({ model });
  };

  handleCannabisExperienceChange = (e: { label: string, value: string }) => {
    this.setState(state => ({
      model: {
        ...state.model,
        cannabisExperience: e && e.value,
      },
    }));
  };

  render() {
    const { user, isLoading, error } = this.props;
    const { isProfileCompleted } = this.state;
    const questionBadgeContent =
      'Your name may be shared with registered producers and doctors only after you directly contact them.';

    let userRole = '';
    if (user && user.get('role') && user.get('role') !== 'user') {
      userRole = user.get('role');
    }

    const maxYear = moment()
      .subtract(ALLOWED_RANGE_AGES.MIN_USER_AGE, 'years')
      .year();
    return (
      <Form
        className="profileEditForm"
        schema={schema}
        value={this.state.model}
        onChange={model => this.setState({ model })}
        onSubmit={e => {
          const postData = e;
          postData.isAnonymous = this.state.isAnonymous;
          if (postData.email) {
            delete postData.email;
          }
          this.props.saveUserData(postData);
        }}
      >
        <div className="row">
          {isProfileCompleted && (
            <div className="small-12 column">
              <BorderedTitle centered>{isProfileCompleted}</BorderedTitle>
            </div>
          )}
          <div className="small-12 large-shrink column mr-md text-center">
            <FileUpload
              picture={this.state.model.picture}
              uploadFunction={this.props.uploadPhoto}
            />
          </div>
          <div className="column">
            {userRole && (
              <div className="row mb-md">
                <div className="shrink column">
                  <UserRoleBadge role={userRole} />
                </div>
              </div>
            )}
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
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="lastName"
                  >
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
                <div className="small-12 medium-6 column">
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

              <div className="row align-center mb-xl">
                <div className="medium-6 small-12 column mb-sm">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="birthday"
                  >
                    Birthday
                  </label>
                  <DatePicker
                    value={this.state.model.birthday}
                    yearCounts={100}
                    maxYear={maxYear}
                    initialYear={this.state.model.yearOfBirth}
                    onChange={value =>
                      this.setState(state => ({
                        model: {
                          ...state.model,
                          birthday: value,
                        },
                      }))
                    }
                    onChangeYear={value =>
                      this.setState(state => ({
                        model: {
                          ...state.model,
                          yearOfBirth: value,
                        },
                      }))
                    }
                  />
                  <ValidationMessage for="birthday" />
                </div>

                <div className="medium-6 small-12 column mb-sm">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="gender"
                  >
                    Gender
                  </label>
                  <CustomSelect
                    className="large"
                    value={this.state.model.gender}
                    clearable={false}
                    options={FORM_OPTIONS.GENDER_OPTIONS}
                    placeholder="Select Gender"
                    onChange={e => {
                      this.setState(state => ({
                        model: {
                          ...state.model,
                          gender: e.value,
                        },
                      }));
                    }}
                  />
                  <Field
                    className="profileEditForm__hiddenInput accent"
                    name="gender"
                    id="gender"
                  />
                  <ValidationMessage for="gender" />
                </div>
                <div className="small-12 column mb-sm">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="address"
                  >
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
                <div className="medium-6 small-12 column mb-sm">
                  <label className="profileEditForm__inputLabel" htmlFor="city">
                    City
                  </label>
                  <Field className="accent" name="city" id="city" type="text" />
                  <ValidationMessage for="city" />
                </div>
                <div className="medium-6 small-12 column mb-sm">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="cannabisExperience"
                  >
                    Experience with Cannabis
                  </label>
                  <CustomSelect
                    clearable
                    className="large"
                    value={this.state.model.cannabisExperience}
                    options={FORM_OPTIONS.EXPERIENCE_WITH_CANNABIS}
                    sortAlphabetically={false}
                    placeholder="Select Cannabis Experience"
                    onChange={this.handleCannabisExperienceChange}
                  />
                  <Field
                    className="profileEditForm__hiddenInput accent"
                    name="cannabisExperience"
                    id="cannabisExperience"
                  />
                  <ValidationMessage for="cannabisExperience" />
                </div>
                <div className="medium-6 small-12 column mb-sm">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="province"
                  >
                    Province
                  </label>
                  <Typeahead
                    className="large"
                    value={this.state.model.province}
                    clearable={false}
                    options={FILTER_OPTIONS.FILTER_PROVINCE_OPTIONS}
                    placeholder="Select Province"
                    sortAlphabetically={false}
                    onChange={e => {
                      this.setState(state => ({
                        model: {
                          ...state.model,
                          province: e.value,
                        },
                      }));
                    }}
                  />
                  <Field
                    className="profileEditForm__hiddenInput accent"
                    name="province"
                    id="province"
                  />
                  <ValidationMessage for="province" />
                </div>
                <div className="medium-6 small-12 column mb-sm">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="postalCode"
                  >
                    Postal Code
                  </label>
                  <Field
                    className="accent"
                    name="postalCode"
                    id="postalCode"
                    type="text"
                  />
                  <ValidationMessage for="postalCode" />
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

              <div className="row align-bottom mb-mn">
                <div className="column">
                  <label
                    className="profileEditForm__inputLabel"
                    htmlFor="condition"
                  >
                    Conditions You Suffer From (Leave blank if not applicable)
                  </label>

                  <div className="row column align-middle">
                    <TagList
                      value={this.state.model.knownConditions}
                      typeaheadOptions={FORM_OPTIONS.PRESCRIBED_FOR_OPTIONS}
                      inputPlaceholder="Type a condition here"
                      className="mb-mx"
                      onChange={value =>
                        this.onChangeTaglist('knownConditions', value)
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="row align-middle fs-mn mb-sm">
                <div className="shrink column">
                  <Checkbox
                    checked={this.state.isAnonymous}
                    onChange={e =>
                      this.setState({
                        isAnonymous: e.target.checked,
                      })
                    }
                  >
                    Hide my name & location from others
                  </Checkbox>
                </div>
                <div className="column npl">
                  <QuestionBadge content={questionBadgeContent} />
                </div>
              </div>
              <div className="row column fs-mn mb-xxl">
                Personal details will only be visible to you while you&apos;re
                logged in. Visit our&nbsp;
                <Link to="/privacy" target="_blank">
                  privacy policy
                </Link>
                &nbsp;for more information.
              </div>
              <div className="mb-md">
                <ValidationMessage for="picture" />
                <ValidationMessage for="firstName" />
                <ValidationMessage for="lastName" />
                <ValidationMessage for="username" />
                <ValidationMessage for="email" />
                <ValidationMessage for="birthday" />
                <ValidationMessage for="gender" />
                <ValidationMessage for="address" />
                <ValidationMessage for="city" />
                <ValidationMessage for="province" />
                <ValidationMessage for="postalCode" />
                <ValidationMessage for="bio" />
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
          </div>
        </div>
      </Form>
    );
  }
}

export default ProfileEditForm;
