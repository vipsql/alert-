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
    'result|1': [true, false],
    'message|1': ['保存成功', '保存失败'],
    'data': {
      'id|10000-100000': 1
    },
    'regex': /\/incident\/queryCondition\/save\//
  },
  '/incident/queryCondition/getAll': {
    'data|1-10': [
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
    'message|1': ['删除成功', '删除失败'],
    'regex': /\/incident\/queryCondition\/remove\//
  },
  '/applicationType/query': {
    regex: /\/applicationType\/query?/,
    template: [
      {
        "id": "58c681355b71a73b448ccec6",
        "name": "UYUN ITSM",
        "type": 1,
        "appType": "协同类"
      },
      {
        "id": "58c680df5b71a73b448ccec4",
        "name": "UYUN ChatOps",
        "type": 1,
        "appType": "协同类"
      },
      {
        "id": "58c680df5b71a73b448ccec7",
        "name": "UYUN WebHook",
        "type": 1,
        "appType": "协同类"
      },
    ]
  },
  // 是否有权限查询应用状态
  '/application/checkPayType': {
    "template|1": [true, false]
  },
  // 应用查询接口模拟
  '/application/query': {
    regex: /\/application\/query?/,
    'template|1-10': [
      {
        "id": "@string(10)",
        "tenant": "@string(10)",
        "status|1": [1, 0],
        "integration": "@string(10)",
        "applyType": {
          "id": "@string(10)",
          "name|1": ['UYUN ITSM', 'UYUN ChatOps', 'UYUN WebHook'],
          "type|1": [0, 1],
          "appType": "@name",
          "appAlias": "@cname"
        },
        "displayName": '@cname',
        "appKey": "@string(12)",
        "type|1": [0, 1],
        "buildIn|1": [0, 1],
        "createDate|1502035200524-1502812800524": 1,
        "webHook": {
          "url": "@url",
          "timeout|30-150": 1,
          "fidldMap": /(.*?):"\$\{(.*?)\}"/g
        },
        "appRules|1-5": [{
          "id": '@string(10)',
          "tenant": "@string(10)",
          "name": "@cname",
          "description": "@sentence",
          "dataSource": [1, 2, 3],
          "filterFields|1-5": [{

          }]
        }]
      }
    ]
  },
  '/application/create': {
    'template|1': [true, false]
  },
  '/application/update': {
    'template|1': [true, false]
  },
  '/application/getAppDetail': {
    regex: /\/application\/getAppDetail\//,
    'template': {
      "id": "@string(10)",
      "tenant": "@string(10)",
      "status|1": [1, 0],
      "integration": "@string(10)",
      "applyType": {
        "id": "@string(10)",
        "name|1": ['UYUN ITSM', 'UYUN ChatOps', 'UYUN WebHook', 'UYUN WebHook', 'UYUN WebHook', 'UYUN WebHook'],
        "type|1": [0, 1],
        "appType": "@name",
        "appAlias": "@cname"
      },
      "displayName": '@cname',
      "appKey": "@string(12)",
      "type|1": [0, 1],
      "buildIn|1": [0, 1],
      "createDate|1502035200524-1502812800524": 1,
      "webHook": {
        "url": "@url",
        "timeout|30-150": 1,
        "fieldMap": /^{(.*?):"\$\{(\d)\}"{1, 10}}$/g,
        "replyKey": '@string(5)',
        "replySuccess": '@string(2)',
        "requestMode|1": ['GET', 'POST']
      },
      "appRules|1-5": [{
        "id": '@string(10)',
        "tenant": "@string(10)",
        "name": "@cname",
        "description": "@sentence",
        "dataSource": [1, 2, 3],
        "filterFields|1-5": [{

        }]
      }]
    }
  },

  // 可视化接口
  '/visual/storeKeys': {
    'template': {
        "keys|3-5": ['@cname'],
        "level|1": [0, 1, 2, 3]
      }
  },

  '/visual/tagValuesInfo': {
    'template|10-20': [
      {
        "tagValue": "@cname",
        "severity": 3,
        "values|1-10": [
          {
            "value": "@cname",
            "severity|1": [0, 1, 2, 3]
          }
        ]
      }
    ]
  },

  '/visual/resStateInfo': {
    'template|10': [
      {
        "tagValue": '@cname',
        "resources|100": [
          {
            "resId": '@string(10)',
            "resName": '@cname',
            "severity|1": [0, 1, 2, 3],
            "iconUrl": '@url'
          }
        ]
      }
    ]
  },

  '/visual/resIncidents': {
    regex: /\/visual\/resIncidents\/? /,
    'template|1-5': [
      {
        "id": '@string(10)',
        "name": '告警：@cname',
        "severity|1": [0, 1, 2, 3],
        "iconUrl": '@url'
      }
    ]
  },
  'treeMap/tags/isSet': {
    regex: /\/treeMap\/tags\/isSet/,
    "template|1": [true, true]
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
  if (Mock) {
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
function invoke(url, rule, method = 'get', cb = () => { }) {
  let key = interceptURL(url);
  if (Mock) {
    Mock.mock(url, method, rule, () => cb());
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
