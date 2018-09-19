import isObject from './isObject';

function checkObject(obj) {
  return (
    Object.prototype.hasOwnProperty.call(obj, 'value') &&
    Object.prototype.hasOwnProperty.call(obj, 'label')
  );
}

export default function deepReplace(obj) {
  if (!obj) return obj;

  let out;
  if (Array.isArray(obj)) {
    out = [];
  } else {
    out = {};
  }

  if (checkObject(obj)) {
    return obj.value;
  }

  Object.keys(obj).forEach(key => {
    let val;

    if (isObject(obj[key]) && !checkObject(obj[key])) {
      val = deepReplace(obj[key]);
    } else if (isObject(obj[key]) && checkObject(obj[key])) {
      val = {
        name: obj[key].value,
        value: obj[key].strength || 5,
      };
    } else {
      val = obj[key];
    }

    out[key] = val;
  });

  return out;
}
