// @flow

import * as React from 'react';
import SearchField from 'components/SearchField';

type Props = {
  onSearch: Function,
};

type State = {
  searchValue: string,
};

class FaqSearch extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      searchValue: '',
    };
    this.typingTimeout = 0;
  }

  onInputChange = (value: string) => {
    if (this.typingTimeout) {
      clearTimeout(this.typingTimeout);
    }
    const timeoutId = setTimeout(() => {
      this.props.onSearch(this.state.searchValue);
    }, 500);
    this.setState({
      searchValue: value,
    });
    this.typingTimeout = timeoutId;
  };
  typingTimeout: number;
  render() {
    return (
      <div className="row">
        <div className="column small-12 medium-8 medium-offset-2">
          <h2>FAQs</h2>
          <SearchField
            className="global"
            onChange={this.onInputChange}
            defaultValue={this.state.searchValue}
            placeholder="Start typing a question"
          />
        </div>
      </div>
    );
  }
}

export default FaqSearch;
