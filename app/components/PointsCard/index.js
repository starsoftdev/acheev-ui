// @flow

import React, { Component } from 'react';
import type { Map, List } from 'immutable';

import Icon from 'components/Icon';
import Link from 'components/Link';

import PointsIcon from 'images/sprite/diamond.svg';

import PointHistoryModal from './Modal';
import './styles.scss';

type Props = {
  userLiftPoints: string,
  transactions: List<Map<*, *>>,
};
type State = {
  isModalOpen: boolean,
};

class PointsCard extends Component<Props, State> {
  state = {
    isModalOpen: false,
  };
  onCloseModal = () => {
    this.setState({
      isModalOpen: false,
    });
  };
  render() {
    const { userLiftPoints, transactions } = this.props;
    return (
      <div className="pointsCard">
        <h4 className="pointsCard__title">My Lift Points</h4>
        <div className="pointsCard__body">
          <div className="row align-middle mb-sm">
            <div className="shrink column npr">
              <Icon glyph={PointsIcon} size={35} />
            </div>
            <div className="shrink column">
              <div className="pointsCard__points">{userLiftPoints} pts</div>
            </div>
          </div>
          <Link
            className="pointsCard__link"
            onClick={() => this.setState({ isModalOpen: true })}
          >
            View my point history
          </Link>
          <PointHistoryModal
            transactions={transactions}
            isOpen={this.state.isModalOpen}
            onCloseModal={this.onCloseModal}
          />
        </div>
      </div>
    );
  }
}

export default PointsCard;
