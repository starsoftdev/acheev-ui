// @flow

import * as React from 'react';
import moment from 'moment';
import cx from 'classnames';

import './styles.scss';

type Props = {
  transaction: Object,
};

const Transaction = ({ transaction }: Props) => (
  <div className="transaction row" key={transaction.get('_id')}>
    <div className="column medium-3">
      {moment(transaction.get('createdOn')).format('DD/MM/YYYY')}
    </div>
    <div className="column medium-7">{transaction.get('memo')}</div>
    <div
      className={cx('column medium-2', {
        transaction__creditAmount: transaction.get('type') === 'credit',
        transaction__debitAmount: transaction.get('type') === 'debit',
      })}
    >
      {transaction.get('type') === 'credit' ? '+ ' : '- '}
      {transaction.get('amount')}
    </div>
  </div>
);

export default Transaction;
