import fetch from 'dva/fetch'
import constants from './constants'
import $ from 'jquery'
var Promise = require('es6-promise').Promise

const ROOT_PATH = constants.api_root;
//const jajax = require("robe-ajax")

function isApiUrl(url) {
  if (url.indexOf(ROOT_PATH) !== -1) {
    return url;
  }
  if (url.indexOf('chatops') > -1) {
    //return `http://${url}`
    return url;
  }

  return `${ROOT_PATH}${url}`;
}
// $.ajax({
//   method: 'get',
//   url: isApiUrl('/incident/tags/isSet')
// }).done((data) => {
//   alert(data)
// })
/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */

function ajax(url, options){
   return new Promise(function (resolve, reject) {
      const configs = {
        url,
        cache: false,
        method: options.method || 'GET',
        data: options.body,
        headers: {
          ...options.headers,
        },
        xhrFields: {
          //withCredentials: true
        },
        //timeout: 10000
      }
      $.ajax(configs).done( data => {
        resolve({
          result: true,
          data: data
        })
      }).fail((xhr, textStatus, error) => {
        if(textStatus == 401){
          location.href = location.origin + '/tenant/#/login_admin/'
        }else{
          resolve(xhr.responseJSON)
        }
      })
  })
}
export default async function request(url, options) {
  
      //options.credentials =  'include'
      const response = await ajax(isApiUrl(url), options)
      return response
      // const response = await fetch(isApiUrl(url), options)
      // const data = await response.json()
      // if (response.status >= 200 && response.status < 300) {
      //   return {
      //     result: true,
      //     data: data
      //   }
      // } else if(response.status == 401){
      //   // 未认证跳到租户
      //   location.href = location.origin + '/tenant/#/login_admin/'
      // }else{
      //   return data
      // }
    
}