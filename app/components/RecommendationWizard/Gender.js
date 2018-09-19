// @flow
import * as React from 'react';

import BaseModal from 'components/BaseModal';
import Button from 'components/Button';
import Icon from 'components/Icon';
import MaleIcon from 'images/sprite/male.svg';
import FemaleIcon from 'images/sprite/female.svg';
import OtherIcon from 'images/sprite/other_gender.svg';

import Block from './Block';

const options = [
  {
    icon: MaleIcon,
    label: 'Male',
    field: 'male',
  },
  {
    icon: FemaleIcon,
    label: 'Famale',
    field: 'female',
  },
  {
    icon: OtherIcon,
    label: 'Other',
    field: 'other',
  },
];

type Props = {
  onSelect: (value: string) => void,
  // eslint-disable-next-line  react/no-unused-prop-types
  value: string | Array<string>,
};

type State = {
  value?: string,
  isModalOpen: boolean,
};

export default class Gender extends React.Component<Props, State> {
  state = {
    value: undefined,
    isModalOpen: false,
  };

  onOpenModal = (e: SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.setState({ isModalOpen: true });
  };

  onCloseModal = () => {
    this.setState({ isModalOpen: false });
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
              What is your Gender?
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

                <div className="small-12 column">
                  <p className="recommendationWizard--center">
                    <a
                      href="/recommender/dumb-link"
                      className="recommendationWizard__link"
                      onClick={this.onOpenModal}
                    >
                      Why do we ask for gender?
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BaseModal
          className="small-12 medium-6 column"
          isOpen={this.state.isModalOpen}
        >
          <h2>Why do we ask for gender?</h2>
          <p className="recommendationWizard__modalBody">
            Lift requests your gender to help to customize your cannabis product
            suggestion based on similar users within our database.
          </p>

          <div className="small-12 small-centered text-center columns">
            <Button onClick={this.onCloseModal}>Got it!</Button>
          </div>
        </BaseModal>
      </section>
    );
  }
}
