import React from 'react';
import { shallow } from 'enzyme';
import { fromJS } from 'immutable';
import ItemList from 'components/Banner/FeatureList/ItemList';
import Icon from 'components/Icon';
import UserIcon from 'images/sprite/user.svg';
import RecommendIcon from 'images/sprite/recommend.svg';
import ReviewsIcon from 'images/sprite/product-reviews.svg';
const data = fromJS([
  {
    icon: UserIcon,
    title: '1,000,000',
    subTitle: 'Anual users',
  },
  {
    icon: ReviewsIcon,
    title: '50,000',
    subTitle: 'Product reviews',
  },
  {
    icon: RecommendIcon,
    title: '9/10 Users',
    subTitle: 'Recommend Lift & Co.',
  },
]);

describe('<ItemList />', () => {
  it('should render 3 icons', () => {
    const renderedComponent = shallow(<ItemList data={data} />);
    expect(renderedComponent.find(Icon).length).toEqual(3);
  });
  it('should render correct Icons', () => {
    const renderedComponent = shallow(<ItemList data={data} />);
    expect(renderedComponent.find(Icon).get(0).props.glyph).toEqual(
      data.getIn([0, 'icon'])
    );
    expect(renderedComponent.find(Icon).get(1).props.glyph).toEqual(
      data.getIn([1, 'icon'])
    );
    expect(renderedComponent.find(Icon).get(2).props.glyph).toEqual(
      data.getIn([2, 'icon'])
    );
  });
  it('should render correct titles and sub titles', () => {
    const renderedComponent = shallow(<ItemList data={data} />);
    expect(renderedComponent.contains(data.getIn([0, 'title']))).toEqual(true);
    expect(renderedComponent.contains(data.getIn([1, 'title']))).toEqual(true);
    expect(renderedComponent.contains(data.getIn([2, 'title']))).toEqual(true);
    expect(renderedComponent.contains(data.getIn([0, 'subTitle']))).toEqual(
      true
    );
    expect(renderedComponent.contains(data.getIn([1, 'subTitle']))).toEqual(
      true
    );
    expect(renderedComponent.contains(data.getIn([2, 'subTitle']))).toEqual(
      true
    );
  });
});
