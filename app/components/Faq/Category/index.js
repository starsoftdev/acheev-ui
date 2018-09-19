// @flow

import * as React from 'react';
import { generate } from 'shortid';

import { List, fromJS, Seq } from 'immutable';

import Faq from 'components/Faq';
import {
  Accordion,
  AccordionItem,
} from 'react-foundation-components/lib/global/accordion';
import './styles.scss';

type Props = {
  sections: List<Object>,
  questions: List<Object>,
};

type State = {
  activeKey: string,
  groupedQuestions: Seq.Keyed<any, List<Object>>,
};

class FaqCategory extends React.Component<Props, State> {
  state = {
    activeKey: '1',
    groupedQuestions: fromJS({}),
  };
  componentWillMount() {
    const { questions } = this.props;
    let groupedQuestions = fromJS({});
    if (questions) {
      groupedQuestions = questions.groupBy(item => item.get('section'));
    }
    this.setState({ groupedQuestions });
  }
  handleSingleSelect = (activeKey: string) => {
    if (activeKey === this.state.activeKey) {
      this.setState({ activeKey: '1' });
    } else {
      this.setState({ activeKey });
    }
  };
  render() {
    const { sections } = this.props;
    const { activeKey, groupedQuestions } = this.state;
    return (
      <div className="faqCategory">
        {sections &&
          sections.entrySeq().map(([key, item]) => {
            const data = groupedQuestions.get(item.get('value'));
            if (!data || data.size === 0) return null;
            return (
              <Accordion
                key={generate()}
                activeKey={activeKey}
                onSelect={this.handleSingleSelect}
              >
                <AccordionItem
                  eventKey={key}
                  titleClassName="faqCategory__sectionTitle"
                  title={item.get('label')}
                >
                  <Faq questions={data} section={item} title={item} />
                </AccordionItem>
              </Accordion>
            );
          })}
      </div>
    );
  }
}

export default FaqCategory;
