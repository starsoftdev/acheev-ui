// @flow

import React, { Component } from 'react';
import Helmet from 'components/Helmet';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { List, fromJS } from 'immutable';
import { get, getIn } from 'utils/immutable';

import Breadcrumbs from 'components/Breadcrumbs';
import Banner from 'components/PageBanner';
import ForumSearchContainer from 'containers/Forum/Search';
import Preloader from 'components/Preloader';

import injectSagas from 'utils/injectSagas';
import { setMetaJson } from 'containers/App/sagas';

import saga, { reducer, requestCategories } from './sagas';

type Props = {
  match: Object,
  requestCategories: Function,
  setMetaJson: Function,
  categories: List<*>,
  isLoading: boolean,
};

class ForumPage extends Component<Props> {
  componentDidMount() {
    const slug = getIn(this.props, ['match', 'params', 'slug']);
    this.props.requestCategories(slug);
  }

  componentWillReceiveProps(newProps: Props) {
    const { categories } = newProps;
    const slug = getIn(this, ['props', 'match', 'params', 'slug']);
    const category = categories
      ? categories.find(cat => cat.get('slug') === slug)
      : null;
    if (category) {
      this.props.setMetaJson(['title'], `${category.get('name')} - Lift`);
      this.props.setMetaJson(['name'], `${category.get('name')} - Lift`);
      this.props.setMetaJson(['description'], category.get('description'));
    } else {
      this.props.setMetaJson(
        ['description'],
        'Advice on health, laws and regulations, strains, producers, doctors and more. Ask a question and help other members.'
      );
    }
  }

  render() {
    const { categories, isLoading } = this.props;
    const slug = getIn(this.props, ['match', 'params', 'slug']);
    const category = categories
      ? categories.find(cat => cat.get('slug') === slug)
      : null;
    const bannerTitle = get(
      category,
      'name',
      'Questions & Answers on Medical Marijuana'
    );
    const bannerDescription = get(
      category,
      'description',
      'Advice on health, laws and regulations, strains, producers, doctors and more. Ask a question and help other members.'
    );
    const helmetTitle = get(
      category,
      'name',
      'Questions & Answers on Medical Marijuana - Lift & Co.'
    );
    const path = category
      ? [
          {
            link: '/forum',
            title: 'Advice Forum',
          },
          {
            link: '',
            title: category.get('name'),
          },
        ]
      : [
          {
            link: '',
            title: 'Advice',
          },
        ];
    return (
      <div>
        <Helmet title={helmetTitle} />
        <Breadcrumbs path={fromJS(path)} />
        <Banner
          expanded
          title={bannerTitle}
          titleElement="h2"
          subtitle={bannerDescription}
        />
        {isLoading ? (
          <Preloader />
        ) : (
          <ForumSearchContainer
            categories={categories}
            slug={slug}
            {...this.props}
          />
        )}
        <div className="row column fs-mn">
          <p>
            Information provided in this forum is user generated and should not
            be interpreted as and does not represent medical advice or
            recommendations of healthcare professional. The content is user
            generated commentary and discussion and is not intended to be a
            substitute for professional medical advice, diagnosis, or treatment.
            Always speak with a qualified healthcare professional before making
            medical decisions or if you have questions about your health, new
            medical treatments or products you would like to try. Never
            disregard professional medical advice or delay in seeking it because
            of something you have read on this website.
          </p>
          <p>
            Lift does not promote any product or represent that the products
            mentioned in the Forum or on Lift&apos;s website are treatment for
            any kind of medical condition. Lift cannot guarantee that
            information provided is error-free or complete and is not
            responsible for the quality of the information provided by users.
          </p>
          <p>
            Lift does not endorse any user reported information, any particular
            strain, product, producer, organization, treatment or therapy. Lift
            does not make representations regarding the use of cannabis and does
            not provide any of its own views on the use of cannabis, its
            benefits, or promotes its use.
          </p>
          <p>
            Information provided in this forum is user generated and should not
            be interpreted as and does not represent legal advice or
            recommendations of a legal professional. The content is user
            generated commentary and discussion and is not intended to be a
            substitute for professional legal advice. Always speak with a
            qualified legal professional before making legal decisions or if you
            have questions about a legal issue. Never disregard professional
            legal advice or delay in seeking it because of something you have
            read on this website.
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToPtops = state => ({
  isLoading: state.getIn(['forum', 'categories', 'isLoading']),
  categories: state.getIn(['forum', 'categories', 'data', 'hits']),
});

const mapDispatchToProps = dispatch => ({
  requestCategories: () => dispatch(requestCategories()),
  setMetaJson: (path, value) => dispatch(setMetaJson(path, value)),
});

export default compose(
  injectSagas({ key: 'forum', saga, reducer }),
  connect(
    mapStateToPtops,
    mapDispatchToProps
  )
)(ForumPage);
