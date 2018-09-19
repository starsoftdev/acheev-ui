// @flow

import * as React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { fromJS, List } from 'immutable';

import injectSagas from 'utils/injectSagas';

import Breadcrumbs from 'components/Breadcrumbs';
import Banner from 'components/PageBanner';

import BannerBG from 'images/banners/faq.png';

import saga, { reducer } from './sagas';
import Routes from './routes';
import './styles.scss';

type Props = {
  topics: List<Object>,
  match: Object,
};

class FaqPage extends React.Component<Props> {
  render() {
    const { topics, match } = this.props;
    const { slug } = match.params;
    const bennerUrl = BannerBG;
    const breadcrumbsPath = [
      {
        link: '/faq',
        title: 'FAQ',
      },
    ];
    const activeTopic = topics.find(item => item.get('value') === slug);

    if (activeTopic) {
      breadcrumbsPath.push({
        link: `/faq/${slug}`,
        title: activeTopic.get('label'),
      });
    }
    return (
      <div className="faq">
        <Breadcrumbs path={fromJS(breadcrumbsPath)} />
        <Banner title="FAQ" bg={bennerUrl} expanded />
        <Routes url={match.url} />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  topics: state.getIn(['faq', 'topics', 'data']),
});

export default compose(
  injectSagas({ key: 'faq', saga, reducer }),
  connect(mapStateToProps)
)(FaqPage);
