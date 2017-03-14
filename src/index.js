import './index.html'
import './index-en.html'
import dva from 'dva'
import React from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import { addLocaleData, IntlProvider } from 'react-intl';

const appLocale = window.appLocale;

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
