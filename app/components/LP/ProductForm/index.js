// @flow

import React, { Component } from 'react';
import type { Map } from 'immutable';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { EditorState, ContentState, convertToRaw } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import draftToHtml from 'draftjs-to-html';
import { cloneDeep, map } from 'lodash-es';

import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';
import Editor from 'components/Editor';
import TagList from 'components/TagList';
import FileUpload from 'components/FileUpload';

import './styles.scss';

type Props = {
  product: Object, // eslint-disable-line react/no-unused-prop-types
  category: string,
  business: Map<*, *>,
  productId: string,
  user: Object,
  requestBusinesses: Function,
  submitProduct: Function,
  requestProduct: Function,
  isLoading: boolean, // eslint-disable-line react/no-unused-prop-types
  isUpdating: boolean,
  error: string,
  logo: string, // eslint-disable-line react/no-unused-prop-types
  uploadLogo: Function,
};

type State = {
  model: Object,
  editorState: ?Object,
  wasLoading: boolean,
  wasUpdating: boolean,
  prevLogo: string,
};

function thcCheck() {
  const { thcLow, thcHigh } = this.parent;
  if (thcLow && thcHigh) return parseFloat(thcLow) <= parseFloat(thcHigh);
  return true;
}

function cbdCheck() {
  const { cbdLow, cbdHigh } = this.parent;
  if (cbdLow && cbdHigh) return parseFloat(cbdLow) <= parseFloat(cbdHigh);
  return true;
}

function transformNumber(currentValue, originalvalue) {
  if (originalvalue === '') return null;
  return currentValue;
}

const strainSchema = yup.object({
  strainName: yup
    .string()
    .required()
    .label('name')
    .max(400),
  category: yup
    .string()
    .nullable()
    .required()
    .label('type'),
  thcLow: yup
    .number()
    .nullable()
    .transform(transformNumber)
    .typeError('thcLow must be number')
    .min(0)
    .max(100)
    .test('thcTest', 'thcLow should not exceed thcHigh', thcCheck),
  thcHigh: yup
    .number()
    .nullable()
    .transform(transformNumber)
    .typeError('thcHigh must be number')
    .min(0)
    .max(100)
    .test('thcTest', 'thcHigh should exceed thcLow', thcCheck),
  cbdLow: yup
    .number()
    .nullable()
    .transform(transformNumber)
    .typeError('cbdLow must be number')
    .min(0)
    .max(100)
    .test('cbdCheck', 'cbdLow should not exceed cbdHigh', cbdCheck),
  cbdHigh: yup
    .number()
    .nullable()
    .transform(transformNumber)
    .typeError('cbdHigh must be number')
    .min(0)
    .max(100)
    .test('cbdCheck', 'cbdHigh should not exceed cbdLow', cbdCheck),
  tags: yup.array().of(yup.string()),
  title: yup
    .string()
    .nullable()
    .max(400),
  description: yup.string().nullable(),
  variants: yup.array().of(
    yup.object().shape({
      availabilityStatus: yup.string().nullable(),
      price: yup
        .number()
        .transform(transformNumber)
        .label('price')
        .typeError('price must be number')
        .required()
        .min(0.1)
        .max(10000),
    })
  ),
  thumbnail: yup.string().nullable(),
});

const oilSchema = yup.object({
  oilName: yup
    .string()
    .required()
    .label('name')
    .max(400),
  category: yup
    .string()
    .required()
    .label('type'),
  thcLow: yup
    .number()
    .transform(transformNumber)
    .nullable()
    .label('thc')
    .typeError('thc must be number')
    .min(0)
    .max(150),
  cbdLow: yup
    .number()
    .transform(transformNumber)
    .nullable()
    .label('cbd')
    .typeError('cbd must be number')
    .min(0)
    .max(150),
  tags: yup.array().of(yup.string()),
  title: yup
    .string()
    .nullable()
    .max(400),
  description: yup.string().nullable(),
  variants: yup.array().of(
    yup.object().shape({
      availabilityStatus: yup.string().nullable(),
      doseAmount: yup
        .number()
        .nullable()
        .transform(transformNumber)
        .label('weight')
        .typeError('weight must be number')
        .min(0)
        .max(150),
      price: yup
        .number()
        .nullable()
        .transform(transformNumber)
        .typeError('price must be number')
        .label('price')
        .required()
        .min(0.1)
        .max(10000),
    })
  ),
  thumbnail: yup.string().nullable(),
});

const getInitialModel: Function = category => {
  const variants = [];
  if (category === 'strain') {
    variants.push({
      available: true,
      doseUnit: 'g',
      doseAmount: 1,
    });
  } else {
    variants.push({
      available: true,
      doseUnit: 'ml',
    });
  }
  return {
    __t: category === 'oil' ? 'Oil' : 'Strain',
    published: true,
    variants,
  };
};

