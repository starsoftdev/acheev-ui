// @flow

import React, { Component } from 'react';
import { fromJS, List } from 'immutable';
import type { List as ListType } from 'immutable';
import { get } from 'utils/immutable';
import qs from 'qs';
import { generate } from 'shortid';

import SearchField from 'components/SearchField';
import QuestionInfo from 'components/Forum/Question/Info';
import ForumFilter from 'components/Forum/Filter';
import Pagination from 'components/Pagination';
import Preloader from 'components/Preloader';

import './styles.scss';

type Props = {
  slug?: string,
  categories: List<*>,
  questions: Object,
  isLoading: boolean,
  pages: number,
  requestQuestions: Function,
  push: Function,
  location: Object,
};

type State = {
  filter: Object,
};

class ForumSearch extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const { slug, categories, location } = props;
    const category = categories.find(cat => cat.get('slug') === slug);
    const catId = get(category, '_id', 'all');
    const {
      page = 1,
      per_page = 10, // eslint-disable-line camelcase
      sort = '-createdOn',
      questionState = 'all',
    } = qs.parse(location.query);
    this.state = {
      filter: fromJS({
        category: catId,
        sort,
        questionState,
        page,
        per_page,
      }),
    };
  }

  componentDidMount() {
    this.props.requestQuestions(this.state.filter);
  }
  onChangeFilters = (path: Array<string>, value: string) => {
    const { location: { pathname, query } } = this.props;
    if (path[0] === 'category') {
      this.props.push({
        pathname: `/forum/${value}`,
        search: `?${qs.stringify({
          ...query,
          page: 1,
        })}`,
      });
      return;
    }
    let filter = this.state.filter.setIn(path, value);
    if (path[0] === 'questionState') {
      filter = filter.setIn(['page'], 1);
    }
    this.setState(
      {
        filter,
      },
      () => {
        this.props.push({
          pathname,
          search: `?${qs.stringify({
            page: this.state.filter.get('page'),
            per_page: this.state.filter.get('per_page'),
            sort: this.state.filter.get('sort'),
            questionState: this.state.filter.get('questionState'),
          })}`,
        });
        this.props.requestQuestions(this.state.filter);
      }
    );
  };
  onSubmit = (title: string) => {
    const { slug } = this.props;
    let url = `/forum/create-question?title=${encodeURIComponent(title)}`;
    if (slug) {
      url = `${url}&category=${slug}`;
    }
    this.props.push(url);
  };

  renderQuestions = (
    questions: ListType<Map<string, string>>,
    categories: ListType<Map<string, string>>
  ) => (
    <div className="row column">
      {questions &&
        questions.map(question => {
          const category = categories.find(
            cat => cat.get('_id') === question.get('category')
          );
          return (
            <QuestionInfo
              className="row column"
              question={fromJS(question)}
              category={category}
              key={generate()}
            />
          );
        })}
    </div>
  );

  render() {
    const { isLoading, questions, categories, pages } = this.props;
    const { filter } = this.state;
    return (
      <div>
        <div>
          <div className="forumSearch ">
            <div className="row">
              <div className="column">
                <SearchField
                  className="dark large"
                  onSubmit={e => this.onSubmit(e)}
                  placeholder="Have a question? Ask here"
                />
              </div>
            </div>
          </div>
          <div className="forumFilter" />
        </div>
        <ForumFilter
          categories={categories}
          filter={filter}
          onChangeFilters={this.onChangeFilters}
          defaultCategory={this.props.slug}
          defaultSort={this.state.filter.get('sort')}
          defaultQuestionState={this.state.filter.get('questionState')}
        />
        {isLoading ? (
          <Preloader />
        ) : (
          this.renderQuestions(questions, categories)
        )}
        <Pagination
          forcePage={this.state.filter.get('page')}
          pageCount={pages}
          onPageChange={e => this.onChangeFilters(['page'], e)}
        />
      </div>
    );
  }
}

export default ForumSearch;
