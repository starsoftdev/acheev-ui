// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import type { Map } from 'immutable';

import FormModal from 'components/FormModal';
import ValidationMessage from 'components/ValidationMessage';
import Checkbox from 'components/Checkbox';
import Link from 'components/Link';
import Icon from 'components/Icon';
import Button from 'components/Button';

import Download from 'images/sprite/download-inline.svg';
import pdfImage from 'images/pdf.jpg';

const renderButtonContents = () => (
  <div className="row align-middle">
    <div className="shrink column npr">Download now</div>
    <div className="shrink column">
      <Icon glyph={Download} width={20} height={14} />
    </div>
  </div>
);

const schema = yup.object({
  email: yup
    .string()
    .email()
    .required(),
  terms: yup.boolean().oneOf([true], 'Must Accept Terms and Conditions'),
  newsletters: yup.boolean(),
});

type Props = {
  emailLoading: boolean,
  emailSuccess: ?string,
  emailError: ?string,
  pdf: string,
  requestCheckEmail: Function,
  user: Map<*, *>,
  closeModal: Function,
  isOpen: boolean,
};

type State = {
  emailChecked: boolean,
  model: {
    email: string,
    terms: boolean,
    newsletters: boolean,
  },
};

class Canabis101Modal extends Component<Props, State> {
  state = {
    emailChecked: false,
    model: {
      email: '',
      terms: false,
      newsletters: false,
    },
  };

  componentDidUpdate = ({ emailSuccess }: Props) => {
    if (!emailSuccess && this.props.emailSuccess) {
      this.download(this.props.pdf);
    }
  };

  download = (url: string) => {
    if (window) window.open(url, '_blank');
    this.props.closeModal();
  };

  checkOrDownload = (email: string, newsletters: boolean) => {
    if (this.state.emailChecked && !this.props.emailError) {
      this.download(this.props.pdf);
    } else {
      this.props.requestCheckEmail(email, newsletters);
    }
    this.setState({
      emailChecked: true,
      model: { email: '', terms: false, newsletters: false },
    });
  };

  render() {
    const { pdf, user, emailError, emailLoading } = this.props;
    return (
      <FormModal isOpen={this.props.isOpen}>
        <div className="text-center">
          <img
            src={pdfImage}
            alt="Download PDF"
            className="c101__downloadImg"
          />
          <h3 className="c101__modalTitle">Download Cannabis 101 Guide</h3>
        </div>
        {user ? (
          <div className="text-center">
            <Button
              className="button secondary"
              onClick={() => this.download(pdf)}
            >
              {renderButtonContents()}
            </Button>
          </div>
        ) : (
          <Form
            schema={schema}
            value={this.state.model}
            onChange={model => this.setState({ model })}
            onSubmit={({ email, newsletters }) =>
              this.checkOrDownload(email, newsletters)
            }
          >
            <div className="mb-md">
              <label htmlFor="username">Email address</label>
              <Field className="accent" name="email" id="email" type="email" />
              <ValidationMessage for="email" />
            </div>
            <div className="mb-md">
              <Checkbox element={Field} id="terms" name="terms">
                You have read and agree to{' '}
                <Link to="/terms-and-conditions">terms and conditions</Link>
              </Checkbox>
              <ValidationMessage for="terms" />
            </div>
            <div className="mb-md">
              <Checkbox element={Field} id="newsletters" name="newsletters">
                <div>
                  {`You agree to receive Lift's newsletters and marketing`}
                </div>
                <div>
                  communications containing news, updates and other promotions.
                </div>
              </Checkbox>
              <ValidationMessage for="newsletters" />
            </div>
            <div className="text-center mb-md">
              <Button
                className="button secondary"
                type="submit"
                element={Form.Button}
                isLoading={emailLoading}
              >
                {renderButtonContents()}
              </Button>
            </div>
            {emailError && <div className="c-danger">{emailError}</div>}
          </Form>
        )}
      </FormModal>
    );
  }
}

export default Canabis101Modal;
