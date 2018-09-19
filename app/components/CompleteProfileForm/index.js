// @flow

import React, { Component } from 'react';

import Form, { Field } from 'react-formal';
import yup from 'yup';
import cx from 'classnames';
import moment from 'moment';

import Link from 'components/Link';
import Button from 'components/Button';
import CustomSelect from 'components/CustomSelect';
import Typeahead from 'components/Typeahead';
import ValidationMessage from 'components/ValidationMessage';
import DatePicker from 'components/DatePicker';
import Icon from 'components/Icon';
import Logo from 'images/sprite/logo.svg';

import FORM_OPTIONS from 'enum/form/options';
import FILTER_OPTIONS from 'enum/filter/options';
import { PROFILE_COMPLETION_TEMP } from 'enum/constants';

import ALLOWED_RANGE_AGES from 'enum/allowed_range_ages';

import { schema1, schema2 } from './schema';
import './styles.scss';

type Props = {
  user: Object,
  isLoading: boolean,
  error: string,
  saveUserData: Function,
  replace: Function,
  step?: number,
};

type State = {
  schema: yup,
  model: {
    firstName: string,
    lastName: string,
    yearOfBirth: number,
    address: string,
    province: string,
    postalCode: string,
    gender: string,
    cannabisExperience: string,
  },
  isAnonymous: boolean,
  isSubmitted: boolean,
  wasLoading: boolean,
  shouldRequestUser: boolean,
  shouldRedirect: boolean,
  redirectTo: string,
};

type StorageModel = {
  firstName?: string,
  lastName?: string,
  address?: string,
  province?: string,
};

