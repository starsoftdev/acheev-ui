// @flow

import * as React from 'react';
import cx from 'classnames';

import Icon from 'components/Icon';

import IconClose from 'images/sprite/close.svg';

import './styles.scss';

type Props = {
  value: string | number | { name: string },
  readOnly?: boolean,
  className?: string,
  onRemove?: Function,
};

const TagItem = ({ value, readOnly = false, onRemove, className }: Props) => {
  const mergedClassName = cx('tagItem', className);
  if (!value) return null;
  return (
    <div className={mergedClassName}>
      <div className="tagItem__label">
        {typeof value === 'object' ? value.name : String(value)}
      </div>
      {readOnly === false && (
        <Icon
          glyph={IconClose}
          size={10}
          className="tagItem__close"
          onClick={() => {
            if (onRemove) {
              onRemove();
            }
          }}
        />
      )}
    </div>
  );
};

export default TagItem;
