// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { toastr } from 'react-redux-toastr';
import type { List } from 'immutable';
import { cloneDeep } from 'lodash-es';

import TextAreaField from 'components/TextAreaField';
import Button from 'components/Button';
import CustomSelect from 'components/CustomSelect';
import ValidationMessage from 'components/ValidationMessage';
import TagList from 'components/TagList';
import transformOptions from 'utils/transformOptions';

import './styles.scss';

const schema = yup.object({
  title: yup
    .string()
    .min(16, 'minimal title length is 16 characters')
    .max(150, 'max title length is 150 characters')
    .required(),
  category: yup.string().required(),
  message: yup.string(),
  tags: yup.array().of(yup.object()),
});

type Props = {
  onSubmit: Function,
  isSubmiting: boolean,
  categories: List<*>,
  category?: string,
  title: ?string,
};

class AnswerFrom extends Component<
  Props,
  {
    model: Object,
  }
> {
  constructor(props: Props) {
    super(props);
    const { categories, category } = props;
    let categoryId = '';
    if (category) {
      const categoryItem = categories.find(
        item => item.get('slug') === category
      );
      if (categoryItem) {
        categoryId = categoryItem.get('_id');
      }
    }
    this.state = {
      model: {
        title: props.title,
        category: categoryId,
        message: '',
        tags: [],
      },
    };
  }

  componentWillReceiveProps(newProps: Object) {
    const { error } = newProps;
    const { isSubmiting } = this.props;
    if (isSubmiting && isSubmiting !== newProps.isSubmiting) {
      if (!error) {
        toastr.success('', 'Your question was posted successfully', '');
      } else {
        toastr.error('', newProps.error);
      }
    }
  }

  render() {
    const { isSubmiting, onSubmit, categories } = this.props;
    const {
      model: { title },
    } = this.state;
    return (
      <Form
        className="createQuestionForm"
        schema={schema}
        value={this.state.model}
        onChange={model => this.setState({ model })}
        onSubmit={onSubmit}
      >
        <div className="row column mb-hg">
          <div className="row column">
            <div className="createQuestionForm__field small-12 medium-12 column">
              <div className="mb-lg">
                <div className="mb-lg">
                  Your question in one sentence (max 150 characters)*
                </div>
                <label htmlFor="title">
                  {title ? title.length : 0}
                  /150
                </label>
                <Field className="accent" name="title" id="title" type="text" />
                <ValidationMessage for="title" />
              </div>
            </div>

            <div className="createQuestionForm__field small-12 medium-12 column">
              <div className="mb-lg">
                <div className="mb-lg">Select a Category*</div>
                <CustomSelect
                  className="large"
                  value={this.state.model.category}
                  clearable={false}
                  options={transformOptions(categories.toJS(), false, '_id')}
                  name="category"
                  id="category"
                  onChange={e => {
                    const model = cloneDeep(this.state.model);
                    model.category = e.value;
                    this.setState({ model });
                  }}
                />
                <ValidationMessage for="category" />
              </div>
            </div>

            <div className="createQuestionForm__field small-12 medium-12 column">
              <div className="mb-lg">
                <div className="mb-lg">
                  More information for your question (optional)
                </div>
                <TextAreaField name="message" id="message" />
                <ValidationMessage for="message" />
              </div>
            </div>

            <div className="createQuestionForm__field small-12 medium-12 column">
              <div className="mb-xl">
                <div className="mb-lg">
                  Add any tags to help better categorize your question
                  (optional)
                </div>
                <label htmlFor="title">multiple tags separated by commas</label>
                <TagList
                  value={this.state.model.tags}
                  className="mb-mx"
                  noResultsText={false}
                  onChange={tags => {
                    const model = cloneDeep(this.state.model);
                    model.tags = tags;
                    this.setState({ model });
                  }}
                />
                <ValidationMessage for="tags" />
              </div>
              <div className="row column fs-mn">
                You will be notified by email when someone responds with an
                answer.
              </div>
              <div className="row column fs-mn mb-xl">
                You may then choose to mark the answer as correct and close the
                question.
              </div>
            </div>
          </div>
          <div className="shrink column">
            <Button
              className="button secondary spacious"
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
