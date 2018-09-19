// @flow

import React, { Component } from 'react';
import cx from 'classnames';
import { generate } from 'shortid';
import { sum, values, pick } from 'lodash-es';
import Form from 'react-formal';

import Button from 'components/Button';
import RequireAuth from 'components/RequireAuth';
import StepProgressChart from 'components/StepProgressChart';
import StepProgressLineChart from 'components/StepProgressLineChart';
import Icon from 'components/Icon';

import IconToggleRight from 'images/sprite/toggle-right.svg';
import IconToggleLeft from 'images/sprite/toggle-left.svg';
import './styles.scss';

type Props = {
  data: Object,
  step?: number,
  className?: string,
  stepsClassName?: string,
  currentScoreData: Object,
  totalScoreData: Object,
  goToStep: Function,
  toggled: boolean,
  onToggle: Function,
  showButton: boolean,
  currentUser: Object,
  isLoading: boolean,
  isUploading: boolean,
  onRedirect: Function,
};

type State = {
  toggled: boolean,
};

const getStepScore = (data, stepFields) => {
  const filteredData = pick(data, stepFields);
  return sum(values(filteredData));
};

class VerticalStepper extends Component<Props, State> {
  handleToggle = () => {
    this.props.onToggle();
  };

  render() {
    const {
      data,
      step = 1,
      className,
      stepsClassName,
      totalScoreData,
      currentScoreData,
      toggled,
      isLoading,
      showButton,
      currentUser,
      isUploading,
    } = this.props;
    const mergedClassName = cx('verticalStepper__list', stepsClassName);
    const totalScore = sum(values(totalScoreData));
    const currentScore = sum(values(currentScoreData));
    if (!data) return null;
    return (
      <div
        className={cx(className, 'verticalStepper', { 'small-12': toggled })}
      >
        <div className="row">
          <div className="column medium-shrink">
            <div className="verticalStepper__container">
              <StepProgressChart
                className="verticalStepper__progressChart hide-for-small-only"
                value={currentScore}
                maxValue={totalScore}
                label="redemptions"
                stroke="#f7f8fb"
              />
              <div className="row align-middle show-for-small-only verticalStepper__toggler">
                <div className="column shrink">
                  <Icon
                    glyph={toggled ? IconToggleLeft : IconToggleRight}
                    size={20}
                    onClick={this.handleToggle}
                  />
                </div>
                {toggled && (
                  <StepProgressLineChart
                    className="column expanded"
                    value={currentScore}
                    maxValue={totalScore}
                    label="redemptions"
                    stroke="#f7f8fb"
                  />
                )}
              </div>
              <ul className={mergedClassName}>
                {data.map(item => {
                  const stepTotalScore = getStepScore(
                    totalScoreData,
                    item.fields
                  );
                  const stepCurrentScore = getStepScore(
                    currentScoreData,
                    item.fields
                  );
                  const isActive = step === item.step;
                  const stepComplete = stepTotalScore === stepCurrentScore;
                  return (
                    <li
                      key={generate()}
                      className={cx('verticalStepper__itemWrapper', {
                        'verticalStepper__itemWrapper--active': isActive,
                      })}
                    >
                      <div
                        className="verticalStepper__item"
                        onClick={() => this.props.goToStep(item.step + 1)}
                        role="link"
                      >
                        <div
                          className={cx(
                            'verticalStepper__icon',
                            {
                              'verticalStepper__icon--complete':
                                !isActive && stepComplete,
                            },
                            {
                              'verticalStepper__icon--active': isActive,
                            }
                          )}
                        />
                        <div className="verticalStepper__titleWrapper hide-for-small-only">
                          <div className="verticalStepper__title hide-for-small-only">
                            {item.title}
                          </div>
                          <div className="verticalStepper__subtitle hide-for-small-only">
                            {stepTotalScore} more Lift Points
                          </div>
                        </div>
                        {toggled && (
                          <div className="verticalStepper__titleWrapper show-for-small-only">
                            <div className="verticalStepper__title">
                              {item.title}
                            </div>
                            <div className="verticalStepper__subtitle">
                              {stepTotalScore} more Lift Points
                            </div>
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
              <div className="show-for-small-only text-center">
                {toggled &&
                  showButton &&
                  (currentUser ? (
                    <Button
                      className="button secondary large"
                      type="submit"
                      element={Form.Button}
                      disabled={isUploading}
                      isLoading={isLoading}
                    >
                      Submit
                    </Button>
                  ) : (
                    <div className="newProductReviewForm__authBtn">
                      <RequireAuth
                        toDo="create review"
                        onClickLogin={this.props.onRedirect}
                        onClickRegister={this.props.onRedirect}
                      >
                        <Button className="button secondary large">
                          Submit
                        </Button>
                      </RequireAuth>
                    </div>
                  ))}
              </div>
              <div className="hide-for-small-only text-center">
                {showButton &&
                  (currentUser ? (
                    <Button
                      className="button secondary large"
                      type="submit"
                      disabled={isUploading}
                      element={Form.Button}
                      isLoading={isLoading}
                    >
                      Submit
                    </Button>
                  ) : (
                    <div className="newProductReviewForm__authBtn">
                      <RequireAuth
                        toDo="create review"
                        onClickLogin={this.props.onRedirect}
                        onClickRegister={this.props.onRedirect}
                      >
                        <Button className="button secondary large">
                          Submit
                        </Button>
                      </RequireAuth>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default VerticalStepper;
