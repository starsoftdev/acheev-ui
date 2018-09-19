// @flow

const regex = /([0-9]{1,2})+\.([1-9])([0-9])?/gi;
export default (text: string) => (text ? text.replace(regex, '$1.$2') : 'N/A');
