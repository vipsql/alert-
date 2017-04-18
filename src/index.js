import './index.html'
import dva from 'dva'
import React from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import appLocaleZhData from 'react-intl/locale-data/zh'
import zhMessages from '../locales/zh.json'
import antdEn from 'antd/lib/locale-provider/en_US'
import appLocaleEnData from 'react-intl/locale-data/en'

import enMessages from '../locales/en.json'
import { addLocaleData, IntlProvider } from 'react-intl'
import Intl from 'intl'
// import Perf from 'react-addons-perf'
// window.Perf = Perf
global.Intl = Intl;

const setLang = function(lang){
	if(!lang){
		lang = localStorage.getItem('UYUN_LANGUAGE_CONSTANT') ? localStorage.getItem('UYUN_LANGUAGE_CONSTANT') : 'zh-cn'
	}

	let appLocaleData
	switch(lang){
		case 'en_US':
			appLocaleData = {
			  messages: {
			    ...enMessages
			  },
			  antd: antdEn,
			  locale: 'en-us',
			  data: appLocaleEnData,
			}
			// 内置属性
			window._severity = {
			  "0": "OK",
			  "1": "Information",
			  "2": "Warning",
			  "3": "Critical"
			}
			window._status = {
			  "0": "Open",
			  "40": "Acknowledged",
			  "150": "Assigned",
			  "255": "Resolved"
			}
			window._groupBy = 'GroupBy'
			document.title = 'Alert'
			break
		default:
			appLocaleData = {
			  messages: {
			    ...zhMessages
			  },
			  antd: null,
			  locale: 'zh-cn',
			  data: appLocaleZhData,
			}
			// 内置属性
			window._severity = {
			  "0": "正常",
			  "1": "提醒",
			  "2": "警告",
			  "3": "紧急"
			}
			window._status = {
			  "0": "新告警",
			  "40": "已确认",
			  "150": "处理中",
			  "255": "已解决"
			}
			window._groupBy = '分组显示'
			document.title = 'Alert'
			break

	}
	window.__alert_appLocaleData = appLocaleData
	return appLocaleData
}

const appLocale = setLang();


addLocaleData(appLocale.data);


// 1. Initialize
const app = dva()
const root = document.querySelector('#root')
// 2. Model

app.model(require('./models/app'))
app.model(require('./models/alertManage'))
// 告警列表
app.model(require('./models/alertTagsSet'))



app.model(require('./models/alertOperation'))
app.model(require('./models/alertDetailOperation'))
app.model(require('./models/tagsListFilter'))
app.model(require('./models/alertDetail'))

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
