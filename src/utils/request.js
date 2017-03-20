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
  if (response.status >= 200 && response.status < 300) {
    return response;
  }

  const error = new Error(response.statusText);
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
// export default async function request(url, options) {
  // var xhr = new XMLHttpRequest();
  // xhr.open("GET", isApiUrl(url), true);
  // xhr.setRequestHeader("Content-Type", options.headers.Content-Type);
  // xhr.send(null);

//   const response = await fetch(isApiUrl(url), options);
//     checkStatus(response);

//     const data = await response.json();
//     console.log(data);

//     return data;
// }

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request (url, options) {
    
    const httpUrl = isApiUrl(url)
    return Ajax.ajax({
      url: httpUrl,
      method: options.method || 'get',
      contentType: 'application/json',
      data: options.body || undefined,
      processData: options.method === 'get',
      dataType: 'JSON'
    }).done( (data, b, c) => {
      //console.log(c)
      return {
        result: true,
        data: data
      }
    }).fail( (xhr, textStatus, errorThrown) => {
      console.log(xhr);
      //console.log(textStatus);
      //console.log(typeof errorThrown)
    })
}
