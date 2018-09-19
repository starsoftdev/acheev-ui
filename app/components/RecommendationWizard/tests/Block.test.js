import React from 'react';
import { create } from 'react-test-renderer';
import Block from 'components/RecommendationWizard/Block';

describe('<Block />', () => {
  it('should match snapshot', () => {
    const component = create(<Block label="label">This go before label</Block>);
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('should match snapshot when selected', () => {
    const component = create(
      <Block label="label" selected>
        This go before label
      </Block>
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
