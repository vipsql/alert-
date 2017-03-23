import fetch from 'dva/fetch';
import constants from './constants';
const Ajax = require('robe-ajax')

const ROOT_PATH = constants.api_root;

function isApiUrl(url) {
  if (url.startsWith(ROOT_PATH)) {
    return url;
  }

  return `${ROOT_PATH}${url}`;
}

function checkStatus(response) {
  debugger
  if (response.status >= 200 && response.status < 300) {
    return {
      result: true,
      data: response.json()
    }
  } else {
    return {
      result: false,
      data: Promise.resolve(response.json())
    }
  }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {

    const response = await fetch(isApiUrl(url), options);
    const data = await response.json()
    if (response.status >= 200 && response.status < 300) {
      return {
        result: true,
        data: data
      }
    } else {
      return data
    }
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
// export default function request (url, options) {
    
//     const httpUrl = isApiUrl(url)

//     return Ajax.ajax({
//       url: httpUrl,
//       method: options.method || 'get',
//       contentType: 'application/json',
//       data: options.body || undefined,
//       processData: options.method === 'get',
//       dataType: 'JSON'
//     }).done( (data) => {
//       return data
//     }).fail( (xhr, textStatus, errorThrown) => {
//       return xhr.responseJSON
//     })
// }
