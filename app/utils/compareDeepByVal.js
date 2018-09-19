// @flow

import isObject from './isObject';

export default function compareDeepByVal(obj1: any, obj2: any) {
  let isEqual = true;
  if (!isObject(obj1) || !isObject(obj2)) {
    return obj1 == obj2; // eslint-disable-line eqeqeq
  }

  Object.keys(obj1).forEach(key => {
    if (!compareDeepByVal(obj1[key], obj2[key])) {
      isEqual = false;
    }
  });

  Object.keys(obj2).forEach(key => {
    if (typeof obj1[key] === 'undefined') isEqual = false;
  });

  return isEqual;
}
