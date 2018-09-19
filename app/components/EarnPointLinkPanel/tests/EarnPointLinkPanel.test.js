import React from 'react';
import { shallow } from 'enzyme';
import Link from 'components/Link';

import IconProfile from 'images/sprite/profile-white.svg';
import Icon from 'components/Icon';
import EarnPointLinkPanel from 'components/EarnPointLinkPanel';

describe('<EarnPointLinkPanel />', () => {
  it("shouldn't throw error if no props are specified", () => {
    try {
      shallow(<EarnPointLinkPanel />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should render correct information for all props.', () => {
    const renderedComponent = shallow(
      <EarnPointLinkPanel
        icon={IconProfile}
        to="/me"
        title="Complete your profile"
        point={200}
        buttonTitle="Complete profile"
      >
        Hello
      </EarnPointLinkPanel>
    );

    expect(
      renderedComponent
        .find('.earnRewardsLinkPanel__title')
        .contains('Complete your profile')
    ).toEqual(true);
    expect(
      renderedComponent.find('.earnRewardsLinkPanel__points').contains(200)
    ).toEqual(true);
    expect(renderedComponent.find(Link).contains('Complete profile')).toEqual(
      true
    );
    expect(renderedComponent.find(Link).prop('to')).toEqual('/me');
    expect(renderedComponent.find(Icon).prop('glyph')).toEqual(IconProfile);
    expect(renderedComponent.contains('Hello')).toEqual(true);
  });
});
