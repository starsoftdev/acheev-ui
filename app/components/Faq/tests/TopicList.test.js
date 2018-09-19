import React from 'react';
import { shallow } from 'enzyme';
import TopicList from 'components/Faq/TopicList';
import Link from 'components/Link';

import { FAQ_TOPICS } from './constants';
describe('<TopicList />', () => {
  it("shouldn't throw error if no props are specified", () => {
    try {
      shallow(<TopicList />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should have same number of Link', () => {
    const renderedComponent = shallow(<TopicList topics={FAQ_TOPICS} />);
    expect(renderedComponent.find(Link)).toHaveLength(FAQ_TOPICS.size);
  });

  it('should have same number of images', () => {
    const renderedComponent = shallow(<TopicList topics={FAQ_TOPICS} />);
    expect(renderedComponent.find('img')).toHaveLength(FAQ_TOPICS.size);
  });

  it('should have correct active Link', () => {
    const renderedComponent = shallow(
      <TopicList topics={FAQ_TOPICS} activeTopic="explained" />
    );
    expect(
      renderedComponent
        .find('.faqTopic__category--active')
        .contains('Lift Explained')
    ).toEqual(true);
  });

  it('should have same number of Links for sidebar version', () => {
    const renderedComponent = shallow(
      <TopicList topics={FAQ_TOPICS} isSideBar />
    );
    expect(renderedComponent.find(Link)).toHaveLength(FAQ_TOPICS.size + 1);
  });

  it('should have home Link for sidebar version', () => {
    const renderedComponent = shallow(
      <TopicList topics={FAQ_TOPICS} activeTopic="explained" isSideBar />
    );
    expect(renderedComponent.find('.faqTopic__category--home')).toHaveLength(1);
  });

  it('should have image', () => {
    const renderedComponent = shallow(
      <TopicList topics={FAQ_TOPICS} activeTopic="explained" />
    );
    expect(
      renderedComponent
        .find('img')
        .first()
        .props().src
    ).toContain(FAQ_TOPICS.first().get('icon'));
  });
});
