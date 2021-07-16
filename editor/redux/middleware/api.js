/*****
 * Local
 */
// constant
import { API_HOST, API_PATH } from 'constants/msConstant';
import { END_REASON } from 'constants/Log';
// Log
import MSLog from 'utils/MSLog';

const handleResponse = (res, path) => {
  if (res.ok) return res.json().then(json => ({ json, res }));

  return Promise.reject(res.statusText);
};

export const API = {
  post: (path, payload, token) => {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return fetch(API_HOST + API_PATH + path, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload)
    })
      .then(res => {
        return handleResponse(res, path);
      })
      .then(({ json, res }) => {
        return json;
      })
      .catch(error => {
        MSLog({
          code: END_REASON.API_SERVER_ERROR,
          error,
          extraInfo: { path }
        });
        return Promise.reject(error);
      });
  },
  fetch: (path, payload, token) => {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    return fetch(path, {
      method: payload.method,
      headers,
      body: payload.body
    })
      .then(res => {
        return handleResponse(res, path);
      })
      .then(({ json, res }) => {
        const { result_code } = json;
        if (Number(result_code) >= 200 && Number(result_code) < 300) {
          return json;
        }

        MSLog({
          code: END_REASON.ERROR_RESPONSE,
          error: new Error('잘못된 요청입니다.'),
          extraInfo: { path }
        });
      })
      .catch(error => {
        MSLog({
          code: END_REASON.API_SERVER_ERROR,
          error,
          extraInfo: { path }
        });
        return Promise.reject(error);
      });
  },
  getData: (path, payload, token) => {
    let headers = {
      Accept: 'application/json',
      'Content-Type': 'application/json'
    };

    if (token) {
      headers['Authorization'] = 'Bearer ' + token;
    }

    return fetch(path, {
      method: 'GET',
      headers
    })
      .then(res => {
        return handleResponse(res, path);
      })
      .then(({ json, res }) => {
        return json;
      })
      .catch(error => {
        MSLog({
          code: END_REASON.API_SERVER_ERROR,
          error,
          extraInfo: { path }
        });
        return Promise.reject(error);
      });
  }
};
