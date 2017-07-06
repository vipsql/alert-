import './index.html'
import dva from 'dva'
import React from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import appLocaleZhData from 'react-intl/locale-data/zh'
import antdEn from 'antd/lib/locale-provider/en_US'
import appLocaleEnData from 'react-intl/locale-data/en'
import { addLocaleData, IntlProvider } from 'react-intl'
import { request } from './utils'
import Intl from 'intl'

global.Intl = Intl;

async function getMessages(lang) {
  let messages;
  if (typeof lang === 'string' && lang.indexOf('en') > -1) {
    messages = await request('#localAsset#../locales/en.json', { method: 'GET' });
  } else {
    messages = await request('#localAsset#../locales/zh.json', { method: 'GET' });
  }
  if (messages.result) {
    return messages.data;
  } else {
    console.error('can\'t resovle local asset file')
  }
}

async function setLang(lang) {
  lang = lang || localStorage.getItem('UYUN_LANGUAGE_CONSTANT') || 'zh-cn';
  const messages = await getMessages(lang)
  let appLocaleData
  switch (lang) {
    case 'en_US':
      appLocaleData = {
        messages,
        antd: antdEn,
        locale: 'en-us',
        data: appLocaleEnData,
      }
      // 内置属性
      window._severity = {
        "0": "Recovery",
        "1": "Information",
        "2": "Warning",
        "3": "Critical"
      }
      window._status = {
        "0": "Open",
        "40": "Acknowledged",
        "150": "Assigned",
        "190": "Resolved",
        "255": "Closed"
      }
      window._groupBy = 'GroupBy'
      break
    default:
      appLocaleData = {
        messages,
        antd: null,
        locale: 'zh-cn',
        data: appLocaleZhData,
      }
      // 内置属性
      window._severity = {
        "0": "恢复",
        "1": "提醒",
        "2": "警告",
        "3": "紧急"
      }
      window._status = {
        "0": "未接手",
        "40": "已确认",
        "150": "处理中",
        "190": "已解决",
        "255": "已关闭"
      }
      window._groupBy = '分组显示'

      break

  }
  window.__alert_appLocaleData = appLocaleData
  return appLocaleData
}

async function init() {
  const appLocale = await setLang();
  addLocaleData(appLocale.data);
  window.__Alert_WebNotification = null; // setInterval with webnotification
  // 1. Initialize
  const app = dva();
  const root = document.querySelector('#root')
  // 2. Model

  app.model(require('./models/app'))
  app.model(require('./models/alertManage'))
  // 告警列表
  app.model(require('./models/alertTagsSet'))
  app.model(require('./models/alertOperation'))
  app.model(require('./models/alertDetailOperation'))
  app.model(require('./models/tagsListFilter'))
  // app.model(require('./models/alertDetail'))

  app.model(require('./models/alertList'))
  app.model(require('./models/alertListTable'))
  // 告警查询
  app.model(require('./models/alertQuery'))
  app.model(require('./models/alertQueryDetail'))
  // 告警配置
  app.model(require('./models/alertConfig'))
  app.model(require('./models/snmpTrapRules'))
  // 关联规则
  app.model(require('./models/alertAssociationRules'))
  // 值班管理
  app.model(require('./models/watchManage'))
  // 可视化分析
  app.model(require('./models/visualAnalyze'))
  // 告警发生历史
  app.model(require('./models/alertOrigin'))
  // 3. Router
  app.router(require('./router'))

  // 4. Start
  const App = app.start();

  ReactDOM.render(
    <LocaleProvider locale={appLocale.antd}>
      <IntlProvider locale={appLocale.locale} messages={appLocale.messages}>
        <App />
      </IntlProvider>
    </LocaleProvider>,
    root);
}

init();
