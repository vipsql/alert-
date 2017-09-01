import React, { Component } from 'react'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import { connect } from 'dva'

import LevelIcon from '../common/levelIcon/index.js'

import styles from './index.less'

const localeMessage = defineMessages({
  tab_list: {
    id: 'alertList.tabs.list',
    defaultMessage: '列表'
  },
  assign_ticket: {
    id: 'alertDetail.ticket.assgin',
    defaultMessage: '派发工单'
  },
  tab_time: {
    id: 'alertList.tabs.timeList',
    defaultMessage: '时间线'
  },
  tab_visual: {
    id: 'alertList.tabs.visual',
    defaultMessage: '可视化分析'
  },
  noAlert: {
    id: 'alertManage.noAlert',
    defaultMessage: '无告警'
  }
})

const LevelsWrap = function ({ alertListLevels }) {
  const { levels } = alertListLevels;
  // 转数字匹配等级，并作排序
  let levels_wapper = {};
  Object.keys(levels).length !== 0 && Object.keys(levels).forEach((severity) => {
    switch (severity) {
      case 'Critical':
        levels_wapper['3'] = levels['Critical']
        break;
      case 'Warning':
        levels_wapper['2'] = levels['Warning']
        break;
      case 'Information':
        levels_wapper['1'] = levels['Information']
        break;
      case 'Recovery':
        levels_wapper['0'] = levels['Recovery']
        break;
      default:
        break;
    }
  })

  return (
    <ul className={styles.levelBar}>
      {
        Object.keys(levels_wapper).length !== 0 && Object.keys(levels_wapper).sort((prev, next) => {
          return Number(next) - Number(prev);
        }).map((key, index) => {
          return (<li key={index}><LevelIcon extraStyle={styles.extraStyle} iconType={key} /><p>{`${window['_severity'][key]}（${levels_wapper[key]}）`}</p></li>)
        })
      }
      <li><LevelIcon extraStyle={styles.extraStyle} iconType='noAlerts' /><p><FormattedMessage {...localeMessage['noAlert']} /></p></li>
    </ul>
  )
}

export default injectIntl(connect((state) => {
  return {
    alertListLevels: state.alertListLevels
  }
}) (LevelsWrap))