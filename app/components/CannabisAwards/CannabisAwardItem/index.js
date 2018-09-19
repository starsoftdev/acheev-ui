// @flow

import * as React from 'react';
import cx from 'classnames';

import Icon from 'components/Icon';
import IconGold from 'images/sprite/1.svg';
import IconSilver from 'images/sprite/2.svg';
import IconBronze from 'images/sprite/3.svg';
import './styles.scss';

const iconList = {
  gold: IconGold,
  silver: IconSilver,
  bronze: IconBronze,
};

type Props = {
  data: Object,
};

const CannabisAwards = ({ data }: Props) => {
  if (!data) return null;
  const name = data.get('name');
  const tier = data.get('tier');
  const year = data.get('year');
  return (
    <div className="cannabisAwardItem">
      <div className="cannabisAwardItem__iconContainer mr-md">
        {tier && (
          <Icon
            glyph={iconList[tier]}
            size={40}
            className={cx(
              'cannabisAwardItem__icon',
              `cannabisAwardItem__icon--${tier}`
            )}
          />
        )}
      </div>
      <div className="cannabisAwardItem__labelContainer">
        <div className="cannabisAwardItem__label">{`${year} ${tier}`}</div>
        <div className="cannabisAwardItem__label">
          <strong>{`${name}`}</strong>
        </div>
      </div>
    </div>
  );
};

export default CannabisAwards;
