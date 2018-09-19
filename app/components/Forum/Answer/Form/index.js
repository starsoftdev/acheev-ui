// @flow

import React, { Component } from 'react';
import Form from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import TextAreaField from 'components/TextAreaField';

const schema = yup.object({
  message: yup.string().required(),
});

type Props = {
  onSubmit: Function,
  requestQuestion: Function,
  isSubmiting: boolean,
  questionSlug: string,
};

class AnswerFrom extends Component<
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

  componentWillReceiveProps(newProps: Object) {
    const { error } = newProps;
    const { isSubmiting, questionSlug } = this.props;
    if (isSubmiting && isSubmiting !== newProps.isSubmiting) {
      if (!error) {
        toastr.success('', 'Your answer was posted successfully', '');
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
    const { isSubmiting, onSubmit } = this.props;
    return (
      <Form
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={e => {
          onSubmit(e);
        }}
        className="row column mb-lg"
      >
        <div className="row mb-mx">
          <div className="column">
            <TextAreaField
              className="accent"
              name="message"
              id="message"
              rows={10}
            />
            <ValidationMessage for="message" />
          </div>
        </div>
        <div className="row has-b-b">
          <div className="small-12 column mb-md">
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

export default AnswerFrom;
