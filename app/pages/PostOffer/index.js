// @flow

import React, { Component } from 'react';
import Form, { Field } from 'react-formal';
import yup from 'yup';
import { compose } from 'redux';
import { connect } from 'react-redux';

import injectSagas from 'utils/injectSagas';
import saga, { reducer, requestCreateOffer } from 'containers/Offer/sagas';

import PageBanner from 'components/PageBanner';
import TextAreaField from 'components/TextAreaField';
import Typeahead from 'components/Typeahead';
import Button from 'components/Button';
import ValidationMessage from 'components/ValidationMessage';

import FILTER_OPTIONS from 'enum/filter/options';

import './styles.scss';

const schema = yup.object({
  job_name: yup.string().required(),
  category: yup.string().required(),
  opening_message: yup.string().required(),
});

type Props = {
  requestCreateOffer: Function,
  isLoading: boolean,
  error: string,
};

type State = {
  model: {
    job_name: string,
    category: string,
    opening_message: string,
  },
};

class PostOfferPage extends Component<Props, State> {
  state = {
    model: {
      job_name: '',
      category: '',
      opening_message: '',
    },
  };
  componentDidUpdate(prevProps: Props) {
    const { isLoading, error } = this.props;
    if (prevProps.isLoading && !isLoading && !error) {
      this.setState({
        model: {
          job_name: '',
          category: '',
          opening_message: '',
        },
      });
    }
  }
  render() {
    return (
      <div className="postOfferPage">
        <PageBanner title="Post Offer" expanded />
        <Form
          schema={schema}
          value={this.state.model}
          onChange={model => this.setState({ model })}
          onSubmit={e => this.props.requestCreateOffer(e)}
        >
          <div className="row mb-hg">
            <div className="column large-8 large-offset-2">
              <div className="row align-middle mb-lg">
                <div className="column shrink">
                  <h1 className="postOfferPage__label">Basic Informations</h1>
                </div>
              </div>
              <div className="row">
                <div className="column">
                  <h1 className="postOfferPage__label fs-mx mb-md">Job name</h1>
                  <Field
                    className="accent"
                    name="job_name"
                    id="job_name"
                    placeholder="Type job name here ..."
                  />
                  <ValidationMessage for="job_name" />
                </div>
                <div className="column">
                  <h1 className="postOfferPage__label fs-mx mb-md">Category</h1>
                  <Typeahead
                    className="large"
                    value={this.state.model.category}
                    clearable={false}
                    options={FILTER_OPTIONS.CATEGORY_OPTIONS}
                    placeholder="Select options"
                    sortAlphabetically={false}
                    onChange={e => {
                      this.setState(state => ({
                        model: {
                          ...state.model,
                          category: e.value,
                        },
                      }));
                    }}
                  />
                  <Field
                    className="postOfferPage__hiddenInput accent"
                    name="category"
                    id="category"
                  />
                  <ValidationMessage for="category" />
                </div>
              </div>
            </div>
          </div>
          <div className="row mb-hg">
            <div className="column large-8 large-offset-2">
              <div className="row align-middle mb-lg">
                <div className="column shrink">
                  <h1 className="postOfferPage__label">Opening message</h1>
                </div>
                <div className="column text-right">
                  <h4 className="postOfferPage__labelDesc">
                    Opening message will displayed as your first message in the
                    order detail page.
                  </h4>
                </div>
              </div>
              <TextAreaField
                name="opening_message"
                id="opening_message"
                rows={10}
              />
              <ValidationMessage for="opening_message" />
            </div>
          </div>
          <div className="row">
            <div className="column text-center c-danger mb-md">
              {this.props.error}
            </div>
          </div>
          <div className="row align-center">
            <div className="column shrink">
              <Button
                className="button bg-gradient nb"
                type="submit"
                element={Form.Button}
                isLoading={this.props.isLoading}
              >
                Save
              </Button>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['offer', 'isLoading']),
  error: state.getIn(['offer', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateOffer: payload => dispatch(requestCreateOffer(payload)),
});

export default compose(
  injectSagas({ key: 'offer', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(PostOfferPage);