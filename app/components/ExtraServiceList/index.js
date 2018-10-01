// @flow

import React, { Component } from 'react';
import { generate } from 'shortid';
import { cloneDeep } from 'lodash-es';
import update from 'immutability-helper';

import Button from 'components/Button';
import Icon from 'components/Icon';
import IconClose from 'images/sprite/close.svg';

type Props = {
  value: Array<Object>,
  onChange?: Function,
};

type State = {
  value: Array<Object>,
};

class ExtraServiceList extends Component<Props, State> {
  static getDerivedStateFromProps(props: Props) {
    return {
      value: props.value,
    };
  }
  state = {
    value: [],
  };
  addNewExtra = () => {
    this.setState(state => ({
      value: [
        ...state.value,
        {
          description: '',
          price: 0,
          key: generate(),
        },
      ],
    }));
  };
  removeExtra = index => {
    const newValue = cloneDeep(this.state.value);
    newValue.splice(index, 1);
    this.setState({ value: newValue });
  };
  updateServiceText = (value, index) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(
        update(this.state.value, {
          [index]: { $merge: { description: value } },
        })
      );
    }
  };
  updateServicePrice = (value, index) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(
        update(this.state.value, {
          [index]: { $merge: { price: value } },
        })
      );
    }
  };
  render() {
    const { value } = this.state;
    return (
      <div className="extraServiceList">
        {value &&
          value.map((service, index) => (
            <div className="row align-middle mb-sm" key={service.key}>
              <div className="column large-8">
                <input
                  type="text"
                  className="accent"
                  value={service.description}
                  placeholder="Enter the extra service description"
                  onChange={e => this.updateServiceText(e.target.value, index)}
                />
              </div>
              <div className="column large-3">
                <input
                  type="number"
                  className="accent text-right"
                  value={service.price}
                  onChange={e => this.updateServicePrice(e.target.value, index)}
                />
              </div>
              <div className="column shrink">
                <Icon
                  glyph={IconClose}
                  size={16}
                  onClick={() => this.removeExtra(index)}
                />
              </div>
            </div>
          ))}
        <div className="row">
          <div className="column">
            <Button className="small bg-gradient" onClick={this.addNewExtra}>
              Add extra
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ExtraServiceList;
