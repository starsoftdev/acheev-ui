// @flow

import React, { Component } from 'react';
import Form from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import TextAreaField from 'components/TextAreaField';

const schema = yup.object({
  message: yup.string(),
});

type Props = {
  onSubmit: Function,
  requestQuestion: Function,
  isSubmiting: boolean,
  answerId: string,
  error?: string,
  questionSlug: string,
};

class ReplyForm extends Component<
  Props,
  {
    model: Object,
  }
> {
  constructor(props: Object) {
    super(props);
    this.state = {
      model: {
        message: '',
      },
    };
  }

  componentWillReceiveProps(newProps: Props) {
    const { error } = newProps;
    const { isSubmiting, questionSlug } = this.props;
    if (isSubmiting && isSubmiting !== newProps.isSubmiting) {
      if (error === '') {
        toastr.success('', 'A reply created successfully!', '');
        this.props.requestQuestion(questionSlug);
      } else {
        toastr.error('', newProps.error);
      }
    }
  }

  onChange = (model: Object) => {
    this.setState({ model });
  };

  render() {
    const { isSubmiting, onSubmit, answerId } = this.props;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={e => {
          onSubmit(e, answerId);
        }}
        className="replyForm row column mb-lg"
      >
        <div className="row mb-mx">
          <div className="column medium-12 npl npr">
            <TextAreaField className="accent" name="message" id="message" />
            <ValidationMessage for="message" />
          </div>
        </div>
        <div className="row">
          <div className="small-12 column npl npr">
            <Button
              className="button secondary float-right"
              type="submit"
              element={Form.Button}
              isLoading={isSubmiting}
            >
              Submit
            </Button>
          </div>
        </div>
      </Form>
    );
  }
}

export default ReplyForm;
