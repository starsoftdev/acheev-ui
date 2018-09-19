// @flow

import React, { Component } from 'react';
import Icon from 'components/Icon';
import transformString from 'utils/transformString';

import IconVape from 'images/sprite/vape.svg';
import IconJoint from 'images/sprite/joint.svg';
import IconBong from 'images/sprite/bong.svg';
import IconEdibles from 'images/sprite/edibles.svg';
import IconMorning from 'images/sprite/morning.svg';
import IconDaytime from 'images/sprite/daytime.svg';
import IconEvening from 'images/sprite/evening.svg';
import IconClock from 'images/sprite/Icon-Clock.svg';

import EffectPane from './EffectPane';
import ConditionPane from './ConditionPane';
import LeftBorderedPane from './LeftBorderedPane';
import './styles.scss';

const iconList = {
  vaporizer: IconVape,
  joint: IconJoint,
  bong: IconBong,
  edibles: IconEdibles,
  morning: IconMorning,
  daytime: IconDaytime,
  evening: IconEvening,
  clock: IconClock,
};

type Props = {
  data: Object,
};

class ProductMeta extends Component<Props> {
  render() {
    const { data } = this.props;
    const topEffects = data.get('topEffects');
    const topPrescribedFor = data.get('topPrescribedFor');
    const topFlavours = data.get('topFlavours');
    const avgDurationOfEffect = data.get('avgDurationOfEffect');
    const topMethodOfConsumption = transformString(
      data.getIn(['topMethodOfConsumption', '0'])
    );
    const topTimeOfConsumption = transformString(
      data.getIn(['topTimeOfConsumption', '0'])
    );

    return (
      <div className="productMeta">
        <div className="row">
          <div className="column small-12 medium-12 large-6 mb-md">
            <EffectPane data={topEffects} />
          </div>
          <div className="column small-12 medium-6 large-3 mb-md">
            <ConditionPane
              className="mb-md green first"
              title="Commonly prescribed for"
              data={topPrescribedFor}
            />
            <ConditionPane
              className="mb-md green second"
              title="Flavours"
              data={topFlavours}
            />
          </div>
          <div className="column small-12 medium-6 large-3 mb-md">
            <LeftBorderedPane>
              <div className="row">
                <div className="column shrink">
                  <div className="productMeta__iconContainer">
                    {avgDurationOfEffect ? (
                      <Icon glyph={iconList.clock} size={60} />
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
                <div className="column">
                  <div className="productMeta__paneTitle c-secondary">
                    Average duration of effect
                  </div>
                  <div className="fs-md">
                    {avgDurationOfEffect
                      ? `${avgDurationOfEffect} hours`
                      : 'N/A'}
                  </div>
                </div>
              </div>
            </LeftBorderedPane>
            <LeftBorderedPane>
              <div className="row">
                <div className="column shrink">
                  <div className="productMeta__iconContainer">
                    {topMethodOfConsumption &&
                    iconList[topMethodOfConsumption] ? (
                      <Icon
                        glyph={iconList[topMethodOfConsumption]}
                        size={60}
                      />
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
                <div className="column">
                  <div className="productMeta__paneTitle c-secondary">
                    Top method of consumption
                  </div>
                  <div className="fs-md t-capitalize">
                    {topMethodOfConsumption || 'N/A'}
                  </div>
                </div>
              </div>
            </LeftBorderedPane>
            <LeftBorderedPane>
              <div className="row">
                <div className="column shrink">
                  <div className="productMeta__iconContainer">
                    {topTimeOfConsumption && iconList[topTimeOfConsumption] ? (
                      <Icon glyph={iconList[topTimeOfConsumption]} size={60} />
                    ) : (
                      'N/A'
                    )}
                  </div>
                </div>
                <div className="column">
                  <div className="productMeta__paneTitle c-secondary">
                    Top time of consumption
                  </div>
                  <div className="fs-md t-capitalize">
                    {topTimeOfConsumption || 'N/A'}
                  </div>
                </div>
              </div>
            </LeftBorderedPane>
          </div>
        </div>
      </div>
    );
  }
}

export default ProductMeta;
