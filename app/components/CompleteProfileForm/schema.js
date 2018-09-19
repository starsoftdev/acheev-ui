// @flow

import yup from 'yup';
import moment from 'moment';

import isValidPostalCode from 'utils/isValidPostalCode';
import isValidStringOnly from 'utils/isValidStringOnly';

const validStringOnlyMessage =
  'Please do not use numbers or special characters ($, %, #, etc)';

export const schema1 = yup.object({
  firstName: yup
    .string()
    .test('firstNameTest', validStringOnlyMessage, val =>
      isValidStringOnly(val)
    ),
  lastName: yup
    .string()
    .test('lastNameTest', validStringOnlyMessage, val =>
      isValidStringOnly(val)
    ),
  yearOfBirth: yup.number().required(),
  address: yup.string(),
  province: yup.string(),
  postalCode: yup
    .string()
    .required()
    .test('match', code => isValidPostalCode(code)),
  gender: yup
    .string()
    .required()
    .oneOf(['male', 'female', 'other']),
  cannabisExperience: yup.string().required(),
});

export const schema2 = yup.object({
  firstName: yup
    .string()
    .required()
    .test('firstNameTest', validStringOnlyMessage, val =>
      isValidStringOnly(val)
    ),
  lastName: yup
    .string()
    .required()
    .test('lastNameTest', validStringOnlyMessage, val =>
      isValidStringOnly(val)
    ),
  birthday: yup
    .date('You must enter a valid date.')
    .max(new Date(), "You can't be born in the future!"),
  address: yup.string().required(),
  province: yup.string().required(),
  postalCode: yup.string().test('match', code => isValidPostalCode(code)),
  gender: yup.string().oneOf(['male', 'female', 'other']),
  cannabisExperience: yup.string(),
});
