// @flow

import CONFIG from '../../../conf';
import React, { Component } from 'react';
import Link from 'components/Link';
import Icon from 'components/Icon';
import Tooltip from 'components/Tooltip';

import ReviewCount from 'components/ReviewCount';
import BusinessItemDetail from 'components/BusinessesList/BusinessItem/BusinessItemDetail';

import ChevronDown from 'images/sprite/chevron-down.svg';
import ChevronUp from 'images/sprite/chevron-up.svg';
import Active from 'images/sprite/active.svg';
import Promoted from 'images/sprite/promoted.svg';
import LiftPoints from 'images/sprite/Icon-LiftPoints.svg';
import Virtual from 'images/sprite/Icon-Virtual.svg';
import ProductReview from 'images/sprite/Icon-ProductReview.svg';
import BusinessReview from 'images/sprite/Icon-BusinessReview.svg';

import './styles.scss';

type Props = {
  data: Object,
  onClickViewOnMap: Function,
  category: string,
};

class BusinessItem extends Component<
  Props,
  {
    isToggled: boolean,
  }
> {
  constructor(props: Props) {
    super(props);
    this.state = {
      isToggled: false,
    };
  }

  onToggleItem = () => {
    this.setState({ isToggled: !this.state.isToggled });
  };

  render() {
    const { data, category } = this.props;
    const name = data.get('name');
    const slug = data.get('slug');
    const placeholderImg = `http://via.placeholder.com/70x70?text=${name}`;
    const thumbnail = data.get('thumbnail') || placeholderImg;
    return (
      <div id={slug} className="businessItem mb-xl">
        <div className="row mb-sm">
          <div className="shrink column">
            <Link
              className="businessItem__titleLink"
              to={`/${category}/${slug}`}
            >
              <div
                className="businessItem__image"
                style={{
                  backgroundImage: `url('${CONFIG.APP.CDN_URL}/resize/70x70/${thumbnail}')`,
                }}
              />
            </Link>
          </div>
          <div className="column text-left">
            <div className="row">
              {data.getIn(['features', 'promoted']) && (
                <div className="shrink column npr mb-sm">
                  <Tooltip
                    tooltipPosition="top"
                    tooltipIndicator={false}
                    tooltipContent="Featured business"
                  >
                    <div>
                      <Icon glyph={Promoted} size={20} />
                    </div>
                  </Tooltip>
                </div>
              )}
              {!!data.get('admins').size && (
                <div className="shrink column npr mb-sm">
                  <Tooltip
                    tooltipPosition="top"
                    tooltipIndicator={false}
                    tooltipContent="This business is active on Lift"
                  >
                    <div>
                      <Icon glyph={Active} size={20} />
                    </div>
                  </Tooltip>
                </div>
              )}
              {data.getIn(['features', 'points']) && (
                <div className="shrink column npr mb-sm">
                  <Tooltip
                    tooltipPosition="top"
                    tooltipIndicator={false}
                    tooltipContent="This business has products that you can buy with lift points"
                  >
                    <div>
                      <Icon glyph={LiftPoints} size={20} />
                    </div>
                  </Tooltip>
                </div>
              )}
              {data.getIn(['features', 'virtual']) && (
                <div className="shrink column npr mb-sm">
                  <Tooltip
                    tooltipPosition="top"
                    tooltipIndicator={false}
                    tooltipContent="Virtual business"
                  >
                    <div>
                      <Icon glyph={Virtual} size={20} />
                    </div>
                  </Tooltip>
                </div>
              )}
            </div>
            <div className="businessItem__title">
              <Link
                className="businessItem__titleLink t-capitalize mb-lg"
                to={`/${category}/${slug}`}
              >
                <h4 className="businessItem__name">{name}</h4>
              </Link>
              <Icon
                glyph={this.state.isToggled ? ChevronUp : ChevronDown}
                size={12}
                onClick={this.onToggleItem}
                className="businessItem__icon"
              />
            </div>
          </div>
        </div>
        <div className="row mb-lg">
          <div className="column businessItem__detailSection">
            {category === 'producers' && (
              <ReviewCount
                className="mb-md"
                reviewCount={data.get('productReviewCount') || 0}
                ratingsAverage={data.get('productRating')}
                to={`/${category}/${slug}/product-reviews`}
                prefixIcon={ProductReview}
                type="product"
              />
            )}
            <ReviewCount
              className="mb-md"
              reviewCount={data.get('reviewCount')}
              ratingsAverage={data.get('rating')}
              to={`/${category}/${slug}/reviews`}
              prefixIcon={BusinessReview}
              type="business"
            />
            <BusinessItemDetail
              className={this.state.isToggled ? '' : 'hide'}
              data={data}
              category={category}
              onClickViewOnMap={this.props.onClickViewOnMap}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default BusinessItem;
