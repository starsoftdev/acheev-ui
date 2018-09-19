// @flow

import * as React from 'react';

import Icon from 'components/Icon';

import Close from 'images/sprite/close-gray.svg';
import './styles.scss';

type Props = {
  name: string,
  removeCondition: Function,
};

const ConditionTag = ({ name, removeCondition }: Props) => (
  <div className="conditionTag">
    {name}
    <span
      className="conditionTag__removeButton"
      onClick={() => removeCondition(name)}
      role="button"
    >
      <Icon glyph={Close} width={10} height={10} />
    </span>
  </div>
);

export default ConditionTag;
