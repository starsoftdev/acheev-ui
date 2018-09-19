// @flow

import * as React from 'react';
import { history } from 'components/ConnectedRouter';

type Props = {
  toDo: string,
  shouldConfirm?: boolean,
  onClickLogin?: Function,
  onClickRegister?: Function,
};
const Message = ({
  toDo,
  shouldConfirm = false,
  onClickLogin,
  onClickRegister,
}: Props) => (
  <div>
    You must{' '}
    {!shouldConfirm && (
      <a
        onClick={() => {
          if (onClickLogin !== undefined) onClickLogin();
          history.push(`/login?redirect=${history.location.pathname}`);
        }}
        role="button"
      >
        Sign In&nbsp;or&nbsp;
      </a>
    )}
    {!shouldConfirm ? (
      <a
        onClick={() => {
          if (onClickRegister !== undefined) onClickRegister();
          history.push(`/register?redirect=${history.location.pathname}`);
        }}
        role="button"
      >
        Sign Up
      </a>
    ) : (
      confirm
    )}{' '}
    to {toDo}.
  </div>
);

export default Message;
