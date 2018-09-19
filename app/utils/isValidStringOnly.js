// @flow

const isValidStringOnly = (value: string) => {
  if (!value) {
    return true;
  }
  const trimmedValue = value.toString().trim();
  const ca = new RegExp(/^[A-z-]+$/);
  if (ca.test(trimmedValue)) {
    return true;
  }
  return false;
};

export default isValidStringOnly;
