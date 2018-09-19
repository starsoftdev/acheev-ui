// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { sumBy, round, get } from 'lodash-es';
import type { Map } from 'immutable';
import { fromJS } from 'immutable';
import { generate } from 'shortid';

import PieChart from 'components/PieChart';
import DateRangeSelect from 'components/LP/DateRangeSelect';
import CanadaMap from 'components/CanadaMap';
import Preloader from 'components/Preloader';
import Table from 'components/Table';
import ProgressBar from 'components/ProgressBar';
import EffectPane from 'components/LP/EffectPane';
import Header from 'components/LP/TitleHeader';
import LimitedFeaturesMessage from 'components/LP/LimitedFeaturesMessage';

import FILTER_OPTIONS from 'enum/filter/options';

import { requestDemographics } from 'pages/LP/sagas';

import 'pages/LP/styles.scss';
import './styles.scss';

const calcDemographicsPercentage = obj => {
  const transformedObj = {};
  Object.keys(obj).forEach(key => {
    const { male = 0, female = 0, ...other } = obj[key];
    const total = male + female;
    transformedObj[key] = {
      male: round((male * 100) / total, 1),
      female: round((female * 100) / total, 1),
      ...other,
    };
  });
  return transformedObj;
};

const calcGeoPercentage = arr => {
  const provinces = FILTER_OPTIONS.FILTER_PROVINCE_OPTIONS.map(p => p.value);
  const validArr = arr.filter(
    value => provinces.indexOf(value.province) !== -1
  );
  const total = sumBy(validArr, obj => obj.count);
  const transformedArr = [];
  validArr.map(({ province, count }) =>
    transformedArr.push({
      province,
      count: round((count * 100) / total, 1),
    })
  );
  return transformedArr;
};

const calcSharedPecentage = (val: number) => [
  {
    count: round((1 - val) * 100, 1),
    name: 'Users who have only reviewed your business or products',
  },
  {
    count: round(val * 100, 1),
    name:
      'Users who have reviewed your business or products as well as at least one other LP business or product',
  },
];

type Props = {
  requestDemographics: Function,
  businessId: string,
  demographics: Map<*, *>,
  user: Map<*, *>,
  isLoading: boolean,
};

type State = {
  dateRange: Object,
};

const options = [
  {
    label: 'Jan 1, 2014 – Dec 31, 2014',
    value: generate(),
    from: 'Jan 1, 2014',
    to: 'Dec 31, 2014',
  },
  {
    label: 'Jan 1, 2015 – Dec 31, 2015',
    value: generate(),
    from: 'Jan 1, 2015',
    to: 'Dec 31, 2015',
  },
  {
    label: 'Jan 1, 2016 – June 30, 2016',
    value: generate(),
    from: 'Jan 1, 2016',
    to: 'June 30, 2016',
  },
  {
    label: 'July 1, 2016 – Dec 31, 2016',
    value: generate(),
    from: 'July 1, 2016',
    to: 'Dec 31, 2016',
  },
  {
    label: 'Jan 1, 2017 – June 30, 2017',
    value: generate(),
    from: 'Jan 1, 2017',
    to: 'June 30, 2017',
  },
  {
    label: 'July 1, 2017 – Dec 31, 2017',
    value: generate(),
    from: 'July 1, 2017',
    to: 'Dec 31, 2017',
  },
  {
    label: `Jan 1, 2018 – ${moment().format('ll')}`,
    value: generate(),
    from: 'Jan 1, 2018',
    to: moment().format('ll'),
  },
];

class LpDemographicsPage extends Component<Props, State> {
  state = {
    dateRange: options[options.length - 1],
  };

  componentDidMount() {
    const { businessId } = this.props;
    const {
      dateRange: { from, to },
    } = this.state;
    if (businessId) {
      this.requestData(businessId, from, to);
    }
  }

