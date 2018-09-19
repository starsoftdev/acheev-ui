// @flow
import * as React from 'react';
import cx from 'classnames';

import Button from 'components/Button';
import Icon from 'components/Icon';
import PainIcon from 'images/sprite/pain.svg';
import AnxietyIcon from 'images/sprite/anxiety.svg';
import InsomniaIcon from 'images/sprite/insomnia.svg';
import AppetiteIcon from 'images/sprite/appetite.svg';
import DepressionIcon from 'images/sprite/depression.svg';
import ArrowIcon from './arrow.png';

import Block from './Block';

const options = [
  {
    icon: PainIcon,
    label: 'Pain',
    field: 'pain',
  },
  {
    icon: AnxietyIcon,
    label: 'Anxiety',
    field: 'anxiety',
  },
  {
    icon: InsomniaIcon,
    label: 'Insomnia',
    field: 'insomnia',
  },
  {
    icon: DepressionIcon,
    label: 'Depression',
    field: 'depression',
  },
  {
    icon: AppetiteIcon,
    label: 'Lack of appetite',
    field: 'appetite',
  },
];

type Props = {
  onSelect: (value: Array<string>) => void,
  // eslint-disable-next-line  react/no-unused-prop-types
  value: Array<string>,
};

type State = {
  pain: boolean,
  insomnia: boolean,
  depression: boolean,
  appetite: boolean,
  anxiety: boolean,
  showMessage: boolean,
};

export default class WantToTreat extends React.Component<Props, State> {
  state = {
    pain: false,
    insomnia: false,
    depression: false,
    appetite: false,
    anxiety: false,
    showMessage: false,
  };

  handleClick = (e: SyntheticEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget.dataset;
    this.setState(state => ({ [name]: !state[name], showMessage: false }));
  };

  handleFindClick = () => {
    const fields = { ...this.state };
    delete fields.showMessage;

    if (Object.values(fields).every(status => !status)) {
      this.setState({ showMessage: true });
    } else {
      const values = Object.keys(fields).filter(field => fields[field]);
      this.props.onSelect(values);
    }
  };

  render() {
    return (
      <section className="recommendationWizard__treatContainer">
        <div className="container">
          <div className="row">
            <h1 className="recommendationWizard__title small-12 column">
              What do you want to treat?
            </h1>
            <div className="small-12 column">
              <div className="row">
                {options.map((item, index) => (
                  <div
                    key={item.field}
                    className={cx('small-12 large-2 column', {
                      'large-offset-1': index === 0,
                    })}
                  >
                    <Block
                      label={item.label}
                      onClick={this.handleClick}
                      data-name={item.field}
                      selected={this.state[item.field]}
                    >
                      <Icon
                        glyph={item.icon}
                        width={100}
                        height={35}
                        className="recommendationWizard__icon"
                      />
                    </Block>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="recommendationWizard--center recommendationWizard__message">
          {this.state.showMessage && 'You must select at least one symptom'}
        </div>

        <div className="recommendationWizard--center recommendationWizard__firstButton__wrapper">
          <Button
            className="recommendationWizard__firstButton coral"
            onClick={this.handleFindClick}
          >
            Find Strains
            <img
              src={ArrowIcon}
              alt="next_icon"
              className="recommendationWizard__buttonIcon"
            />
          </Button>
        </div>
      </section>
    );
  }
}
