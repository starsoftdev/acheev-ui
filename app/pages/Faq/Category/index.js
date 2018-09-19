// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { List } from 'immutable';

import FaqTopicList from 'components/Faq/TopicList';
import Preloader from 'components/Preloader';
import FaqContactUs from 'components/Faq/ContactUs';
import FaqCategory from 'components/Faq/Category';

import { requestTopics, requestSections, requestFaq } from 'pages/Faq/sagas';

import './styles.scss';

type Props = {
  match: Object,
  topics: List<Object>,
  sections: List<Object>,
  questions: List<Object>,
  isLoadingTopics: boolean,
  isLoadingSections: boolean,
  isLoading: boolean,
  requestTopics: Function,
  requestSections: Function,
  requestFaq: Function,
};

class FaqCategoryPage extends React.Component<Props> {
  componentWillMount() {
    const { slug } = this.props.match.params;
    this.props.requestTopics();
    this.props.requestSections();
    this.props.requestFaq(slug);
  }

  componentWillReceiveProps(nextProps) {
    const { match: { params: { slug } } } = nextProps;

    if (slug !== this.props.match.params.slug) {
      this.props.requestFaq(slug);
    }
  }

  render() {
    const {
      questions,
      isLoadingTopics,
      isLoadingSections,
      isLoading,
      sections,
      topics,
      match: { params: { slug } },
    } = this.props;
    if (isLoading || isLoadingSections || isLoadingTopics) {
      return <Preloader />;
    }
    const activeTopic = topics.find(item => item.get('value') === slug);
    if (!activeTopic) return null;
    return (
      <div className="faqContainer">
        <div className="row">
          <div className="column small-12 medium-3">
            <FaqTopicList topics={topics} activeTopic={slug} isSideBar />
          </div>
          <div className="column small-12 medium-9">
            <h2 className="c-secondary mb-md">{activeTopic.get('label')}</h2>
            <FaqCategory questions={questions} sections={sections} />
          </div>
        </div>
        <div className="row column">
          <FaqContactUs />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  questions: state.getIn(['faq', 'data']),
  isLoading: state.getIn(['faq', 'isLoading']),
  error: state.getIn(['faq', 'error']),
  query: state.getIn(['faq', 'query']),
  topics: state.getIn(['faq', 'topics', 'data']),
  isLoadingTopics: state.getIn(['faq', 'topics', 'isLoading']),
  sections: state.getIn(['faq', 'sections', 'data']),
  isLoadingSections: state.getIn(['faq', 'sections', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestTopics: () => dispatch(requestTopics()),
  requestSections: () => dispatch(requestSections()),
  requestFaq: (topic, query = '') => dispatch(requestFaq(topic, query)),
});

export default connect(mapStateToProps, mapDispatchToProps)(FaqCategoryPage);
