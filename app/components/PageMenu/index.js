// @flow

import * as React from 'react';
import type { List, Map } from 'immutable';
import cx from 'classnames';

import Link from 'components/Link';
import MobileDropdownMenu from './MobileDropdownMenu';
import DropdownMenu from './DropdownMenu';

import './styles.scss';

type Props = {
  data: List<Map<string, *>>,
  className?: string,
  linkPrefix?: string,
  mobileDropdownLabel?: string,
  location: Object,
  titlePath?: Array<string>,
  slugPath?: Array<string>,
  hasDropdown?: boolean,
};

const PageMenu = ({
  data,
  className,
  linkPrefix = '',
  mobileDropdownLabel,
  location,
  titlePath,
  slugPath,
  hasDropdown,
}: Props) => {
  if (!data || !location) {
    return null;
  }
  const mergedClassName = cx('pageMenu', className);
  const renderLink = value => (
    <Link
      className="pageMenu__link"
      activeClassName="pageMenu__link--active"
      to={`${linkPrefix}${value.getIn(slugPath)}`}
      exact
    >
      {value.getIn(titlePath)}
    </Link>
  );
  return (
    <div className={mergedClassName}>
      <div className="row align-justify show-for-large">
        {data.entrySeq().map(([key, value]) => (
          <div className="shrink column" key={key}>
            {hasDropdown ? (
              <DropdownMenu toggle={renderLink(value)}>
                <div className="pageMenu__dropdownContainer row">
                  {value
                    .getIn(['fields', 'posts'])
                    .entrySeq()
                    .map(([subKey, subValue]) => (
                      <div
                        className="pageMenu__dropdownItem small-2 columns"
                        key={subKey}
                      >
                        <Link
                          className="pageMenu__img"
                          to={`/magazine/${subValue.getIn(['fields', 'slug'])}`}
                          style={{
                            backgroundImage: `url(${subValue.getIn([
                              'fields',
                              'featuredImage',
                              'fields',
                              'file',
                              'url',
                            ])})`,
                          }}
                        />
                        <Link
                          to={`/magazine/${subValue.getIn(['fields', 'slug'])}`}
                          className="pageMenu__title"
                        >
                          {subValue.getIn(['fields', 'title'])}
                        </Link>
                      </div>
                    ))}
                </div>
              </DropdownMenu>
            ) : (
              renderLink(value)
            )}
          </div>
        ))}
      </div>
      <div className="row column np hide-for-large">
        <MobileDropdownMenu
          data={data}
          linkPrefix={linkPrefix}
          dropdownLabel={mobileDropdownLabel}
          location={location}
          titlePath={titlePath}
          slugPath={slugPath}
        />
      </div>
    </div>
  );
};

PageMenu.defaultProps = {
  mobileDropdownLabel: 'Section',
  titlePath: ['name'],
  slugPath: ['link'],
  hasDropdown: false,
};

export default PageMenu;
