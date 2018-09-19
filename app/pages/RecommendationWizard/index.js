// @flow
import * as React from 'react';
import _ from 'lodash';
import { stringify } from 'qs';
import { Route, withRouter } from 'react-router-dom';

import ProgressBar from 'components/ProgressBar';
import WantToTreat from 'components/RecommendationWizard/WantToTreat';
import Experience from 'components/RecommendationWizard/Experience';
import Gender from 'components/RecommendationWizard/Gender';
import YearOfBirth from 'components/RecommendationWizard/YearOfBirth';

import INTERNAL_LINKS from 'enum/InternalLinks';

import './styles.scss';

type Props = {
  history: { push: (path: string) => void, goBack: () => void },
  location: { pathname: string },
  // eslint-disable-next-line  react/no-unused-prop-types
  user: Object,
};

type State = {
  toTreat: Array<string>,
  yearOfBirth: string,
  gender: string,
  experience: string,
};

const maps = {
  toTreat: {
    redirectTo: INTERNAL_LINKS.RECOMMENDER.EXPERIENCE,
    queryString: false,
  },
  experience: {
    redirectTo: INTERNAL_LINKS.RECOMMENDER.GENDER,
    queryString: false,
  },
  gender: {
    redirectTo: INTERNAL_LINKS.RECOMMENDER.YEAR_OF_BIRTH,
    queryString: false,
  },
  yearOfBirth: { redirectTo: INTERNAL_LINKS.RECOMMENDATION, queryString: true },
};

const routes = [
  {
    exact: true,
    path: INTERNAL_LINKS.HOME,
    step: 0,
    field: 'toTreat',
    Component: WantToTreat,
  },
  {
    exact: false,
    path: INTERNAL_LINKS.RECOMMENDER.EXPERIENCE,
    step: 1,
    field: 'experience',
    Component: Experience,
  },
  {
    exact: false,
    path: INTERNAL_LINKS.RECOMMENDER.GENDER,
    step: 2,
    field: 'gender',
    Component: Gender,
  },
  {
    exact: false,
    path: INTERNAL_LINKS.RECOMMENDER.YEAR_OF_BIRTH,
    step: 3,
    field: 'yearOfBirth',
    Component: YearOfBirth,
  },
];

class RecommendationWizard extends React.Component<Props, State> {
  static getDerivedStateFromProps(props: Props, state: State) {
    if (props.user) {
      const nextProps = {};

      if (
        !state.experience &&
        props.user.get('cannabisExperience') !== state.experience
      ) {
        nextProps.experience = props.user.get('cannabisExperience');
      }

      if (
        !state.yearOfBirth &&
        props.user.get('yearOfBirth') !== state.yearOfBirth
      ) {
        nextProps.yearOfBirth = props.user.get('yearOfBirth');
      }

      if (!state.gender && props.user.get('gender') !== state.gender) {
        nextProps.gender = props.user.get('gender');
      }

      return nextProps;
    }

    return null;
  }

  state = {
    toTreat: [],
    yearOfBirth: '',
    gender: '',
    experience: '',
  };

  handleSelected = (field: string, value: Array<string> | string) => {
    this.setState({ [field]: value });

    if (maps[field].queryString) {
      this.props.history.push(
        `${maps[field].redirectTo}?${stringify(this.state)}`
      );
    } else {
      this.props.history.push(maps[field].redirectTo);
    }
  };

  render() {
    const stepPath = _.find(
      routes,
      o => o.path === this.props.location.pathname
    );

    return (
      <div className="recommendationWizard">
        <Route
          path="/recommender"
          render={() => (
            <React.Fragment>
              <ProgressBar
                className="mb-hg"
                value={stepPath && stepPath.step}
                maxValue={4}
                width={7}
                color="#19AA9C"
                trailColor="#B5E1DD"
                rounded={false}
                fullWidth
              />
            </React.Fragment>
          )}
        />

        {routes.map(({ exact, path, Component, field }) => (
          <Route
            key={`${path}-${field}`}
            exact={exact}
            path={path}
            render={() => (
              <Component
                value={this.state[field]}
                onSelect={values => this.handleSelected(field, values)}
              />
            )}
          />
        ))}
      </div>
    );
  }
}

export default withRouter(RecommendationWizard);
