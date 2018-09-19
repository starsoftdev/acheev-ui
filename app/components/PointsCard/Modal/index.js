// @flow

import React, { Component } from 'react';
import ReactModal from 'react-modal';
import { List, Map } from 'immutable';
import moment from 'moment';

import Pagination from 'components/Pagination';
import Icon from 'components/Icon';
import IconClose from 'images/sprite/close.svg';

import Transaction from './Transaction';

import './styles.scss';

type Props = {
  transactions: List<Map<*, *>>,
  isOpen?: boolean,
  onCloseModal?: Function,
};

type State = {
  isOpen: boolean,
  page: number,
};

class PointHistoryModal extends Component<Props, State> {
  constructor(props: Object) {
    super();
    this.state = {
      isOpen: props.isOpen,
      page: 1,
    };
  }
  componentWillReceiveProps(newProps: Object) {
    this.setState({ isOpen: newProps.isOpen });
  }
  closeModal = () => {
    this.setState({ isOpen: false });
    if (this.props.onCloseModal) this.props.onCloseModal();
  };

  render() {
    if (!this.props.transactions) {
      return null;
    }
    const afterOpenFn = () => {
      this.setState({ page: 1 });
    };

    const sortedTransactions = this.props.transactions.sort(
      (value1, value2) =>
        moment(value2.get('createdOn')).valueOf() -
        moment(value1.get('createdOn')).valueOf()
    );
    const transactions = sortedTransactions.slice(
      (this.state.page - 1) * 10,
      this.state.page * 10
    );
    return (
      <ReactModal
        shouldCloseOnOverlayClick
        isOpen={this.state.isOpen}
        onAfterOpen={afterOpenFn}
        onRequestClose={() => this.closeModal()}
        closeTimeoutMS={0}
        className="pointHistoryModal__content small-12 columns"
        overlayClassName="pointHistoryModal row-fluid"
        contentLabel="pointHistoryModal"
      >
        <Icon
          glyph={IconClose}
          size={16}
          className="pointHistoryModal__closeButton"
          onClick={() => this.closeModal()}
        />
        <div className="row mt-md">
          <div className="small-12 columns">
            <h2>Point history</h2>
          </div>
        </div>
        <div className="pointHistoryModal__header row">
          <div className="column medium-3">Date</div>
          <div className="column medium-7">Memo</div>
          <div className="column medium-2">Amount</div>
        </div>
        {transactions.map(transaction => (
          <Transaction transaction={transaction} key={transaction.get('_id')} />
        ))}
        <div className="mt-md">
          <Pagination
            pageCount={Math.ceil(this.props.transactions.size / 10)}
            onPageChange={e => this.setState({ page: e })}
          />
        </div>
      </ReactModal>
    );
  }
}

export default PointHistoryModal;
