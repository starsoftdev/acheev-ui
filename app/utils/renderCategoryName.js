// @flow

const renderCategoryName = (category: string) => {
  let name = `${category.toLowerCase()}`;
  if (category === 'Product') {
    name = 'accessory';
  }
  if (name === 'oil' || name === 'accessory') {
    name = `an ${name}`;
  } else {
    name = `a ${name}`;
  }
  return name;
};

export default renderCategoryName;
