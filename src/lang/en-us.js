import antdEn from 'antd/lib/locale-provider/en_US';
import appLocaleData from 'react-intl/locale-data/en';
import enMessages from '../../locales/en.json';

window.appLocale = {
  messages: {
    ...enMessages,
  },
  antd: antdEn,
  locale: 'en-us',
  data: appLocaleData,
};
// 内置属性
window._severity = {
  "0": "ok",
  "1": "Information",
  "2": "Warning",
  "3": "Critical"
}
window._status = {
  "0": "New",
  "40": "Acknowledged",
  "150": "Progressing",
  "255": "Resolved"
}