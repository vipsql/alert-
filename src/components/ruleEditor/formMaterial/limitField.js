let multiple = window.__alert_appLocaleData.locale === 'zh-cn' ? 1 : 3;

export default {
  "config" : {
    "defaultValue" :100 * multiple,
    "textarea" : 500 * multiple,
    "description" : 500 * multiple,
    "options" : 10 * multiple,
    'modelDesc' : 50 * multiple,
    "triggrTen" : 10 * multiple,
    "triggrFifty" : 50 * multiple,
    "orgName" : 7 * multiple,
    "userName" : 7 * multiple,
    'modelName' : 10 * multiple,
    'modelProcessName' : 10 * multiple
  },
  "ticket" : {
    "ticketDesc" : 500 * multiple,
    'content' : 50 * multiple,
    "creatTitle" : 30 * multiple,
  },
  "catlot": {
    "catlogName": 15 * multiple,
    "title": 15 * multiple,
    "desc": 150 * multiple,
    "serviceTimeName": 10 * multiple
  },
  "model": {
    "proRuleName": 10 * multiple,
    "RuleExplain": 20 * multiple
  },
  "SLA":{
    'name':10 * multiple,
    "desc":50 * multiple
  }
}