// @flow

import React, { Component } from 'react';
import { Dropdown } from 'react-foundation-components/lib/global/dropdown';

import './styles.scss';

type Props = {
  dropdownContent: any,
  children?: any,
};

class DropdownComponent extends Component<
  Props,
  {
    show: boolean,
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  componentDidMount() {
    window.addEventListener('click', this.handleOutsideClick);
  }

  componentWillUnmount() {
    window.removeEventListener('click', this.handleOutsideClick);
  }

  handleOutsideClick = () => this.setState({ show: false });
  handleToggle = (e: Object) => {
    this.setState({ show: !this.state.show });
    e.stopPropagation();
  };

  render() {
    const { children, dropdownContent } = this.props;
    return (
      <div className="dropdown">
        <div
          className="dropdown__toggle"
          onClick={this.handleToggle}
          role="button"
        >
          {children}
        </div>
        {this.state.show && (
          <Dropdown onClick={this.handleToggle}>{dropdownContent}</Dropdown>
        )}
      </div>
    );
  }
}

export default DropdownComponent;
