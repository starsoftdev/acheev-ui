// @flow

const encodeURI = (obj: Object) => encodeURIComponent(JSON.stringify(obj));
export default encodeURI;
