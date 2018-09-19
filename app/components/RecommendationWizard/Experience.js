// @flow
import * as React from 'react';

import Icon from 'components/Icon';
import NewIcon from 'images/sprite/new_experience.svg';
import FamiliarIcon from 'images/sprite/familiar_experience.svg';
import ConnoisseurIcon from 'images/sprite/connoisseur_experience.svg';

import Block from './Block';

const options = [
  {
    icon: NewIcon,
    label: 'New to cannabis',
    field: 'new',
  },
  {
    icon: FamiliarIcon,
    label: 'Familiar with cannabis',
    field: 'familiar',
  },
  {
    icon: ConnoisseurIcon,
    label: 'A cannabis connoisseur',
    field: 'connoisseur',
  },
];

type Props = {
  onSelect: (value: string) => void,
  // eslint-disable-next-line  react/no-unused-prop-types
  value: string | Array<string>,
};

type State = {
  value?: string,
};

export default class Experience extends React.Component<Props, State> {
  state = {
    value: undefined,
  };

  handleClick = (e: SyntheticEvent<HTMLInputElement>) => {
    const { name } = e.currentTarget.dataset;
    this.setState({ value: name });
    this.props.onSelect(name);
  };

  render() {
    return (
      <section className="recommendationWizard__body">
        <div className="container">
          <div className="row">
            <h1 className="recommendationWizard__title small-12 column">
              I am
            </h1>
            <div className="small-12 column">
              <div className="row">
                <div className="small-12 large-10 large-offset-1 column">
                  <div className="row">
                    {options.map(item => (
                      <div key={item.field} className="small-12 large-4 column">
                        <Block
                          label={item.label}
                          onClick={this.handleClick}
                          data-name={item.field}
                          selected={item.field === this.state.value}
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
          </div>
        </div>
      </section>
    );
  }
}
