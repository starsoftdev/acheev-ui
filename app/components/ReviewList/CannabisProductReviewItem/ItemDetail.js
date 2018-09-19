// @flow
import * as React from 'react';
import TagList, { TagItem } from 'components/TagList';
import ImageLabel from 'components/ImageLabel';

import IconVape from 'images/sprite/vape.svg';
import IconJoint from 'images/sprite/joint.svg';
import IconBong from 'images/sprite/bong.svg';
import IconEdibles from 'images/sprite/edibles.svg';
import IconDropper from 'images/sprite/Icon-Dropper.svg';
import IconSoftGel from 'images/sprite/Icon-Gelcap.svg';
import IconTopical from 'images/sprite/Icon-Topical.svg';
import IconSpray from 'images/sprite/Icon-Spray.svg';
import IconMorning from 'images/sprite/morning.svg';
import IconDaytime from 'images/sprite/daytime.svg';
import IconEvening from 'images/sprite/evening.svg';

import EffectSection from './EffectSection';
import './styles.scss';

const iconList = {
  vaporizer: IconVape,
  joint: IconJoint,
  bong: IconBong,
  edibles: IconEdibles,
  morning: IconMorning,
  daytime: IconDaytime,
  evening: IconEvening,
  dropper: IconDropper,
  topical: IconTopical,
  softgel: IconSoftGel,
  spray: IconSpray,
};

type Props = {
  data: Object,
  lpVersion?: boolean,
};

const ItemDetail = ({ data, lpVersion }: Props) => {
  const prescribedFor = data.get('prescribedFor')
    ? data.get('prescribedFor').toJS()
    : [];
  const symptomsHelped = data.get('symptomsHelped')
    ? data.get('symptomsHelped').toJS()
    : [];
  const positiveEffects = data.get('positiveEffects')
    ? data.get('positiveEffects').toJS()
    : [];
  const negativeEffects = data.get('negativeEffects')
    ? data.get('negativeEffects').toJS()
    : [];
  const flavours = data.get('flavours') ? data.get('flavours').toJS() : [];
  const durationOfEffect = data.get('durationOfEffect');

  const methodOfConsumption = data.get('methodOfConsumption');
  const timeOfConsumption = data.get('timeOfConsumption');
  let methodOfConsumptionIcon = null;
  let timeOfConsumptionIcon = null;

  if (methodOfConsumption) {
    methodOfConsumptionIcon = iconList[methodOfConsumption];
  }
  if (timeOfConsumption) {
    timeOfConsumptionIcon = iconList[timeOfConsumption];
  }
  return (
    <div className="cannabisProductReviewItem__itemDetail">
      {prescribedFor &&
        prescribedFor.length > 0 && (
          <div className="row mb-md">
            <div className="column">
              <div className="cannabisProductReviewItem__label mb-md">
                Conditions
              </div>
              <TagList value={prescribedFor} readOnly />
            </div>
          </div>
        )}
      <EffectSection
        data={symptomsHelped}
        title="Symptoms"
        lpVersion={lpVersion}
      />
      <EffectSection
        data={positiveEffects}
        title="Positive Effects"
        lpVersion={lpVersion}
      />
      <EffectSection
        data={negativeEffects}
        title="Negative Effects"
        lpVersion={lpVersion}
      />
      {flavours &&
        flavours.length > 0 && (
          <div className="row mb-md">
            <div className="column">
              <div className="cannabisProductReviewItem__label mb-md">
                Flavours
              </div>
              <TagList value={flavours} readOnly />
            </div>
          </div>
        )}
      <div className="row mb-md">
        {methodOfConsumptionIcon && (
          <ImageLabel
            title="Method of Consumption"
            className="column small-12 medium-4"
            icon={methodOfConsumptionIcon}
            name={methodOfConsumption}
          >
            <span className="t-capitalize">{methodOfConsumption}</span>
          </ImageLabel>
        )}

        {timeOfConsumptionIcon && (
          <ImageLabel
            title="Time of Day Consumed"
            className="column small-12 medium-4"
            icon={timeOfConsumptionIcon}
            name={timeOfConsumption}
          >
            <span className="t-capitalize">{timeOfConsumption}</span>
          </ImageLabel>
        )}

        {durationOfEffect && (
          <div className="column small-12 medium-4">
            <div className="cannabisProductReviewItem__label mb-sm">
              Duration
            </div>
            <TagItem value={durationOfEffect} readOnly />
            <strong className="fs-tn t-uppercase">Hours</strong>
          </div>
        )}
      </div>
    </div>
  );
};

export default ItemDetail;
