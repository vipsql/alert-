import React, { PropTypes } from 'react'
import styles from './index.less'
import { Switch } from 'antd'
import { connect } from 'dva'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const refreshProps = {
  onChange(checked) {

    // localStorage.setItem('__alert_refresh', checked)
    // if (!checked) {
    //   window.__alert_refresh_timer && clearInterval(window.__alert_refresh_timer)
    //   window.__alert_refresh_timer = undefined

    // } else {
    //   if (!window.__alert_refresh_timer) {

    //     window.__alert_refresh_timer = setInterval(function () {
    //       dispatch({
    //         type: 'tagListFilter/refresh',
    //       })
    //     }, 60000)

    //   }
    // }
  }
}

const localeMessage = defineMessages({
  auto_refresh: {
    id: 'alertList.autoRefresh',
    defaultMessage: '自动刷新'
  }
})

const autoRefresh = ({...rest}) => {
  return (
    <div className={styles.alertSwitch}><span><FormattedMessage {...localeMessage['auto_refresh']} /></span><Switch {...refreshProps} /></div>
  )
}

export default injectIntl(autoRefresh)