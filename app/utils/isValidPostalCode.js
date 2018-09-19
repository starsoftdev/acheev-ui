// @flow

const isValidPostalCode = (postalCode: string) => {
  if (postalCode === '') {
    return true;
  }
  if (!postalCode) {
    return false;
  }
  const trimmedPostalCode = postalCode.toString().trim();
  const ca = new RegExp(/^[A-Za-z]\d[A-Za-z][ -]?\d[A-Za-z]\d$/);
  if (ca.test(trimmedPostalCode.toString().replace(/\W+/g, ''))) {
    return true;
  }
  return false;
};

export default isValidPostalCode;