class CompleteProfileForm extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const { error, isLoading } = nextProps;
    const { shouldRequestUser, wasLoading, isSubmitted } = prevState;
    const isLoaded = !error && wasLoading && !isLoading;
    const userUpdated = isSubmitted && !shouldRequestUser && isLoaded;
    const userLoaded = isSubmitted && shouldRequestUser && isLoaded;
    if (userUpdated) {
      return {
        wasLoading: isLoading,
        shouldRequestUser: true,
      };
    } else if (userLoaded) {
      return {
        wasLoading: isLoading,
        shouldRedirect: true,
      };
    }

    return {
      wasLoading: isLoading,
    };
  }
  constructor(props: Props) {
    super(props);

    const savedUserJSON = localStorage.getItem(PROFILE_COMPLETION_TEMP);
    const savedUserData: StorageModel = savedUserJSON
      ? JSON.parse(savedUserJSON)
      : {};

    this.state = {
      model: {
        firstName: savedUserData.firstName || props.user.get('firstName'),
        lastName: savedUserData.lastName || props.user.get('lastName'),
        yearOfBirth: props.user.get('yearOfBirth'),
        gender: props.user.get('gender'),
        address: savedUserData.address || props.user.get('address'),
        cannabisExperience: props.user.get('cannabisExperience'),
        city: props.user.get('city'),
        province: savedUserData.province || props.user.get('province'),
        postalCode: props.user.get('postalCode') || '',
      },
      redirectTo: '/me',
      isAnonymous: props.user.get('isAnonymous'),
      isSubmitted: false,
      shouldRequestUser: false,
      shouldRedirect: false,
      schema: props.step === 2 ? schema2 : schema1,
      wasLoading: props.isLoading, // eslint-disable-line react/no-unused-state
    };
    this.formRef = null;
  }
  componentDidUpdate(prevProps: Props) {
    const { error, isLoading, user } = this.props;

    if (!user) {
      return;
    }
    const {
      redirectTo,
      isSubmitted,
      shouldRequestUser,
      shouldRedirect,
    } = this.state;
    const isLoaded = !error && prevProps.isLoading && !isLoading;
    const userLoaded =
      isSubmitted && shouldRequestUser && shouldRedirect && isLoaded;

    if (userLoaded) {
      if (redirectTo === '/me') {
        localStorage.removeItem(PROFILE_COMPLETION_TEMP);
      }
      this.props.replace(redirectTo);
    }
  }
  formRef: ?Object;
  handleSubmitClick = (type: string) => {
    let redirectTo;
    if (type === 'earn') {
      redirectTo = '/completeprofile2';
    } else {
      redirectTo = '/me';
    }
    this.setState({ redirectTo });

    if (this.formRef) this.formRef.submit();
  };

  handleFormSubmit = (model: Object) => {
    const postData = model;
    postData.isAnonymous = this.state.isAnonymous;
    this.props.saveUserData(postData);
    this.setState({
      isSubmitted: true,
    });
  };

  handleCannabisExperienceChange = (e: { label: string, value: string }) => {
    this.setState({
      model: {
        ...this.state.model,
        cannabisExperience: e.value,
      },
    });
  };

  saveTempUserData = () => {
    const { firstName, lastName, province, address } = this.state.model;
    const data: StorageModel = {
      firstName,
      lastName,
      province,
      address,
    };
    localStorage.setItem(PROFILE_COMPLETION_TEMP, JSON.stringify(data));
  };

  render() {
    const { isLoading, error, step = 1 } = this.props;
    const { schema } = this.state;
    const maxYear = moment()
      .subtract(ALLOWED_RANGE_AGES.MIN_USER_AGE, 'years')
      .year();
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={model => this.setState({ model })}
        ref={node => {
          this.formRef = node;
        }}
        onSubmit={this.handleFormSubmit}
      >
        <div className="completeProfileForm">
          <div className="completeProfileForm__formWrapper">
            <div className="completeProfileForm__form row column">
              <div className="row">
                <div className="column small-12">
                  <div className="completeProfileForm__header ">
                    <Link to="/">
                      <Icon
                        glyph={Logo}
                        width={100}
                        height={35}
                        className="completeProfileForm__logo"
                      />
                    </Link>
                    <Link to="/" className="completeProfileForm__skipLink">
                      Skip
                    </Link>
                  </div>
                </div>
              </div>
              {step === 1 && (
                <div className="row">
                  <div className="column small-12">
                    <div className="completeProfileForm__formField text-center">
                      <h1 className="c-darkest-gray t-nt">
                        Instantly Earn 100 Lift Points
                      </h1>
                      <div className="completeProfileForm__subTitle">
                        Complete the information below to receive your points
                      </div>
                    </div>
                  </div>
                  <div className="column small-12 medium-6 large-4 large-offset-2">
                    <div className="completeProfileForm__formField">
                      <label
                        className="completeProfileForm__inputLabel"
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
                          this.setState({
                            model: {
                              ...this.state.model,
                              gender: e.value,
                            },
                          });
                        }}
                      />
                      <Field
                        className="completeProfileForm__hiddenInput accent"
                        name="gender"
                        id="gender"
                      />
                      <ValidationMessage for="gender" />
                    </div>
                  </div>
                  <div className="column small-12 medium-6 large-4">
                    <div className="completeProfileForm__formField">
                      <label
                        className="completeProfileForm__inputLabel"
                        htmlFor="yearOfBirth"
                      >
                        Year of Birth
                      </label>
                      <DatePicker
                        onlyYear
                        yearCounts={100}
                        initialYear={this.state.model.yearOfBirth}
                        maxYear={maxYear}
                        onChangeYear={value =>
                          this.setState({
                            model: {
                              ...this.state.model,
                              yearOfBirth: value,
                            },
                          })
                        }
                      />
                      <ValidationMessage for="yearOfBirth" />
                    </div>
                  </div>
                  <div className="column small-12 medium-6 large-4 large-offset-2">
                    <div className="completeProfileForm__formField">
                      <label
                        className="completeProfileForm__inputLabel"
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
                  </div>
                  <div className="column small-12 medium-6 large-4">
                    <div className="completeProfileForm__formField">
                      <label
                        className="completeProfileForm__inputLabel"
                        htmlFor="cannabisExperience"
                      >
                        Experience with Cannabis
                      </label>
                      <Typeahead
                        className="large"
                        value={this.state.model.cannabisExperience}
                        clearable={false}
                        options={FORM_OPTIONS.EXPERIENCE_WITH_CANNABIS}
                        placeholder="Select Experience with Cannabis"
                        sortAlphabetically={false}
                        onChange={this.handleCannabisExperienceChange}
                      />
                      <Field
                        className="completeProfileForm__hiddenInput accent"
                        name="cannabisExperience"
                        id="cannabisExperience"
                      />
                      <ValidationMessage for="cannabisExperience" />
                    </div>
                  </div>
                </div>
              )}
              {step === 2 && (
                <div className="row">
                  <div className="column small-12 medium-10 medium-offset-1">
                    <div className="completeProfileForm__formField text-center">
                      <h1 className="c-darkest-gray t-nt">
                        Complete the information below to receive another 100
                        Lift Points
                      </h1>
                    </div>
                  </div>
                  <div className="column small-12 medium-6 large-4 large-offset-2">
                    <div className="completeProfileForm__formField">
                      <label
                        className="completeProfileForm__inputLabel"
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
                  </div>
                  <div className="column small-12 medium-6 large-4">
                    <div className="completeProfileForm__formField">
                      <label
                        className="completeProfileForm__inputLabel"
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
                  <div className="column small-12 medium-6 large-4 large-offset-2">
                    <div className="completeProfileForm__formField">
                      <label
                        className="completeProfileForm__inputLabel"
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
                          this.setState({
                            model: {
                              ...this.state.model,
                              province: e.value,
                            },
                          });
                        }}
                      />
                      <Field
                        className="completeProfileForm__hiddenInput accent"
                        name="province"
                        id="province"
                      />
                      <ValidationMessage for="province" />
                    </div>
                  </div>
                  <div className="column small-12 medium-6 large-4">
                    <div className="completeProfileForm__formField">
                      <label
                        className="completeProfileForm__inputLabel"
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
                  </div>
                </div>
              )}
              {error && (
                <div className="row align-self-middle">
                  <div className="column small-12 large-8 large-offset-2">
                    <div className="text-center c-danger mb-md">{error}</div>
                  </div>
                </div>
              )}
              <div className="row align-self-middle">
                <div
                  className={cx('column small-12', {
                    'medium-6 large-4 large-offset-2': step === 2,
                  })}
                >
                  <div
                    className={cx('completeProfileForm__formField', {
                      'text-center': step === 1,
                    })}
                  >
                    {step === 1 && (
                      <Button
                        onClick={() => this.handleSubmitClick('earn')}
                        className="hollow secondary completeProfileForm__earnButton"
                        element={Link}
                        isLoading={isLoading}
                      >
                        Earn more Lift Points
                      </Button>
                    )}
                    {step === 2 && (
                      <Link
                        to="/completeprofile"
                        className="completeProfileForm__backLink"
                        onClick={() => this.saveTempUserData()}
                      >
                        Back
                      </Link>
                    )}
                  </div>
                </div>
                {step === 2 && (
                  <div className="column small-12 medium-6 large-4">
                    <div className="completeProfileForm__formField text-center">
                      <Button
                        onClick={() => this.handleSubmitClick('')}
                        className="button secondary"
                        element={Link}
                        isLoading={isLoading}
                      >
                        Finish
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default CompleteProfileForm;
