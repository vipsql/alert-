import fetch from 'dva/fetch';
import constants from './constants'


const ROOT_PATH = constants.api_root;

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

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, options) {
  
      options.credentials =  'include'
    
      const response = await fetch(isApiUrl(url), options);
      const data = await response.json()
      if (response.status >= 200 && response.status < 300) {
        return {
          result: true,
          data: data
        }
      } else if(response.status == 401){
        // 未认证跳到租户
        location.href = location.origin + '/tenant/#/login_admin/'
      }else{
        return data
      }
    
}

