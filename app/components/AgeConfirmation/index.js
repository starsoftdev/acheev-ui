// @flow
import * as React from 'react';
import storage from 'store';
import { Switch, Route } from 'react-router-dom';
import { history } from 'components/ConnectedRouter';

import AgeConfirmationModal from './AgeConfirmationModal';

type Props = {
  user: Object,
};

type State = {
  shouldAsk: boolean,
};

export default class AgeConfirmation extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      shouldAsk: !storage.get('wasAgeConfirmed') && !props.user,
    };
  }

  handleYesAnswer = () => {
    storage.set('wasAgeConfirmed', true);
    this.setState({ shouldAsk: false });
  };

  handleNoAnswer = () => {
    history.goBack();
  };

  render() {
    return (
      <Switch>
        <Route path="/terms-and-conditions" />
        <Route path="/privacy" />
        <Route
          render={() => (
            <AgeConfirmationModal
              isOpen={this.state.shouldAsk}
              onYesAnswer={this.handleYesAnswer}
              onNoAnswer={this.handleNoAnswer}
            />
          )}
        />
      </Switch>
    );
  }
}
