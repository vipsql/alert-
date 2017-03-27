import appLocaleData from 'react-intl/locale-data/zh'
import enMessages from '../../locales/zh.json'

window.appLocale = {
  messages: {
    ...enMessages,
  },
  antd: null,
  locale: 'zh-cn',
  data: appLocaleData,
};
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