// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { List, fromJS } from 'immutable';

import injectSagas from 'utils/injectSagas';

import Breadcrumbs from 'components/Breadcrumbs';
import BusinessesList from 'components/BusinessesList';
import Preloader from 'components/Preloader';
import Filter from 'components/Filter';

import saga, {
  reducer,
  requestBusinesses,
} from 'containers/BusinessSearch/sagas';

type Props = {
  category: string,
  slug: string,
  businesses: List<*>,
  isLoading: boolean,
  filter: Object,
  requestBusinesses: Function,
  model: Object,
};

class BusinessSearchContainer extends Component<Props> {
  componentDidMount() {
    this.props.requestBusinesses(this.props.slug);
  }

  componentDidUpdate({ slug }: Props) {
    if (slug !== this.props.slug) {
      this.props.requestBusinesses(this.props.slug);
    }
  }

  render() {
    const { category, slug, filter, model, businesses, isLoading } = this.props;
    const breadcrumbPath = fromJS([
      {
        link: '/businesses',
        title: 'Businesses',
      },
      {
        link: '',
        title: `${slug}`,
      },
    ]);
    return (
      <div>
        <Breadcrumbs path={breadcrumbPath} />
        <div className="row column hide-for-small-only">
          <h1 className="c-darkest-gray mb-lg t-capitalize">{slug}</h1>
        </div>
        <Filter
          isBanner
          category={category}
          data={this.props.filter}
          requestItems={(path, value) => {
            this.props.requestBusinesses(slug, path, value);
          }}
          filter={filter}
        />
        {isLoading ? (
          <Preloader />
        ) : (
          <BusinessesList
            data={businesses}
            province={model.get('province')}
            category={slug}
          />
        )}
      </div>
    );
  }
}

const mapStateToProps = (state, props) => ({
  filter: state.getIn(['businessSearch', props.slug, 'filter']),
  businesses: state.getIn(['businessSearch', props.slug, 'data', 'hits']),
  isLoading: state.getIn(['businessSearch', props.slug, 'isLoading']),
  model: state.getIn(['businessSearch', props.slug, 'filter', 'model']),
});

const mapDispatchToProps = dispatch => ({
  requestBusinesses: (category, path, value) =>
    dispatch(requestBusinesses(category, path, value)),
});

export default compose(
  injectSagas({ key: 'businessSearch', saga, reducer }),
  connect(
    mapStateToProps,
    mapDispatchToProps
  )
)(BusinessSearchContainer);
