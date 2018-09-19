// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';

import Button from 'components/Button';
import Checkbox from 'components/Checkbox';
import ValidationMessage from 'components/ValidationMessage';
import './styles.scss';

const schema = yup.object({
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  email: yup
    .string()
    .email()
    .required(),
  subscribe: yup.boolean(),
});

type Props = {
  submitForm: Function,
  isLoading: boolean,
  currentUser: Object,
};

class PatientGuideForm extends Component<
  Props,
  {
    model: Object,
  }
> {
  constructor(props: Object) {
    super(props);
    const { currentUser } = props;
    if (currentUser) {
      this.state = {
        model: {
          firstName: currentUser.get('firstName'),
          lastName: currentUser.get('lastName'),
          email: currentUser.get('email'),
          subscribe: false,
        },
      };
    } else {
      this.state = {
        model: {
          firstName: '',
          lastName: '',
          email: '',
          subscribe: false,
        },
      };
    }
  }

  componentWillReceiveProps(newProps: Props) {
    const { error, success, isLoading } = newProps;
    if (this.props.isLoading && !isLoading) {
      if (success) {
        toastr.success('', success, '');
      } else if (error) {
        toastr.error('', error);
      }
    }
  }
  render() {
    const { isLoading } = this.props;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={model => this.setState({ model })}
        onSubmit={e => this.props.submitForm(e)}
      >
        <div className="row column mb-md patientGuideForm">
          <div className="row centered">
            <div className="small-12 medium-6 column mb-md">
              <label htmlFor="firstName">First Name*</label>
              <Field
                className="accent"
                name="firstName"
                id="firstName"
                type="text"
              />
              <ValidationMessage for="firstName" />
            </div>
            <div className="small-12 medium-6 column mb-md">
              <label htmlFor="lastName">Last Name*</label>
              <Field
                className="accent"
                name="lastName"
                id="lastName"
                type="text"
              />
              <ValidationMessage for="lastName" />
            </div>
          </div>
          <div className="row centered">
            <div className="small-12 column mb-md">
              <label htmlFor="email">Email address*</label>
              <Field className="accent" name="email" id="email" type="email" />
              <ValidationMessage for="email" />
            </div>
          </div>
          <div className="row">
            <div className="column small-12 mb-md">
              <Checkbox element={Field} id="subscribe" name="subscribe">
                <label htmlFor="subscribe">Subscribe to our newsletter</label>
              </Checkbox>
            </div>
          </div>
          <div className="patientGuideForm__submitSection">
            <div className="mb-md">
              <Button
                className="button secondary spacious"
                type="submit"
                element={Form.Button}
                isLoading={isLoading}
              >
                Submit
              </Button>
            </div>
          </div>
        </div>
      </Form>
    );
  }
}

export default PatientGuideForm;
