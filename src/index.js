import './index.html'
import './index-en.html'
import dva from 'dva'
import React from 'react'
import ReactDOM from 'react-dom'
import { LocaleProvider } from 'antd'
import { addLocaleData, IntlProvider } from 'react-intl';

const appLocale = window.appLocale;

addLocaleData(appLocale.data);
// document.cookie="tenantId=330204b88c684a199250f06b85cdba71;token=tAdlPRFSCBWDkjbw9Kk0siyY9eSSMJvKPnwsy4+FL8I1hfN2dX9GtHepklMItNlrGUMDJ97PuBNQKklV1xyfJHty0i4vZ598C0484nYP/N8=;user=330204b88c684a199250f06b85cdba71;UM_distinctid=15b03fe04cf452-050f98d8efcb91-1d3e6850-1fa400-15b03fe04d014b"

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
