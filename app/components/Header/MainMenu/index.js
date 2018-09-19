// @flow

import * as React from 'react';
import { generate } from 'shortid';
import cx from 'classnames';
import type { Map } from 'immutable';

import GlobalSearch from 'components/GlobalSearch';
import DropdownMenu from './DropdownMenu';
import SubMenu from './SubMenu';
import MenuItem from './MenuItem';

import './styles.scss';

type Props = {
  items: Array<Object>,
  authRoute?: boolean,
  requestGlobalSearch?: Function,
  globalSearchFilter?: Map<*, *>,
  globalSearchData?: Map<string, Object>,
  isGlobalSearchLoading?: boolean,
  justified?: boolean,
  secondary?: boolean,
  pathname?: string,
};

const MainMenu = ({
  items,
  authRoute,
  requestGlobalSearch,
  globalSearchFilter,
  globalSearchData,
  isGlobalSearchLoading,
  justified,
  secondary,
  pathname,
}: Props) => {
  const className = cx('mainMenu', {
    'mainMenu--justified': justified,
    'mainMenu--secondary': secondary,
  });
  return (
    <div className={className}>
      {!authRoute &&
        requestGlobalSearch &&
        globalSearchFilter &&
        globalSearchData && (
          <div className="small-12 column align-self-right show-for-small-only">
            <GlobalSearch
              filter={globalSearchFilter}
              isLoading={isGlobalSearchLoading}
              data={globalSearchData}
              requestGlobalSearch={requestGlobalSearch}
            />
          </div>
        )}
      {items.map(
        ({ text, link, children, exact }) =>
          children ? (
            <div key={generate()} className="mainMenu__item">
              <DropdownMenu
                data={children}
                text={text}
                link={link}
                className="hide-for-small-only"
              />
              <SubMenu
                data={children}
                text={text}
                className="show-for-small-only"
              />
            </div>
          ) : (
            <MenuItem
              text={text}
              link={link}
              linkClassName={cx('mainMenu__link--topLevel')}
              key={generate()}
              exact={exact}
              pathname={pathname}
            />
          )
      )}
    </div>
  );
};

export default MainMenu;
