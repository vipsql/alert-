import Mock from 'mockjs'
/**
 * Intercept fidld
 */
const __Intercept = 'api/v2'

/**
 * data rule (Alert 的接口的key和service统一, 其他产品的一律使用全URL作为key)
 * DTD: https://github.com/nuysoft/Mock/wiki/Syntax-Specification
 * DPD: https://github.com/nuysoft/Mock/wiki/Mock.Random
 */
const __DataRule = {
  /* key: url -> value: rule */
  '/incident/tags/isSet': '@boolean',
  '/incident/queryCondition/save': {
    'id|10000-100000': 1
  },
  '/incident/queryCondition/getAll': {
    'list|1-10': [
      {
        'name': '@name',
        'id|+1': 100,
        'incidentHistoryParam|1-13': {
          "source": "@name",
          "severity|1": ['0', '1', '2', '3'],
          "status|1": ['0', '40', '150', '190', '255'],
          "duration|1": ['1', '2', '3', '4', '5'],
          "count|1": ['1', '2', '3', '4'],
          "isNotify|1": ['true', 'false'],
          "keyWordsType|1": ['1', '2', '3', '4', '5', '6', '100'],
          "keyWords": "@name",
          'keyName|1': ['', '', '', '', '@name'],
          "ownerId": "",
          "begin|1502035200524-1502812800524": 1,
          "end|1502812800524-1503590400561": 1,
          "lastBegin|1502035200524-1502812800524": 1,
          "lastEnd|1502812800524-1503590400561": 1
        }
      }
    ]
  },
  '/incident/queryCondition/remove': {
    'result|1': [true, false],
    'message|1': ['删除成功', '删除失败']
  }
}

/**
 * Intercept URL
 */
function interceptURL(url) {
  if (url.indexOf(__Intercept) > -1) {
    return url.slice(url.indexOf(__Intercept) + __Intercept.length, url.length);
  }
  return url;
}

/**
 * Set up timeout (current)
 * @param {Object} config
 */
function setup(config = { timeout: '200-600' }) {
  Mock.setup({
    ...config
  })
}

/**
 * valid response data
 * @param {Object} data  response data
 * @param {Function} callback
 */
function valid(url, data, cb = () => { }) {
  data = true
  let warning = undefined;
  let key = interceptURL(url);
  if (Mock && Object.keys(__DataRule).indexOf(key) > -1) {
    Mock.valid(__DataRule[key], data)
    warning = `${key} Interface response data error to template rule`;
  }
  cb(warning, data)
}

/**
 * invoke mock request
 * @param {string} url    request url (toLowerCase)
 * @param {string} method request method
 * @param {Function} callback
 */
function invoke(url, method = 'get', cb = () => { }) {
  let key = interceptURL(url);
  if (Mock) {
    if (Object.keys(__DataRule).indexOf(key) > -1) {
      Mock.mock(url, method, __DataRule[key], () => cb());
    } else {
      throw new Error('URL no match rule generate data')
    }
  } else {
    throw new Error('Invalid Mock by mockjs')
  }
}

module.exports = {
  setup,
  invoke,
  valid,
  rule: __DataRule
}
