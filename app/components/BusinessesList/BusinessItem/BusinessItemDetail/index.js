// @flow

import React, { Component } from 'react';
import Link from 'components/Link';
import cx from 'classnames';

import Button from 'components/Button';

import './styles.scss';

type Props = {
  data: Object,
  category: string,
  className?: string,
  onClickViewOnMap: Function,
};

class BusinessItemDetail extends Component<Props> {
  onClickViewOnMap = () => {
    this.props.onClickViewOnMap(this.props.data);
  };
  render() {
    const { data, category, className } = this.props;
    const email = data.get('email');
    const telephone = data.get('telephone');
    const website = data.get('website');
    const address = data.getIn(['locations', 0, 'address']);
    const city = data.getIn(['locations', 0, 'city']);
    const province = data.getIn(['locations', 0, 'province']);
    const postalCode = data.getIn(['locations', 0, 'postalCode']);

    const slug = data.get('slug');
    const containerClassName = cx('businessItemDetail', className);
    return (
      <div className={containerClassName}>
        <div className="row mb-lg">
          <div className="small-12 columns text-left">
            <Link
              className="businessItemDetail__actionLink"
              to={`/${category}/${slug}`}
            >
              <Button element="button" className="secondary mr-mn">
                View Profile
              </Button>
            </Link>
            <Button
              element="button"
              className="mr-mn hide-for-small-only"
              onClick={this.onClickViewOnMap}
            >
              View On Map
            </Button>
          </div>
        </div>
        <div className="row mb-lg fs-md text-left">
          <div className="small-12 columns">{address}</div>
          <div className="small-12 columns">{postalCode}</div>
          <div className="small-12 columns">
            {city}, {province}
          </div>
          <div className="small-12 columns">Canada</div>
        </div>
        <div className="row mb-lg">
          {telephone && (
            <div className="columns text-left small-12">{telephone}</div>
          )}
          {email && (
            <div className="columns text-left small-12">
              <a href={`mailto:${email}`} className="t-lowercase">
                {email}
              </a>
            </div>
          )}
          {website && (
            <div className="columns text-left small-12">
              <a href={website} className="t-lowercase">
                {website}
              </a>
            </div>
          )}
        </div>
      </div>
    );
  }
}

export default BusinessItemDetail;
