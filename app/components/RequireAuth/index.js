// @flow

import React, { Component } from 'react';
import { toastr } from 'react-redux-toastr';

import Message from './Message';

type Props = {
  toDo: string,
  shouldConfirm?: boolean,
  onClickLogin?: Function,
  onClickRegister?: Function,
  children?: any,
};

class RequireAuth extends Component<Props> {
  render() {
    const { toDo, shouldConfirm } = this.props;
    const toastrOptions = {
      timeOut: 0,
      component: (
        <Message
          toDo={toDo}
          shouldConfirm={shouldConfirm}
          onClickLogin={this.props.onClickLogin}
          onClickRegister={this.props.onClickRegister}
        />
      ),
    };
    return (
      <div onClick={() => toastr.info('', '', toastrOptions)} role="button">
        {this.props.children}
      </div>
    );
  }
}

export default RequireAuth;
