// @flow

// TODO: create a test for this util when tests are fixed

import qs from 'qs';

const parseSearch = (search: string) =>
  qs.parse(search, { ignoreQueryPrefix: true });

export default parseSearch;
