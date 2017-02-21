const Ajax = require('robe-ajax')

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request (url, options) {
  if (options.cross) {
    return Ajax.getJSON('http://query.yahooapis.com/v1/public/yql', {
      q: "select * from json where url='" + url + '?' + Ajax.param(options.data) + "'",
      format: 'json'
    })
  } else {
    
    return Ajax.ajax({
      url: url,
      method: options.method || 'get',
      data: options.data || {},
      processData: options.method === 'get',
      contentType: 'application/json',
      dataType: 'JSON'
    }).done((data) => {
      return data
    })
  }
}
// import fetch from 'dva/fetch';
// import constants from './constants';
//
// const ROOT_PATH = constants.api_root;
//
// function isApiUrl(url) {
//   if (url.startsWith(ROOT_PATH)) {
//     return url;
//   }
//   return `${ROOT_PATH}${url}`;
// }
//
// function checkStatus(response) {
//   if (response.status >= 200 && response.status < 300) {
//     return response;
//   }
//
//   const error = new Error(response.statusText);
//   error.response = response;
//   throw error;
// }
//
// /**
//  * Requests a URL, returning a promise.
//  *
//  * @param  {string} url       The URL we want to request
//  * @param  {object} [options] The options we want to pass to "fetch"
//  * @return {object}           An object containing either "data" or "err"
//  */
// export default async function request(url, options) {
//   const response = await fetch(isApiUrl(url), options);
//     checkStatus(response);
//
//     const data = await response.json();
//
//     return data;
// }
