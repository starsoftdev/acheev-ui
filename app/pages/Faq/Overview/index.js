// @flow

import * as React from 'react';
import { connect } from 'react-redux';
import { generate } from 'shortid';
import { List } from 'immutable';
import marked from 'utils/marked';

import FaqTopicList from 'components/Faq/TopicList';
import Preloader from 'components/Preloader';
import FaqContactUs from 'components/Faq/ContactUs';

import { requestTopics, requestSections, requestFaq } from 'pages/Faq/sagas';

import './styles.scss';

type Props = {
  questions: List<Object>,
  topics: List<Object>,
  isLoadingTopics: boolean,
  isLoadingSections: boolean,
  isLoading: boolean,
  requestFaq: Function,
  requestTopics: Function,
  requestSections: Function,
  submitFaq: Function,
};

class FaqOverviewPage extends React.Component<Props> {
  componentWillMount() {
    this.props.requestTopics();
    this.props.requestSections();
    this.props.requestFaq(null);
  }

  onFaqSubmit = payload => {
    this.props.submitFaq(payload);
  };

  render() {
    const {
      questions,
      isLoadingTopics,
      isLoadingSections,
      isLoading,
      topics,
    } = this.props;
    if (isLoading || isLoadingSections || isLoadingTopics) {
      return <Preloader />;
    }
    return (
      <div className="faqContainer">
        <div className="row">
          <div className="column small-12 medium-8 medium-offset-2">
            <h2 className="c-secondary mb-lg text-center">Topics</h2>
            <FaqTopicList topics={topics} />
          </div>
        </div>
        <div className="row">
          <div className="column small-12 medium-12 large-10 large-offset-1">
            <h2 className="c-secondary text-center mb-md">Popular Questions</h2>
            {questions.valueSeq().map(item => (
              <div className="mb-lg" key={generate()}>
                <div className="c-secondary mb-sm">{item.get('question')}</div>
                <div
                  className="contentful mb-sm"
                  dangerouslySetInnerHTML={{
                    __html: marked(item.get('answer')),
                  }}
                />
              </div>
            ))}
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
  topics: state.getIn(['faq', 'topics', 'data']),
  isLoadingTopics: state.getIn(['faq', 'topics', 'isLoading']),
  sections: state.getIn(['faq', 'sections', 'data']),
  isLoadingSections: state.getIn(['faq', 'sections', 'isLoading']),
  error: state.getIn(['faq', 'error']),
});

const mapDispatchToProps = dispatch => ({
  requestTopics: () => dispatch(requestTopics()),
  requestSections: () => dispatch(requestSections()),
  requestFaq: topic => dispatch(requestFaq(topic)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FaqOverviewPage);
