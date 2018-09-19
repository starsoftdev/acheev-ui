// @flow

import * as React from 'react';
import type { Map } from 'immutable';

import pluralizeCategory from 'utils/pluralizeCategory';

import DropdownMenu from 'components/DropdownMenu';
import Icon from 'components/Icon';
import Link from 'components/Link';
import RelativePortal from 'react-relative-portal';

import ChevronDown from 'images/sprite/chevron-down.svg';

import './styles.scss';

type Props = {
  data: Map<*, *>,
};

type State = {
  isDropdownOpen: boolean,
};

class LpProductListDropDown extends React.Component<Props, State> {
  state = {
    isDropdownOpen: false,
  };
  onClick = () => {
    this.setState({ isDropdownOpen: !this.state.isDropdownOpen });
  };
  onClose = () => {
    this.setState({ isDropdownOpen: false });
  };
  render() {
    const { data } = this.props;
    const category = pluralizeCategory(data.get('__t'));
    const id = data.get('id');
    return (
      <DropdownMenu
        toggle={
          <Icon
            className="lpProductList__chevron"
            glyph={ChevronDown}
            onClick={this.onClick}
          />
        }
        isOpen={this.state.isDropdownOpen}
        close={this.onClose}
      >
        <RelativePortal component="div" left={-20} top={0}>
          <ul className="lpProductList__dropdown">
            <li className="lpProductList__dropdownItem">
              <Link
                className="lpProductList__dropdownLink"
                to={`/${category}/${data.get('slug')}`}
              >
                View
              </Link>
            </li>
            <li className="lpProductList__dropdownItem">
              <Link
                className="lpProductList__dropdownLink"
                to={`/lp/products/${category}/${id}/edit`}
              >
                Edit
              </Link>
            </li>
          </ul>
        </RelativePortal>
      </DropdownMenu>
    );
  }
}

export default LpProductListDropDown;
