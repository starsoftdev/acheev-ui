// @flow

import React, { Fragment, createElement } from 'react';
import Helmet from 'react-helmet';

import MetaJson from 'containers/MetaJson';

type Props = {
  title?: string,
  titlePostfix?: string,
  children?: any,
};
const HelmetComponent = ({
  title,
  children,
  titlePostfix = 'Lift & Co.',
  ...otherProps
}: Props) => {
  const finalTitle = title && `${title} - ${titlePostfix}`;
  const data = {
    '@context': 'http://schema.org',
    '@type': 'WebPage',
    name: finalTitle,
  };
  const props: Object = {
    ...otherProps,
  };
  if (finalTitle) {
    props.title = finalTitle;
  }
  return (
    <Fragment>
      {createElement(Helmet, props, children)}
      <MetaJson data={data} />
    </Fragment>
  );
};

export default HelmetComponent;
