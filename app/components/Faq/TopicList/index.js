// @flow

import * as React from 'react';
import { history } from 'components/ConnectedRouter';
import cx from 'classnames';
import { List } from 'immutable';

import Link from 'components/Link';
import { generate } from 'shortid';
import Select from 'components/Select';

import './styles.scss';

type Props = {
  topics: List<Object>,
  isSideBar?: boolean,
  activeTopic?: string,
};

class FaqTopic extends React.Component<Props, Object> {
  onChangeSelect = (e: Object) => {
    const { value } = e.target;
    history.push(`/faq/${value}`);
  };
  render() {
    const { topics, isSideBar, activeTopic } = this.props;
    if (!topics || topics.size === 0) {
      return null;
    }
    return (
      <div className={cx('faqTopic mb-lg', { faqTopic__sideBar: isSideBar })}>
        <div className="row hide-for-small-only">
          {isSideBar && (
            <div
              key={generate()}
              className={cx('column small-12', { 'medium-6': !isSideBar })}
            >
              <Link
                to="/faq"
                className="faqTopic__category faqTopic__category--home"
              >
                <span className="faqTopic__categoryLabel">FAQ Home</span>
              </Link>
            </div>
          )}
          {topics.valueSeq().map(item => (
            <div
              key={generate()}
              className={cx('column small-12', { 'medium-6': !isSideBar })}
            >
              <Link
                to={`/faq/${item.get('value')}`}
                className={cx('faqTopic__category', {
                  'faqTopic__category--active':
                    activeTopic === item.get('value'),
                })}
              >
                {!isSideBar && (
                  <img
                    alt={item.get('value')}
                    src={item.get('icon')}
                    className="faqTopic__categoryIcon"
                  />
                )}
                <span className="faqTopic__categoryLabel">
                  {item.get('label')}
                </span>
              </Link>
            </div>
          ))}
        </div>
        <div className="show-for-small-only">
          <Select
            className="b-primary blueTheme"
            value={activeTopic}
            onChange={this.onChangeSelect}
          >
            <option key={0} value="">
              FAQ Home
            </option>
            {topics.valueSeq().map(item => {
              const value = item.get('value');
              return (
                <option key={value} value={value}>
                  {item.get('label')}
                </option>
              );
            })}
          </Select>
        </div>
      </div>
    );
  }
}

export default FaqTopic;
