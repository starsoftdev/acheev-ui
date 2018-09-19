// @flow

import React, { Component } from 'react';
import type { Map } from 'immutable';
import formatDate from 'utils/formatDate';
import moment from 'moment';
import CopyToClipboard from 'react-copy-to-clipboard';
import cx from 'classnames';

import FormModal from 'components/FormModal';
import Link from 'components/Link';
import Label from 'components/Label';
import Tooltip from 'components/Tooltip';
import marked from 'utils/marked';

import './styles.scss';

type Props = {
  reward: Map<string, *>,
  code?: string,
  unlockReward?: Function,
  onCopy?: Function,
  className?: string,
  userPointsBalance?: number,
};

class RewardCard extends Component<Props> {
  render() {
    const {
      reward,
      code,
      unlockReward,
      onCopy,
      className,
      userPointsBalance,
    } = this.props;
    const price = reward.get('price', '');
    const hasEnoughPoints = userPointsBalance >= price;
    const formModalLinkText = reward.get('outOfStock', '')
      ? 'Out of Stock'
      : 'Unlock';
    const buttonClassName = cx(
      'small',
      hasEnoughPoints ? 'secondary' : 'light'
    );
    const unlockModal = (
      <FormModal
        linkText={formModalLinkText}
        textIsButton
        buttonClassName={buttonClassName}
        unlockFunction={
          hasEnoughPoints && unlockReward
            ? () => unlockReward(reward)
            : undefined
        }
        title="Lift Rewards™"
        isOpen={false}
      >
        {hasEnoughPoints ? (
          <div>
            <p>Unlock this {reward.getIn(['business', 'name'], '')} Reward?</p>
            <p>
              This will cost you <strong>{reward.get('price', '')}</strong> Lift
              Points. Your Reward code will appear under Unlocked Rewards.
            </p>
          </div>
        ) : (
          <p>You don&apos;t have enough points to unlock this reward</p>
        )}
      </FormModal>
    );
    const outOfStockBtn = (
      <a className="rewardCard__outOfStockButton">Out of Stock</a>
    );
    const unlockButton = reward.get('outOfStock', '')
      ? outOfStockBtn
      : unlockModal;
    const mergedClassName = cx('rewardCard', className);
    return (
      <div className={mergedClassName} key={reward.get('id', '')}>
        <div className="rewardCard__inner">
          <div className="row">
            <div className="small-12 medium-3 mb-sm text-center">
              <img
                className="rewardCard__thumbnailImage"
                src={reward.get('thumbnail', '')}
                alt="Rewards"
              />
            </div>
            <div className="medium-9 column">
              <div className="row align-middle">
                {moment(new Date()).diff(reward.get('createdOn', ''), 'days') <
                  21 && (
                  <div className="small-12 medium-shrink column npr small-only-text-center mb-sm">
                    <Label className="rewardCard__thumbnailLabel warning">
                      New
                    </Label>
                  </div>
                )}
                <div className="column mb-sm small-only-text-center">
                  <h4 className="rewardCard__title">
                    {reward.get('title', '')}
                  </h4>
                </div>
              </div>
              <div className="rewardCard__subtitle mb-sm small-only-text-center">
                at&nbsp; &nbsp;
                <Link
                  className="rewardCard__link"
                  to={reward.getIn(['business', 'website'], '')}
                  target="_blank"
                >
                  {reward.getIn(['business', 'name'], '')}
                </Link>
              </div>
              <div
                className="row column"
                dangerouslySetInnerHTML={{
                  __html: marked(reward.get('description', '')),
                }}
              />
              <div className="row align-middle">
                <div className="small-12 medium-expand column small-only-text-center">
                  <div className="rewardCard__subtitle row align-middle mb-sm">
                    <div className="small-12 medium-shrink column">
                      <strong>Expires:</strong>{' '}
                      {formatDate(reward.get('expiresOn', ''))}.
                    </div>
                    <div className="small-12 medium-shrink column">
                      <FormModal
                        linkClassName="rewardCard__link"
                        linkText="How to redeem"
                        textIsButton={false}
                        title="Lift Rewards™"
                        isOpen={false}
                      >
                        <div>
                          <p>{reward.get('details', '')}</p>
                          <p>{reward.get('terms', '')}</p>
                        </div>
                      </FormModal>
                    </div>
                  </div>
                </div>
                <div className="small-12 medium-shrink column mb-sm">
                  {code ? (
                    <div className="row align-middle">
                      <div className="shrink column npr">
                        <div className="rewardCard__subtitle">
                          Code&nbsp; &nbsp;<span className="rewardCard__code">
                            {code}
                          </span>
                        </div>
                      </div>
                      <div className="shrink column">
                        <Tooltip
                          tooltipPosition="top"
                          tooltipIndicator
                          tooltipContent="Copy code"
                        >
                          <CopyToClipboard
                            text={code}
                            onCopy={() => onCopy && onCopy(code)}
                          >
                            <div>&#x2398;</div>
                          </CopyToClipboard>
                        </Tooltip>
                      </div>
                    </div>
                  ) : (
                    <div className="row align-middle">
                      <div className="small-expand medium-shrink column c-secondary">
                        {price === 0 ? 'FREE' : `${price} pts`}
                      </div>
                      <div className="shrink column">{unlockButton}</div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default RewardCard;