  componentWillReceiveProps(newProps) {
    const { businessId } = newProps;
    const {
      dateRange: { from, to },
    } = this.state;
    if (businessId && !this.props.businessId) {
      this.requestData(businessId, from, to);
    }
  }
  requestData = (businessId, from, to) => {
    const formattedFrom = moment(from, 'll').format('YYYY-MM-DD');
    const formattedTo = moment(to, 'll').format('YYYY-MM-DD');
    this.props.requestDemographics(businessId, formattedFrom, formattedTo);
  };
  handleChange = value => {
    this.setState({ dateRange: value }, () => {
      this.requestData(this.props.businessId, value.from, value.to);
    });
  };
  render() {
    const { demographics, isLoading, user } = this.props;
    const transformedDemographics =
      demographics &&
      demographics.get('patients') &&
      calcDemographicsPercentage(demographics.get('patients').toJS());
    const transformedGeo =
      demographics &&
      demographics.get('geo') &&
      calcGeoPercentage(demographics.get('geo').toJS());
    const businessAverageAge =
      demographics && demographics.getIn(['patients', 'business', 'avgAge']);
    const liftAverageAge =
      demographics && demographics.getIn(['patients', 'lift', 'avgAge']);
    const topCompetitors =
      demographics &&
      demographics.getIn(
        ['patients', 'shared', 'topCompetitors'],
        fromJS([{}])
      );
    const report = demographics && demographics.get('report');
    return (
      <React.Fragment>
        <LimitedFeaturesMessage role={user && user.get('role')} />
        <div className="lpDemographics">
          <Header title="Demographics">
            <DateRangeSelect
              clearable={false}
              options={options}
              value={this.state.dateRange}
              onChange={e => this.handleChange(e)}
            />
          </Header>
          {isLoading ? (
            <Preloader />
          ) : (
            <div>
              <div className="lp__panelSection">
                <div className="row">
                  <div className="small-12 large-shrink column mb-md">
                    {transformedDemographics && (
                      <div className="lpDemographics__pieSection row Qalign-center">
                        <div className="lpDemographics__pieChart small-12 medium-shrink large-12 column">
                          <div className="lp__label">
                            Your reviewer demographics
                          </div>
                          {businessAverageAge &&
                            businessAverageAge !== 'NaN' && (
                              <div className="lpDemographics__age">
                                <div className="row align-middle">
                                  <div className="column">Average age</div>
                                  <div className="shrink column c-light-green fs-xl">
                                    {businessAverageAge}
                                  </div>
                                </div>
                              </div>
                            )}

                          <PieChart
                            className="mb-xl"
                            data={
                              get(transformedDemographics, [
                                'business',
                                'avgAge',
                              ]) !== 'NaN'
                                ? [
                                    {
                                      count:
                                        transformedDemographics.business.male,
                                      name: 'Male',
                                    },
                                    {
                                      count:
                                        transformedDemographics.business.female,
                                      name: 'Female',
                                    },
                                  ]
                                : null
                            }
                            labelPrefix={entry => entry.name}
                            palette="green"
                            valuePostfix="%"
                            radius={55}
                            thickness={20}
                            stroke="#f7f8fb"
                          />
                        </div>
                        <div className="lpDemographics__pieChart small-12 medium-shrink large-12 column">
                          <div className="lp__label">
                            General Lift userbase demographics
                          </div>
                          {liftAverageAge &&
                            liftAverageAge !== 'NaN' && (
                              <div className="lpDemographics__age">
                                <div className="row align-middle">
                                  <div className="column">Average age</div>
                                  <div className="shrink column c-secondary fs-xl">
                                    {liftAverageAge}
                                  </div>
                                </div>
                              </div>
                            )}
                          <PieChart
                            data={[
                              {
                                count: transformedDemographics.lift.male,
                                name: 'Male',
                              },
                              {
                                count: transformedDemographics.lift.female,
                                name: 'Female',
                              },
                            ]}
                            labelPrefix={entry => entry.name}
                            valuePostfix="%"
                            radius={55}
                            thickness={20}
                            stroke="#f7f8fb"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="column">
                    <div className="lpDemographics__map">
                      <div className="lpDemographics__mapLabel lp__label">
                        Location of your reviewers
                      </div>
                      {transformedGeo && <CanadaMap data={transformedGeo} />}
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="small-12 large-expand column mb-xl">
                  <div className="lp__label">Common Reviewers</div>
                  <div className="lp__desc">
                    This displays all users that have written a review for your
                    product or business and have reviewed another producer’s
                    product or business in the given date range. This should be
                    directionally informative of how many of your patients are
                    also registered with other producers.
                  </div>
                  <PieChart
                    data={
                      demographics &&
                      calcSharedPecentage(
                        demographics.getIn(['patients', 'shared', 'ratio'], 0)
                      )
                    }
                    labelPrefix={entry => entry.name}
                    valuePostfix="%"
                    radius={112}
                    thickness={30}
                    stackForSmall
                  />
                </div>
                <div className="small-12 large-expand column mb-xl">
                  <div className="lp__label">
                    Common Reviewers by competitive producer
                  </div>
                  <div className="lp__desc">
                    This displays which competitors your reviewers are also
                    reviewing. (Users who have reviewed both your product or
                    business as well as a competitive product or business as a
                    percentage of all users who have reviewed your product or
                    business.)
                  </div>
                  {topCompetitors.size ? (
                    <Table className="lpDemographics__competitors bordered spacious">
                      <tbody>
                        {topCompetitors.map(i => {
                          const name = i.get('name');
                          return (
                            <tr key={i.get('business')}>
                              <td>
                                <div className="row align-middle">
                                  <div className="shrink column">
                                    <div
                                      className="lpDemographics__avatar"
                                      style={{
                                        backgroundImage: `url(${i.getIn(
                                          ['thumbnail'],
                                          `http://via.placeholder.com/40x40?text=${name}`
                                        )}`,
                                      }}
                                    />
                                  </div>
                                  <div className="column">{name}</div>
                                </div>
                              </td>
                              <td>
                                <ProgressBar
                                  progressBarClassName="hide-for-small-only"
                                  value={round(i.get('sharedRatio') * 100, 1)}
                                  maxValue={100}
                                  width={11}
                                  trailWidth={11}
                                  showValue
                                  valuePostfix="%"
                                />
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  ) : (
                    'No data for selected period'
                  )}
                </div>
              </div>
              <div className="lp__panelSection">
                <div className="row column">
                  <div className="lp__label">
                    What patients are reporting about your products
                  </div>
                  <div className="lp__desc">
                    These are the symptoms and effects that are most commonly
                    referenced across all your product reviews, the top being
                    the most common. The score out of 10 denotes the average
                    rating of efficacy for that particular symptom or effect
                    across all reviews where the symptom or effect was
                    mentioned. The product referenced at the end of the chart
                    was reviewed as the most efficacious for that symptom or
                    effect (individual score not shown).
                  </div>
                  <EffectPane data={report} />
                </div>
              </div>
            </div>
          )}
        </div>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  user: state.getIn(['app', 'lpUser']),
  businessId: state.getIn(['lp', 'businesses', 'data', 0, 'id']),
  demographics: state.getIn(['lp', 'demographics', 'data']),
  isLoading: state.getIn(['lp', 'demographics', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestDemographics: (businessId, from, to) =>
    dispatch(requestDemographics(businessId, from, to)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LpDemographicsPage);
