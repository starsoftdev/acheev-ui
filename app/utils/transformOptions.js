// Transform array of strings to array of the following objects
// { value: '', label: '' } in order to use with react-select

import { Iterable } from 'immutable';

const transformOptions = (data, includeALL = false, valueField = 'slug') => {
  const transformedData = [];
  if (!data) return transformedData;
  let jsData;
  if (Iterable.isIterable(data)) {
    jsData = data.toJS();
  } else {
    jsData = data;
  }
  if (includeALL) {
    transformedData.push({
      value: 'all',
      label: 'ALL',
    });
  }
  jsData.map(item => {
    if (typeof item === 'object') {
      if (
        valueField === 'slug' &&
        Object.prototype.hasOwnProperty.call(item, 'slug')
      ) {
        transformedData.push({
          value: item.slug,
          label: item.name ? item.name : item.slug,
        });
      } else if (
        Object.prototype.hasOwnProperty.call(item, '_id') &&
        Object.prototype.hasOwnProperty.call(item, 'name')
      ) {
        transformedData.push({
          value: item._id,
          label: item.name,
        });
      } else {
        transformedData.push(item);
      }
    } else {
      transformedData.push({
        value: item,
        label: item,
      });
    }
    return transformedData;
  });
  return transformedData;
};

export default transformOptions;
