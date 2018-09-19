// @flow

import React, { Component } from 'react';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { history } from 'components/ConnectedRouter';
import { generate } from 'shortid';
import { get } from 'utils/immutable';
import title from 'utils/title';

import ButtonGroup from 'components/ButtonGroup';
import Tab from 'components/RouterTab';
import BorderedTitle from 'components/BorderedTitle';
import PhotoList from 'components/PhotoList';
import Select from 'components/Select';
import Helmet from 'components/Helmet';

import pluralizeCategory from 'utils/pluralizeCategory';

import {
  requestProductPhotos,
  setBreadcrumbPath,
} from 'containers/Product/sagas';

type Props = {
  setBreadcrumbPath: Function,
  requestProductPhotos: Function,
  data: Object,
  isLoading: boolean,
  photosData: Object,
  photosLoading: boolean,
  slug: string,
};

class ProductPhotosPage extends Component<Props> {
  componentDidMount() {
    const { data } = this.props;
    if (data) {
      this.props.requestProductPhotos(data.get('_id'));
      this.setBreadcrumbPath(data);
    }
  }

  componentDidUpdate(oldProps: Props) {
    const { isLoading, data, photosLoading } = this.props;
    const wasLoadingProduct = oldProps.isLoading;
    const id = get(data, '_id');
    const isProductLoaded = isLoading === false && !!data && !!id;

    if (!photosLoading && wasLoadingProduct && isProductLoaded) {
      this.props.requestProductPhotos(id);
      this.setBreadcrumbPath(data);
    }
  }

  setBreadcrumbPath = (data: Object) => {
    const { slug } = this.props;
    const category = pluralizeCategory(get(data, '__t'));
    const breadcrumbPath = fromJS([
      {
        link: `/${category}`,
        title: `${category}`,
      },
      {
        link: `/${category}/${slug}`,
        title: get(data, 'name', ''),
      },
      {
        link: '',
        title: 'Photos',
      },
    ]);
    this.props.setBreadcrumbPath(breadcrumbPath);
  };

  render() {
    const { data, photosData, photosLoading, slug } = this.props;
    let photosCount = 0;
    if (photosData) {
      photosCount = photosData.size;
    }
    const type = get(data, '__t');
    const baseUrl = `/${pluralizeCategory(type)}/${slug}`;
    return (
      <div className="row column mb-xl">
        <Helmet
          title={title({ name: get(data, 'name'), type, postfix: 'Photos' })}
        />
        <ButtonGroup className="centered mb-lg hide-for-small-only">
          <Tab to={baseUrl}>About</Tab>
          <Tab to={`${baseUrl}/reviews`}>Reviews</Tab>
          <Tab to={`${baseUrl}/photos`}>Photos</Tab>
        </ButtonGroup>
        <Select
          className="blackTheme mb-lg show-for-small-only b-primary"
          value="Photos"
          onChange={e =>
            history.push(`${baseUrl}/${e.target.value.toLowerCase()}`)
          }
        >
          {['About', 'Reviews', 'Photos'].map(item => (
            <option key={generate()} value={item}>
              {item}
            </option>
          ))}
        </Select>
        <BorderedTitle>{photosCount} photos</BorderedTitle>
        <section>
          <PhotoList data={photosData} isLoading={photosLoading} />
        </section>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  data: state.getIn(['product', 'data', 'hits', 0]),
  isLoading: state.getIn(['product', 'isLoading']),
  slug: state.getIn(['product', 'slug']),
  id: state.getIn(['product', 'id']),
  photosData: state.getIn(['product', 'photos', 'data', 'hits']),
  photosLoading: state.getIn(['product', 'photos', 'isLoading']),
});

const mapDispatchToProps = dispatch => ({
  requestProductPhotos: id => dispatch(requestProductPhotos(id)),
  setBreadcrumbPath: path => dispatch(setBreadcrumbPath(path)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProductPhotosPage);
