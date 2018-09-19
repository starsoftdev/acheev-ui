// @flow
import React from 'react';

import BaseModal from 'components/BaseModal';
import Button from 'components/Button';
import Input from 'components/Input';

import ALLOWED_RANGE_AGES from 'enum/allowed_range_ages';

type Props = {
  onSelect: (value: string) => void,
  // eslint-disable-next-line  react/no-unused-prop-types
  value: string | Array<string>,
};

type State = {
  value: string,
  showMessage: boolean,
  isModalOpen: boolean,
};

export default class YearOfBirth extends React.Component<Props, State> {
  state = {
    value: '',
    showMessage: false,
    isModalOpen: false,
  };

  onOpenModal = (e: SyntheticEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    this.setState({ isModalOpen: true });
  };

  onCloseModal = () => {
    this.setState({ isModalOpen: false });
  };

  handleClick = () => {
    const currentYear = new Date().getFullYear();
    const max = currentYear - ALLOWED_RANGE_AGES.MIN_USER_AGE;
    const min = currentYear - ALLOWED_RANGE_AGES.MAX_USER_AGE;
    const { value } = this.state;

    const isValid = +value > min && +value < max;

    if (isValid) {
      this.props.onSelect(value);
    } else {
      this.setState({ showMessage: true });
    }
  };

  handleChange = (value: string) => {
    this.setState({ value });
  };

  render() {
    return (
      <section className="recommendationWizard__body">
        <div className="container">
          <div className="row">
            <h1 className="recommendationWizard__title small-12 column">
              What year were you born
            </h1>
            <div className="small-12 column">
              <div className="row">
                <div className="small-12 large-6 large-offset-3 column">
                  <Input
                    placeholder="e.g. 1980"
                    value={this.state.value}
                    type="number"
                    onChange={this.handleChange}
                  />
                </div>

                <div className="small-12 column">
                  <div className="recommendationWizard--center recommendationWizard__message">
                    {this.state.showMessage && 'you must enter a valid year'}
                  </div>
                </div>

                <div className="small-12 column">
                  <p className="recommendationWizard--center">
                    <a
                      href="/recommender/dumb-link"
                      className="recommendationWizard__link"
                      onClick={this.onOpenModal}
                    >
                      Why do we ask for year of birth?
                    </a>
                  </p>
                </div>

                <Button
                  className="recommendationWizard__button"
                  onClick={this.handleClick}
                >
                  Complete
                </Button>
              </div>
            </div>
          </div>
        </div>
        <BaseModal
          className="small-12 medium-6 column"
          isOpen={this.state.isModalOpen}
        >
          <h2>Why do we ask for year of birth?</h2>
          <p className="recommendationWizard__modalBody">
            Lift & Co. requests your age to help customize a cannabis product
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
