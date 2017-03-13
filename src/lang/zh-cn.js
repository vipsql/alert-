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