// @flow

import React from 'react';
import { getIn } from 'utils/immutable';
import type { Map } from 'immutable';
import { startsWith } from 'lodash-es';

import Helmet from 'components/Helmet';

type Props = {
  data: Map<*, *>,
  title?: string,
  titlePostfix?: string,
  ogImage?: string,
};

const PageMeta = ({ data, title, titlePostfix = 'Acheev', ogImage }: Props) => {
  const finalTitle = getIn(data, ['title'], '') || title;
  const description = getIn(data, ['description'], '');
  const image = getIn(data, ['ogImage', 'fields', 'file', 'url'], ogImage);
  const finalImage = startsWith(image, '//') ? `https:${image}` : image;
  return (
    <Helmet>
      <title>
        {finalTitle ? `${finalTitle} - ${titlePostfix}` : titlePostfix}
      </title>
      <meta name="description" content={description} />
      <meta name="twitter:creator" content={getIn(data, ['twitterCreator'])} />
      <meta name="twitter:image" content={finalImage} />
      <meta property="og:url" content={window.location.href} />
      <meta property="og:title" content={finalTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={finalImage} />
    </Helmet>
  );
};

export default PageMeta;
