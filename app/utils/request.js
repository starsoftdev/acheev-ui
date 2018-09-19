// @flow

import CONFIG from '../../app/conf';
import axios from 'axios';

/**
 * Returns the data returned by axios request
 *
 * @param  {object} response A response from axios request
 *
 * @return {object.data}          .data field of parsed JSON from the request
 */
function returnResponse(response) {
  return response;
}

/**
 * Checks if axios request came back fine, and throws an error if not
 *
 * @param  {object} response   A response from axios request
 *
 * @return {undefined} Logs to console either the response, an error or config of the request
 */
function checkStatus(error) {
  /* istanbul ignore if */
  if (CONFIG.LOG) {
    console.log(error); // eslint-disable-line no-console
  }
}

/**
 * Requests a URL, returning a promise
 *
 * @return {object}           The response schema:
 * {
 *  data: {}, // `data` is the response that was provided by the server
 *  status: 200, // `status` is the HTTP status code from the server response
 *  statusText: 'OK', // `statusText` is the HTTP status message from the server response
 *  headers: {}, // `headers` the headers that the server responded with
 *  config: {} // `config` is the config that was provided to `axios` for the request
 * }
 */

type Options = {
  url: string,
  method: string,
  headers?: Object,
  params?: Object,
  data?: Object,
  // ...otherOptions // See docs for full list of options here: https://github.com/mzabriskie/axios
};

axios.defaults.validateStatus = status => status >= 200 && status <= 500;

export default function request(options: Options) {
  return axios(options)
    .then(returnResponse)
    .catch(checkStatus);
}
