// @flow

import * as React from 'react';
import type { List } from 'immutable';
import { fromJS } from 'immutable';
import { generate } from 'shortid';

import marked from 'utils/marked';
import {
  Accordion,
  AccordionItem,
} from 'react-foundation-components/lib/global/accordion';

import './styles.scss';

type Props = {
  questions: List<Object>,
};

type State = {
  activeKey: string,
};

const data = fromJS([
  {
    question: `What happens after I purchase this gig? How long to get started?`,
    answer: `You will be sent an onboarding profile questionnaire(s) to complete 2.
      You will be asked to share user-names and logins 3. It takes 5 business days to get started 4.
      We prefer to work long term with clients to get a smashing ROI`,
  },
  {
    question: `Do you offer a discount if I want more than 1 month? Sure do!`,
    answer: `You will be sent an onboarding profile questionnaire(s) to complete 2.
      You will be asked to share user-names and logins 3. It takes 5 business days to get started 4.
      We prefer to work long term with clients to get a smashing ROI`,
  },
  {
    question: `What’s included in your social media posts?`,
    answer: `You will be sent an onboarding profile questionnaire(s) to complete 2.
      You will be asked to share user-names and logins 3. It takes 5 business days to get started 4.
      We prefer to work long term with clients to get a smashing ROI`,
  },
  {
    question: `What is in the 3 month premium gig? Glad you asked :)`,
    answer: `You will be sent an onboarding profile questionnaire(s) to complete 2.
      You will be asked to share user-names and logins 3. It takes 5 business days to get started 4.
      We prefer to work long term with clients to get a smashing ROI`,
  },
  {
    question: `I have more questions?`,
    answer: `You will be sent an onboarding profile questionnaire(s) to complete 2.
      You will be asked to share user-names and logins 3. It takes 5 business days to get started 4.
      We prefer to work long term with clients to get a smashing ROI`,
  },
]);

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
    const { questions } = this.props;
    const { activeKey } = this.state;

    return (
      <div className="faq">
        <div className="faq__titleWrapper">
          <h1 className="faq__title">Frequently Asked Questions</h1>
        </div>
        {data.map((item, key) => {
          const question = item.get('question', '');
          const a = item.get('answer');
          const answers = typeof a === 'string' ? fromJS([a]) : a;
          return (
            <div className="small-12" key={generate()}>
              <Accordion
                activeKey={activeKey}
                onSelect={this.handleSingleSelect}
              >
                <AccordionItem eventKey={key} title={question}>
                  {answers.entrySeq().map(([answerkey, answer]) => (
                    <div
                      className="faq__contentful"
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
