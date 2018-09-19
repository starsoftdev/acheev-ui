import React from 'react';
import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';
import { fromJS } from 'immutable';

import GlobalSearch from 'components/GlobalSearch';

const data = fromJS({
  advice: [
    {
      createdOn: '2017-10-04T06:52:22.557Z',
      score: 0.5833333333333334,
      item: {
        name: 'Hey canada post messed up, which made me wonder...',
        ref: '57ff92928b999fa13a17b32f',
      },
      __v: 0,
      _id: '59d48526517e554b342dc63b',
      updatedOn: '2017-10-04T06:52:22.557Z',
      link:
        'https://lift.co/forum/laws-and-regulations/hey-canada-post-messed-up-which-made-me-wonder',
      id: '59d48526517e554b342dc63b',
      category: 'advice',
    },
    {
      createdOn: '2017-10-04T06:52:22.236Z',
      score: 0.5294117647058824,
      item: {
        name:
          'Hey everyone, just thought you should know that when you write a review, your user name &amp; member bio information is released to the public via google',
        ref: '56b93dc1569880a977f72502',
      },
      __v: 0,
      _id: '59d48526517e554b342dc511',
      updatedOn: '2017-10-04T06:52:22.236Z',
      link:
        'https://lift.co/forum/laws-and-regulations/hey-everyone-just-thought-you-should-know-that-when-you-write-a-review-your-user-name-amp-member-bio-information-is-released-to-the-public-via-google',
      id: '59d48526517e554b342dc511',
      category: 'advice',
    },
  ],
});
const filter = fromJS({
  query: {
    q: 'hey',
  },
});

describe('<GlobalSearch />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<GlobalSearch />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('submitFunction should be fired when `GlobalSearch__submitButton` is clicked', () => {
    const spy = jest.fn();
    const renderedComponent = shallow(
      <GlobalSearch requestGlobalSearch={spy} />
    );
    renderedComponent.find('SearchField').simulate('change');
    setTimeout(() => expect(spy).toHaveBeenCalled());
  });

  it('submitFunction should be fired when `GlobalSearch__submitButton` is clicked', () => {
    const renderedComponent = shallow(<GlobalSearch isLoading />);
    renderedComponent.find('SearchField').simulate('change');
    expect(renderedComponent.find('Preloader').length).toEqual(1);
  });

  it('renders `data` and `filter` if provided', () => {
    const component = create(<GlobalSearch data={data} filter={filter} />);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