class LpProductForm extends Component<Props, State> {
  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    const {
      product,
      isLoading,
      error,
      isUpdating,
      productId,
      category,
      logo,
    } = nextProps;
    const { wasUpdating, wasLoading, prevLogo } = prevState;
    if (wasUpdating && !isUpdating && !error && !productId) {
      return {
        model: getInitialModel(category),
        editorState: null,
        wasUpdating: isUpdating,
        wasLoading: isLoading,
        prevLogo: logo,
      };
    }
    if (wasLoading && !isLoading && !error && product) {
      const description = product.get('description') || '';
      const contentBlock = htmlToDraft(description);
      const contentState = ContentState.createFromBlockArray(
        contentBlock.contentBlocks
      );
      const editorState = EditorState.createWithContent(contentState);
      const nameField = `${category}Name`;
      const variants = cloneDeep(product.get('variants').toJS());
      const variantsInDollar = variants.map(v => ({
        ...v,
        price: v.price / 100,
      }));
      const model = {
        category: product.get('category'),
        thcLow: product.get('thcLow'),
        thcHigh: product.get('thcHigh'),
        cbdLow: product.get('cbdLow'),
        cbdHigh: product.get('cbdHigh'),
        tags: product.get('tags').toJS(),
        title: product.get('title'),
        __t: product.get('__t'),
        description,
        published: true,
        variants: variantsInDollar,
        thumbnail: product.get('thumbnail'),
      };
      model[nameField] = product.get('name');
      return {
        model,
        editorState,
        wasUpdating: isUpdating,
        wasLoading: isLoading,
        prevLogo: logo,
      };
    }
    if (logo && logo !== prevLogo) {
      return {
        model: {
          ...prevState.model,
          thumbnail: logo,
        },
        wasUpdating: isUpdating,
        wasLoading: isLoading,
        prevLogo: logo,
      };
    }
    return {
      wasUpdating: isUpdating,
      wasLoading: isLoading,
      prevLogo: logo,
    };
  }
  constructor(props: Props) {
    super(props);
    this.state = {
      model: getInitialModel(props.category),
      editorState: null,
      wasUpdating: false, // eslint-disable-line react/no-unused-state
      wasLoading: false, // eslint-disable-line react/no-unused-state
      prevLogo: '', // eslint-disable-line react/no-unused-state
    };
  }
  componentDidMount() {
    const { user, productId } = this.props;
    this.props.requestBusinesses(user.get('id'));
    if (productId) this.props.requestProduct(productId);
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
  onChangeTaglist: Function = (path: string, value?: Boolean) => {
    const model = cloneDeep(this.state.model);
    model[path] = map(value, 'value');
    this.onChange(model);
  };
  onChange: Function = (model: Object) => {
    this.setState({ model });
  };
  onSubmit: Function = (e: Object) => {
    const { business, productId, category } = this.props;
    const data = e;
    const nameField = `${category}Name`;
    data.name = data[nameField];
    data.business = business.get('id');
    this.props.submitProduct(productId, data);
  };
  render() {
    const { productId, error, isUpdating, category } = this.props;
    const schema = category === 'strain' ? strainSchema : oilSchema;
    return (
      <Form
        className="lpProductForm"
        schema={schema}
        value={this.state.model}
        onChange={this.onChange}
        onSubmit={this.onSubmit}
      >
        <div className="row">
          <div className="column">
            <div className="row mb-mx">
              <div className="column">
                <label htmlFor="name">Name</label>
                {productId ? (
                  <div>{this.state.model[`${category}Name`]}</div>
                ) : (
                  <Field
                    className="accent"
                    name={`${category}Name`}
                    id={`${category}Name`}
                    type="text"
                  />
                )}
                <ValidationMessage for={`${category}Name`} />
              </div>
            </div>
            {category === 'strain' && (
              <div>
                <div className="row mb-mx">
                  <div className="column bb-light-gray pt-md">
                    <a className="fs-mx t-capitalize lpProductForm__toggleHeader">
                      Genetics
                    </a>
                  </div>
                </div>
                <div className="row mb-mx">
                  <div className="column small-12 medium-6">
                    <label htmlFor="category">Type</label>
                    <Field
                      name="category"
                      type="select"
                      className="accent lpProductForm__select"
                    >
                      <option value={null}>Select type...</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="indica">Indica</option>
                      <option value="sativa">Sativa</option>
                    </Field>
                    <ValidationMessage for="category" />
                  </div>
                </div>
                <div className="row mb-mx">
                  <div className="column small-12 medium-6">
                    <label htmlFor="thcLow">THC % (LOW)</label>
                    <Field
                      className="accent"
                      name="thcLow"
                      id="thcLow"
                      type="text"
                    />
                    <ValidationMessage for="thcLow" />
                  </div>
                  <div className="column small-12 medium-6">
                    <label htmlFor="thcHigh">THC % (HIGH)</label>
                    <Field
                      className="accent"
                      name="thcHigh"
                      id="thcHigh"
                      type="text"
                    />
                    <ValidationMessage for="thcHigh" />
                  </div>
                  <div className="column small-12 medium-6">
                    <label htmlFor="cbdLow">CBD % (LOW)</label>
                    <Field
                      className="accent"
                      name="cbdLow"
                      id="cbdLow"
                      type="text"
                    />
                    <ValidationMessage for="cbdLow" />
                  </div>
                  <div className="column small-12 medium-6">
                    <label htmlFor="cbdHigh">CBD % (HIGH)</label>
                    <Field
                      className="accent"
                      name="cbdHigh"
                      id="cbdHigh"
                      type="text"
                    />
                    <ValidationMessage for="cbdHigh" />
                  </div>
                </div>
              </div>
            )}
            <div className="row mb-mx">
              <div className="column bb-light-gray pt-md">
                <a className="fs-mx t-capitalize lpProductForm__toggleHeader">
                  Sales
                </a>
              </div>
            </div>
            <div className="row mb-mx">
              <div className="column small-12 medium-6">
                <label htmlFor="variants[0].availabilityStatus">
                  AVAILABILITY
                </label>
                <Field
                  name="variants[0].availabilityStatus"
                  type="select"
                  className="accent lpProductForm__select"
                >
                  <option value="available">Available</option>
                  <option value="discontinued">Discontinued</option>
                </Field>
                <ValidationMessage for="variants[0].availabilityStatus" />
              </div>
            </div>
            <div className="row mb-mx">
              <div className="column small-12 medium-6">
                <label htmlFor="variants[0].price">
                  {category === 'oil'
                    ? 'PRICE PER MILLIGRAM'
                    : 'PRICE PER GRAM'}
                </label>
                <Field
                  className="accent"
                  name="variants[0].price"
                  id="price"
                  type="text"
                />
                <ValidationMessage for="variants[0].price" />
              </div>
              {category === 'oil' && (
                <div className="column small-12 medium-6">
                  <label htmlFor="variants[0].doseAmount">WEIGHT IN ML</label>
                  <Field
                    className="accent"
                    name="variants[0].doseAmount"
                    id="price"
                    type="text"
                  />
                  <ValidationMessage for="variants[0].doseAmount" />
                </div>
              )}
            </div>
            {category === 'oil' && (
              <div>
                <div className="row mb-mx">
                  <div className="column bb-light-gray pt-md">
                    <a className="fs-mx t-capitalize lpProductForm__toggleHeader">
                      Properties
                    </a>
                  </div>
                </div>
                <div className="row mb-mx">
                  <div className="column small-12 medium-6">
                    <label htmlFor="category">Type</label>
                    <Field
                      name="category"
                      type="select"
                      className="accent lpProductForm__select"
                    >
                      <option value={null}>Select type...</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="indica">Indica</option>
                      <option value="sativa">Sativa</option>
                    </Field>
                    <ValidationMessage for="category" />
                  </div>
                </div>
                <div className="row mb-mx">
                  <div className="column small-12 medium-6">
                    <label htmlFor="thcLow">THC MG/ML</label>
                    <Field
                      className="accent"
                      name="thcLow"
                      id="thcLow"
                      type="text"
                    />
                    <ValidationMessage for="thcLow" />
                  </div>
                  <div className="column small-12 medium-6">
                    <label htmlFor="cbdLow">CBD MG/ML</label>
                    <Field
                      className="accent"
                      name="cbdLow"
                      id="cbdLow"
                      type="text"
                    />
                    <ValidationMessage for="cbdLow" />
                  </div>
                </div>
              </div>
            )}
            <div className="row mb-mx">
              <div className="column bb-light-gray pt-md">
                <a className="fs-mx t-capitalize lpProductForm__toggleHeader">
                  Listing
                </a>
              </div>
            </div>
            <div className="row mb-mx">
              <div className="column small-12 medium-6">
                <label htmlFor="tags">TAGS</label>
                <TagList
                  value={this.state.model.tags}
                  typeaheadOptions={this.state.model.tags}
                  inputPlaceholder="Type a tag here"
                  className="mb-mx"
                  onChange={value => this.onChangeTaglist('tags', value)}
                />
              </div>
            </div>
            <div className="row mb-mx">
              <div className="column">
                <label htmlFor="title">Title</label>
                <Field className="accent" name="title" id="title" type="text" />
                <ValidationMessage for="title" />
              </div>
            </div>
            <div className="row column mb-xl">
              <div className="mb-xl">
                <label htmlFor="description">Description</label>
                <Editor
                  editorClassName="lpProductForm__editForm"
                  editorState={this.state.editorState}
                  onEditorStateChange={this.onEditorStateChange}
                />
                <ValidationMessage for="description" />
              </div>
              <div className="mb-xl">
                <label className="profileEditForm__inputLabel" htmlFor="photo">
                  Photo
                </label>
                <FileUpload
                  picture={this.state.model.thumbnail}
                  uploadFunction={this.props.uploadLogo}
                  fieldName="thumbnail"
                  enableCrop
                />
              </div>
              <div className="text-center c-danger mb-md">{error}</div>
              <div className="mb-md">
                <Button
                  className="button secondary spacious expanded"
                  type="submit"
                  element={Form.Button}
                  isLoading={isUpdating}
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

export default LpProductForm;
