import menu from './menu'
import request from './request'
import classnames from 'classnames'
import {color} from './theme'

// 拼接url
function packURL(url, params){
  let queryString = url.indexOf('?') < 0 ? '?' : ''
  for(let prop in params){
    queryString += prop + '=' + params[prop] + '&'
  }
  queryString = queryString.substring(0,queryString.length - 1)
  return url + queryString
}

// 日期格式化
Date.prototype.format = function (format) {
  var o = {
    'M+': this.getMonth() + 1,
    'd+': this.getDate(),
    'h+': this.getHours(),
    'H+': this.getHours(),
    'm+': this.getMinutes(),
    's+': this.getSeconds(),
    'q+': Math.floor((this.getMonth() + 3) / 3),
    'S': this.getMilliseconds()
  }
  if (/(y+)/.test(format)) { format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length)) }
  for (var k in o) {
    if (new RegExp('(' + k + ')').test(format)) {
      format = format.replace(RegExp.$1, RegExp.$1.length === 1
        ? o[k]
        : ('00' + o[k]).substr(('' + o[k]).length))
    }
  }
  return format
}

module.exports = {
  menu,
  packURL,
  request,
  color,
  classnames
}
