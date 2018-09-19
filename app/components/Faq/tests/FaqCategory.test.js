import React from 'react';
import { shallow } from 'enzyme';
import FaqCategory from 'components/Faq/Category';
import Faq from 'components/Faq';
import {
  Accordion,
  AccordionItem,
} from 'react-foundation-components/lib/global/accordion';

import { FAQ_QUESTIONS, FAQ_SECTIONS } from './constants';

describe('<FaqCategory />', () => {
  it("shouldn't throw error if no props are specified", () => {
    try {
      shallow(<FaqCategory />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should have same number of sections of non-zero questions', () => {
    const renderedComponent = shallow(
      <FaqCategory questions={FAQ_QUESTIONS} sections={FAQ_SECTIONS} />
    );
    const groupedQuestions = FAQ_QUESTIONS.groupBy(item => item.get('section'));
    expect(renderedComponent.find(Accordion)).toHaveLength(
      groupedQuestions.size
    );
    expect(renderedComponent.find(AccordionItem)).toHaveLength(
      groupedQuestions.size
    );
    expect(renderedComponent.find(Faq)).toHaveLength(groupedQuestions.size);
  });
});
