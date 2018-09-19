// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { fromJS } from 'immutable';
import type { List, Map } from 'immutable';
import { toastr } from 'react-redux-toastr';
import { get } from 'utils/immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import Banner from 'components/PageBanner';
import AnswerList from 'components/Forum/Answer/List';
import QuestionInfo from 'components/Forum/Question/Info';
import AnswerForm from 'components/Forum/Answer/Form';
import Preloader from 'components/Preloader';

import { setMetaJson } from 'containers/App/sagas';

import injectSagas from 'utils/injectSagas';
import saga, {
  reducer,
  requestQuestion,
  submitAnswer,
  requestCategories,
  deleteQuestion,
} from './sagas';

type Props = {
  match: Object,
  requestQuestion: Function,
  requestCategories: Function,
  setMetaJson: Function,
  categories: List<*>,
  isLoading: boolean,
  isSubmiting: boolean,
  error: '',
  success: '',
  question: Map<string, *>,
  submitAnswer: Function,
  deleteQuestion: Function,
  currentUser: Object,
  answerSuccess: string,
  answerError: string,
  replySuccess: string,
  replyError: string,
};

class QuestionPage extends Component<Props> {
  componentDidMount() {
    const { match: { params: { questionSlug } } } = this.props;
    this.props.requestCategories();
    this.props.requestQuestion(questionSlug);
  }

  componentWillReceiveProps(newProps: Props) {
    const {
      question,
      isLoading,
      categories,
      replySuccess,
      replyError,
      answerSuccess,
      answerError,
      match: { params: { categorySlug, questionSlug } },
    } = newProps;
    const category = categories
      ? categories.find(cat => cat.get('slug') === categorySlug)
      : null;

    if (answerError && answerError !== this.props.answerError) {
      toastr.error('', answerError);
    }

    if (answerSuccess && answerSuccess !== this.props.answerSuccess) {
      toastr.success('', answerSuccess);
      this.props.requestQuestion(questionSlug);
    }

    if (replyError && replyError !== this.props.replyError) {
      toastr.error('', replyError);
    }

    if (replySuccess && replySuccess !== this.props.replySuccess) {
      toastr.success('', replySuccess);
      this.props.requestQuestion(questionSlug);
    }
    if (this.props.isLoading === true && isLoading === false && question) {
      this.props.setMetaJson(
        ['title'],
        `${question.get('title')} - Lift & Co.`
      );
      this.props.setMetaJson(['name'], `${question.get('title')} - Lift & Co.`);
      this.props.setMetaJson(
        ['description'],
        question.get('message')
          ? question.get('message')
          : get(category, 'description')
      );
    }
  }

  render() {
    const {
      isLoading,
      match: { params: { categorySlug, questionSlug } },
      categories,
      question,
      isSubmiting,
      error,
      success,
      currentUser,
    } = this.props;
    const category = categories
      ? categories.find(cat => cat.get('slug') === categorySlug)
      : null;
    const bannerTitle = category
      ? category.get('name')
      : 'Questions & Answers on Medical Marijuana';
    const bannerDescription = category
      ? category.get('description')
      : 'Advice on health, laws and regulations, strains, producers, doctors and more. Ask a question and help other members.';
    const isUserOwner =
      currentUser &&
      question &&
      question.getIn(['user', 'id']) === currentUser.get('id');
    const isUserSuper =
      currentUser &&
      (currentUser.get('role') === 'admin' ||
        currentUser.get('role') === 'ambassador');
    const isMarkable =
      (isUserOwner || isUserSuper) && question.get('closed') === false;
    let helmetTitle = 'Lift';
    if (question.get('title')) {
      helmetTitle = `${question.get('title')} - Lift & Co.`;
    }
    return (
      <div>
        <Helmet title={helmetTitle} />
        <Breadcrumbs
          path={fromJS([
            {
              link: '/forum',
              title: 'Advice Forum',
            },
            {
              link: `/forum/${categorySlug}`,
              title: `${categorySlug}`,
            },
            {
              link: `/forum/${categorySlug}/${questionSlug}`,
              title: `${questionSlug}`,
            },
          ])}
        />
        <Banner title={bannerTitle} subtitle={bannerDescription} />
        {isLoading ? (
          <Preloader />
        ) : (
          <div className="row column">
            <QuestionInfo
              className="row column"
              question={question}
              category={question.get('category')}
              showDetail
              currentUser={currentUser}
              deleteQuestion={this.props.deleteQuestion}
              success={success}
              error={error}
              prefix="asked"
            />
            {question && !question.get('closed') ? (
              <div>
                <h2>Answer this question</h2>
                <AnswerForm
                  questionId={question.get('_id')}
                  isSubmiting={isSubmiting}
                  error={error}
                  onSubmit={this.props.submitAnswer}
                  requestQuestion={this.props.requestQuestion}
                  questionSlug={questionSlug}
                />
              </div>
            ) : (
              <div />
            )}
            <AnswerList
              questionId={question.get('_id')}
              correctAnswer={question.get('correctAnswer')}
              answers={question.get('answers')}
              isMarkable={isMarkable}
              questionSlug={questionSlug}
            />
          </div>
        )}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  isLoading: state.getIn(['question', 'question', 'isLoading']),
  question: state.getIn(['question', 'question', 'data']),
  isSubmiting: state.getIn(['question', 'answerForm', 'isLoading']),
  error:
    state.getIn(['question', 'answerForm', 'error']) ||
    state.getIn(['question', 'questions', 'error']),
  success: state.getIn(['question', 'questions', 'success']),
  answerError: state.getIn(['question', 'answers', 'error']),
  answerSuccess: state.getIn(['question', 'answers', 'success']),
  replyError: state.getIn(['question', 'replies', 'error']),
  replySuccess: state.getIn(['question', 'replies', 'success']),
  categories: state.getIn(['question', 'categories', 'data', 'hits']),
  currentUser: state.getIn(['app', 'user']),
});

const mapDispatchToProps = dispatch => ({
  requestQuestion: slug => dispatch(requestQuestion(slug)),
  submitAnswer: data => dispatch(submitAnswer(data)),
  requestCategories: () => dispatch(requestCategories()),
  deleteQuestion: id => dispatch(deleteQuestion(id)),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default compose(
  injectSagas({ key: 'question', saga, reducer }),
  connect(mapStateToProps, mapDispatchToProps)
)(QuestionPage);
