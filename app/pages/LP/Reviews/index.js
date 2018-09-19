// @flow

import React, { Component } from 'react';
import moment from 'moment';

import { connect } from 'react-redux';
import MENU_ITEMS from 'enum/menu/items';

import MainMenu from 'components/Header/MainMenu';
import DateRangePicker from 'components/DateRangePicker';
import Header from 'components/LP/TitleHeader';
import LimitedFeaturesMessage from 'components/LP/LimitedFeaturesMessage';
import Routes from './routes';

import './styles.scss';

type Props = {
  match: Object,
  user: Map<*, *>,
};

type State = {
  from: Date,
  to: Date,
};

class LpReviewsPage extends Component<Props, State> {
  state = {
    from: moment('2018-01-01'),
    to: moment(),
  };

  handleChange = (key, value) => {
    this.setState({ [key]: value });
  };

  render() {
    const { user } = this.props;

    return (
      <React.Fragment>
        <LimitedFeaturesMessage role={user && user.get('role')} />
        <div className="lpReviews">
          <Header title="Your Reviews">
            <DateRangePicker
              from={this.state.from}
              to={this.state.to}
              onChangeFrom={e => this.handleChange('from', e)}
              onChangeTo={e => this.handleChange('to', e)}
            />
          </Header>

          <div className="lpReviews__menu">
            <div className="row">
              <div className="small-12 column">
                <MainMenu items={MENU_ITEMS.LP_MENU_REVIEWS_ITEMS} secondary />
              </div>
            </div>
          </div>
          <Routes
            url={this.props.match.url}
            from={this.state.from}
            to={this.state.to}
          />
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
});

export default connect(mapStateToProps)(LpReviewsPage);
