export default function transformString(value) {
  if (value && typeof value === 'string') {
    if (value.toLowerCase() === 'null') {
      return null;
    }
    if (value.toLowerCase() === 'undefined') {
      return undefined;
    }
    if (value.toLowerCase() === 'nan') {
      return NaN;
    }
  }
  return value;
}
