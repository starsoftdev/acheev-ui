// @flow

import * as React from 'react';
import type { List } from 'immutable';
import { fromJS } from 'immutable';
import marked from 'utils/marked';
import {
  Accordion,
  AccordionItem,
} from 'react-foundation-components/lib/global/accordion';

import './styles.scss';

type Props = {
  questions: List<Object>,
  section: Object,
};

type State = {
  activeKey: string,
};

class Faq extends React.Component<Props, State> {
  state = {
    activeKey: '1',
  };
  handleSingleSelect = (activeKey: string) => {
    if (activeKey === this.state.activeKey) {
      this.setState({ activeKey: '1' });
    } else {
      this.setState({ activeKey });
    }
  };
  render() {
    const { questions, section } = this.props;
    const { activeKey } = this.state;

    if (!questions || !section) return null;

    return (
      <div className="faq">
        {questions.entrySeq().map(([key, item]) => {
          const question = item.get('question', '');
          const a = item.get('answer');
          const answers = typeof a === 'string' ? fromJS([a]) : a;
          return (
            <div className="small-12" key={key}>
              <Accordion
                activeKey={activeKey}
                onSelect={this.handleSingleSelect}
              >
                <AccordionItem eventKey={key} title={question}>
                  {answers.entrySeq().map(([answerkey, answer]) => (
                    <div
                      className="contentful"
                      key={answerkey}
                      dangerouslySetInnerHTML={{
                        __html: marked(answer),
                      }}
                    />
                  ))}
                </AccordionItem>
              </Accordion>
            </div>
          );
        })}
      </div>
    );
  }
}

export default Faq;
