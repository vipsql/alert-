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
    header: {
      id: 'alertManage.headerTitle',
      defaultMessage: '最近 1 小时活跃告警: ',
    }
})

const AlertManageHead = ({
  isSetAlert,
  levels,
  showTagsModal,
  queryByTime,
  queryByStatus
}) => {
  const setClass = classnames(
    'iconfont',
    'icon-bushu'
  )

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
              <Option value='lastOneHour'>最近 1 小时</Option>
              <Option value='lastFourHour'>最近 4 小时</Option>
              <Option value='lastOneDay'>最近 24 小时</Option>
              <Option value='lastOneWeek'>最近 7 天</Option>
              <Option value='lastFifteenDay'>最近 15 天</Option>
              <Option value='lastOneMonth'>最近 30 天</Option>
            </Select>
            <RadioGroup className={styles.myRadioGroup} defaultValue='NEW' onChange={ (e) => {
              queryByStatus(e.target.value)
            }}>
              <Radio value='NEW'>待处理告警</Radio>
              <Radio value='PROGRESSING'>处理中告警</Radio>
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

export default AlertManageHead
