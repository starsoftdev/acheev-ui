// @flow

import * as React from 'react';

import Tooltip from 'components/Tooltip';

import './styles.scss';

type Props = {
  content: string,
};

const QuestionBadge = ({ content }: Props) => (
  <div className="questionBadge">
    <Tooltip
      tooltipPosition="top"
      tooltipIndicator={false}
      tooltipContent={content}
    >
      <div className="questionBadge__tooltipIcon">?</div>
    </Tooltip>
  </div>
);

export default QuestionBadge;
