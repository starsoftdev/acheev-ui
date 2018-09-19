// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';

import { List, fromJS } from 'immutable';

import HelpfulLinks from 'components/HelpfulLinks';
import QuestionForm from 'components/Forum/Question/Form';
import Breadcrumbs from 'components/Breadcrumbs';
import Banner from 'components/PageBanner';
import Preloader from 'components/Preloader';

import injectSagas from 'utils/injectSagas';
import saga, {
  reducer,
  requestCategories,
  requestCreateQuestion,
} from './sagas';

import BannerBG from '../banner.jpg';
import './styles.scss';

type Props = {
  requestCategories: Function,
  requestCreateQuestion: Function,
  categories: List<*>,
  isLoading: boolean,
  isSubmiting: boolean,
  error: string,
  location: Object,
};

class CreateQuestionPage extends Component<Props> {
  componentDidMount() {
    this.props.requestCategories();
  }

  render() {
    const {
      categories,
      isLoading,
      isSubmiting,
      location: { query: { title, category } },
    } = this.props;
    return (
      <div>
        <Breadcrumbs
          path={fromJS([
            {
              link: '/forum',
              title: 'Advice Forum',
            },
            {
              link: '',
              title: 'Create a Question',
            },
          ])}
        />
        <Banner
          title="Ask a question"
          subtitle="Have your question about medical marijuana be answered by the Lift community."
          bg={BannerBG}
        />
        {isLoading ? (
          <Preloader />
        ) : (
          <div className="createQuestion row">
            <div className="row column small-12 large-expand">
              <div className="createQuestion__description column small-12">
                Complete the form below to submit your question to the
                community. If needed you may include additional information to
                help describe your question. Please make sure your question
                relates to one of the categories below.
              </div>
              <QuestionForm
                onSubmit={this.props.requestCreateQuestion}
                isSubmiting={isSubmiting}
                categories={categories}
                category={category}
                error={this.props.error}
                title={title}
              />
            </div>
            <div className="column small-12 large-shrink">
              <HelpfulLinks />
            </div>
          </div>
        )}
      </div>
    );
  }
}

const mapStateToPtops = state => ({
  isLoading: state.getIn(['createQuestion', 'categories', 'isLoading']),
  categories: state.getIn(['createQuestion', 'categories', 'data', 'hits']),
  isSubmiting: state.getIn(['createQuestion', 'questionForm', 'isLoading']),
  error: state.getIn(['createQuestion', 'questionForm', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestCreateQuestion: payload => dispatch(requestCreateQuestion(payload)),
  requestCategories: () => dispatch(requestCategories()),
});

export default compose(
  injectSagas({ key: 'createQuestion', saga, reducer }),
  connect(mapStateToPtops, mapDispatchToProps)
)(CreateQuestionPage);
