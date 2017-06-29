import menu from './menu'
import bottomMenus from './bottomMenu'
import request from './request'
import classnames from 'classnames'
import {color} from './theme'

/**
 * Return random getUUID
 *  
 * @param {Number} len
 * @return {String}
 * @api private
 */
function getUUID(len) {
  var buf = []
    , chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
    , charlen = chars.length;

  for (var i = 0; i < len; ++i) {
    buf.push(chars[getRandomInt(0, charlen - 1)]);
  } 

  return buf.join('');
}

/**
 * Return a random Number
 * 
 * @param {Number} min
 * @param {Number} max
 * @return {Number}
 * @api private
 */
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// 拼接url
function packURL(url, params){
  let queryString = url.indexOf('?') < 0 ? '?' : ''
  for(let prop in params){
    queryString += prop + '=' + params[prop] + '&'
  }
  queryString = queryString.substring(0,queryString.length - 1)
  return url + queryString
}

/**
 * Return Browser type
 */
function browser() {
  var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
  var isIE = -[1,];
  if (userAgent.indexOf("Opera") > -1) {
    return "Opera"
  } //判断是否Opera浏览器
  if (userAgent.indexOf("Firefox") > -1) {
    return "Firefox";
  } //判断是否Firefox浏览器
  if (userAgent.indexOf("Chrome") > -1) {
    return "Chrome";
  }
  if (userAgent.indexOf("Safari") > -1) {
    return "Safari";
  } //判断是否Safari浏览器
  if (userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera) {
    return "IE";
  } //判断是否IE浏览器
  if (isIE) {
    return 'IE';
  }
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

/**
 *  前端分组
 */
function groupSort() {
  var map = {};
  var count = -1;
  return function(originArr, groupSource) {
    var targetArr = [];
    originArr.forEach( (obj) => {
      if (!map.hasOwnProperty(obj[groupSource])) {
        map[obj[groupSource]] = {
          classify: obj[groupSource],
          children: []
        }
        map[obj[groupSource]].children.push(obj);
        targetArr[++count] = map[obj[groupSource]];
      } else {
        map[obj[groupSource]].children.push(obj);
      }
    })
    return targetArr;
  }
}

module.exports = {
  menu,
  bottomMenus,
  packURL,
  request,
  color,
  classnames,
  getUUID,
  groupSort,
  browser
}
