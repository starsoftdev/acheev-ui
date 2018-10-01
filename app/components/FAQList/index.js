// @flow

import React, { Component, Fragment } from 'react';
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

class FAQList extends Component<Props, State> {
  static getDerivedStateFromProps(props: Props) {
    return {
      value: props.value,
    };
  }
  state = {
    value: [],
  };
  addNew = () => {
    this.setState(state => ({
      value: [
        ...state.value,
        {
          question: '',
          answer: '',
          key: generate(),
        },
      ],
    }));
  };
  remove = index => {
    const newValue = cloneDeep(this.state.value);
    newValue.splice(index, 1);
    this.setState({ value: newValue });
  };
  updateQuestion = (value, index) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(
        update(this.state.value, {
          [index]: { $merge: { question: value } },
        })
      );
    }
  };
  updateAnswer = (value, index) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(
        update(this.state.value, {
          [index]: { $merge: { answer: value } },
        })
      );
    }
  };
  render() {
    const { value } = this.state;
    return (
      <div className="faqList">
        {value &&
          value.map((item, index) => (
            <Fragment key={item.key}>
              <div className="row align-middle mb-sm">
                <div className="column expand">
                  <input
                    type="text"
                    className="accent"
                    value={item.question}
                    placeholder="Add a Question: i.e. Do you translate to English as well?"
                    onChange={e => this.updateQuestion(e.target.value, index)}
                  />
                </div>
                <div className="column shrink">
                  <Icon
                    glyph={IconClose}
                    size={16}
                    onClick={() => this.remove(index)}
                  />
                </div>
              </div>
              <div className="row align-middle mb-sm">
                <div className="column">
                  <input
                    type="text"
                    className="accent"
                    value={item.answer}
                    placeholder="Add an Answer: i.e. Yes, I also translate from English to Hebrew."
                    onChange={e => this.updateAnswer(e.target.value, index)}
                  />
                </div>
              </div>
            </Fragment>
          ))}
        <div className="row">
          <div className="column">
            <Button className="small bg-gradient" onClick={this.addNew}>
              Add
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default FAQList;
