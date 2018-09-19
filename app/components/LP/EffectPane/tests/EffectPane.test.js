import React from 'react';
import { shallow } from 'enzyme';
import { create } from 'react-test-renderer';
import { fromJS } from 'immutable';

import EffectPane from 'components/LP/EffectPane';

const data = fromJS({
  symptomsHelped: [
    {
      name: 'anxiety',
      score: '5.0',
      product: {
        _id: '5a39d75968ab9f3e45b98d89',
        slug: 'green-relief-low-tide-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Low Tide',
        __t: 'Strain',
      },
    },
    {
      name: 'back pain',
      score: '2.5',
      product: {
        _id: '5a39d50668ab9f3e45b98d71',
        slug: 'green-relief-tsunami-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Tsunami',
        __t: 'Strain',
      },
    },
    {
      name: 'appetite',
      score: '2.0',
      product: {
        _id: '5a39d75968ab9f3e45b98d89',
        slug: 'green-relief-low-tide-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Low Tide',
        __t: 'Strain',
      },
    },
  ],
  positiveEffects: [
    {
      name: 'anti-anxiety',
      score: '5.0',
      product: {
        _id: '5a39d75968ab9f3e45b98d89',
        slug: 'green-relief-low-tide-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Low Tide',
        __t: 'Strain',
      },
    },
    {
      name: 'appetite',
      score: '5.0',
      product: {
        _id: '5a39d50668ab9f3e45b98d71',
        slug: 'green-relief-tsunami-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Tsunami',
        __t: 'Strain',
      },
    },
    {
      name: 'sleepy',
      score: '1.0',
      product: {
        _id: '5a39d53468ab9f3e45b98d73',
        slug: 'green-relief-ripple-effect-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Ripple Effect',
        __t: 'Strain',
      },
    },
  ],
  negativeEffects: [
    {
      name: 'harsh',
      score: '7.0',
      product: {
        _id: '5a39d53468ab9f3e45b98d73',
        slug: 'green-relief-ripple-effect-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Ripple Effect',
        __t: 'Strain',
      },
    },
    {
      name: 'chest congestion',
      score: '7.0',
      product: {
        _id: '5a39d53468ab9f3e45b98d73',
        slug: 'green-relief-ripple-effect-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Ripple Effect',
        __t: 'Strain',
      },
    },
    {
      name: 'coughing',
      score: '6.0',
      product: {
        _id: '5a39d53468ab9f3e45b98d73',
        slug: 'green-relief-ripple-effect-strain',
        business: '58c0bdd4bdabcfc75b4112a4',
        name: 'Ripple Effect',
        __t: 'Strain',
      },
    },
  ],
});

const emptyData = fromJS({
  negativeEffects: [],
  positiveEffects: [],
  symptomsHelped: [],
});

describe('<EffectPane />', () => {
  it("shouldn't throw error if data is not specified", () => {
    try {
      shallow(<EffectPane />);
    } catch (error) {
      expect(error).toBeUndefined();
    }
  });

  it('should render `message` if empty data is provided', () => {
    const renderedComponent = shallow(
      <EffectPane data={emptyData} message="Hey" />
    );
    expect(renderedComponent.contains('Hey')).toEqual(true);
  });

  it('should match snapshoot', () => {
    const component = create(
      <EffectPane data={data} progressBar="ProgressBar" />
    );
    const tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
