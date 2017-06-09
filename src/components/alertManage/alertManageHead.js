import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { Select, Radio } from 'antd'
import { classnames } from '../../utils'
import LevelIcon from '../common/levelIcon/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Option = Select.Option;
const RadioGroup = Radio.Group;
const formatMessages = defineMessages({
    set:{
      id: 'alertManage.addTags',
      defaultMessage: '关注设置',
    },
    oneHour: {
      id: 'alertManage.oneHour',
      defaultMessage: '最近 1 小时',
    },
    fourHours: {
      id: 'alertManage.fourHours',
      defaultMessage: '最近 4 小时'
    },
    oneDay: {
      id: 'alertManage.oneDay',
      defaultMessage: '最近 24 小时'
    },
    sevenDays: {
      id: 'alertManage.sevenDays',
      defaultMessage: '最近 7 天'
    },
    fifteenDays: {
      id: 'alertManage.fifteenDays',
      defaultMessage: '最近 15 天'
    },
    thirtyDays: {
      id: 'alertManage.thirtyDays',
      defaultMessage: '最近 30 天'
    },
    newIncident: {
      id: 'alertManage.newIncident',
      defaultMessage: '待处理告警'
    },
    assignedIncident: {
      id: 'alertManage.assignedIncident',
      defaultMessage: '处理中告警'
    },
    resolvedIncident: {
      id: 'alertManage.resolvedIncident',
      defaultMessage: '已解决告警'
    }
})

const AlertManageHead = ({
  isSetAlert,
  levels,
  showTagsModal,
  queryByTime,
  queryByStatus,
  intl
}) => {
  const setClass = classnames(
    'iconfont',
    'icon-bushu'
  )
  const {formatMessage} = intl;

  return (
    <div className={styles.manageHead}>
        <div className={styles.focusSet} onClick={showTagsModal}>
          <i className={setClass}></i><FormattedMessage {...formatMessages['set']} />
        </div>
        {isSetAlert &&
          <div>
            <Select defaultValue='lastOneHour' style={{ width: 150 }} onChange={ (value) => {
              queryByTime(value)
            }}>
              <Option value='lastOneHour' >{formatMessage(formatMessages['oneHour'])}</Option>
              <Option value='lastFourHour'>{formatMessage(formatMessages['fourHours'])}</Option>
              <Option value='lastOneDay'>{formatMessage(formatMessages['oneDay'])}</Option>
              <Option value='lastOneWeek'>{formatMessage(formatMessages['sevenDays'])}</Option>
              <Option value='lastFifteenDay'>{formatMessage(formatMessages['fifteenDays'])}</Option>
              <Option value='lastOneMonth'>{formatMessage(formatMessages['thirtyDays'])}</Option>
            </Select>
            <RadioGroup className={styles.myRadioGroup} defaultValue='NEW' onChange={ (e) => {
              queryByStatus(e.target.value)
            }}>
              <Radio value='NEW'><FormattedMessage {...formatMessages['newIncident']}/></Radio>
              <Radio value='PROGRESSING'><FormattedMessage {...formatMessages['assignedIncident']}/></Radio>
              <Radio value='RESOLVED'><FormattedMessage {...formatMessages['resolvedIncident']}/></Radio>
            </RadioGroup>
          </div>
        }
        {isSetAlert &&
          <ul className={styles.alertStatus}>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='jj' /><p>{`${window['_severity']['3']}（${levels.totalCriticalCnt !== undefined ? levels.totalCriticalCnt : 0}）`}</p></li>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='gj' /><p>{`${window['_severity']['2']}（${levels.totalWarnCnt !== undefined ? levels.totalWarnCnt : 0}）`}</p></li>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='tx' /><p>{`${window['_severity']['1']}（${levels.totalInfoCnt !== undefined ? levels.totalInfoCnt : 0}）`}</p></li>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='hf' /><p>{`${window['_severity']['0']}（${levels.totalOkCnt !== undefined ? levels.totalOkCnt : 0}）`}</p></li>
          </ul>
        }
    </div>
  )
}

export default injectIntl(AlertManageHead)
