import React from 'react';
import { shallow } from 'enzyme';
import Faq from 'components/Faq';
import {
  Accordion,
  AccordionItem,
} from 'react-foundation-components/lib/global/accordion';

import { FAQ_QUESTIONS, FAQ_SECTION } from './constants';

describe('<Faq />', () => {
  it("shouldn't throw error if no props are specified", () => {
    try {
      shallow(<Faq />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should have same number of questions and answers', () => {
    const renderedComponent = shallow(
      <Faq questions={FAQ_QUESTIONS} section={FAQ_SECTION} />
    );
    expect(renderedComponent.find(Accordion)).toHaveLength(FAQ_QUESTIONS.size);
    expect(renderedComponent.find(AccordionItem)).toHaveLength(
      FAQ_QUESTIONS.size
    );
  });
});
