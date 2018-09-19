// @flow

const title = (props: Object) => {
  if (!props) return '';
  const { name = '', type = '', prefix = '', postfix = '' } = props;
  if (!name) return '';
  const finalType = type === 'Doctor' ? 'Clinic' : type;
  const result = `${prefix} ${name}${
    name
      .trim()
      .toLowerCase()
      .endsWith(type.toLowerCase())
      ? ''
      : ` ${finalType}`
  } ${postfix}`;
  return result.trim();
};

export default title;
