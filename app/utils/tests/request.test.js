import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

import request from '../request';
const mock = new MockAdapter(axios);

describe('request', () => {
  // After each test, restore the original adapter (which will remove the mocking behavior)
  afterEach(() => {
    mock.restore();
  });

  describe('stubbing successful response', () => {
    // Before each test, pretend we got a successful response
    beforeEach(() => {
      mock.onGet('/thisurliscorrect').reply(200, {
        hello: 'world',
      });
    });

    it('should format the response correctly', done => {
      request('/thisurliscorrect')
        .catch(done)
        .then(json => {
          expect(json.data.hello).toBe('world');
          done();
        });
    });
  });
  describe('stubbing error response', () => {
    // Before each test, pretend we got an unsuccessful response
    beforeEach(() => {
      mock.onGet('/thisdoesntexist').reply(404);
    });

    it('should return undefined for error responses', done => {
      request('/thisdoesntexist')
        .catch(done)
        .then(json => {
          expect(json).toBeUndefined();
          done();
        });
    });
  });
});
