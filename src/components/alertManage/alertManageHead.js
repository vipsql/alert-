import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../utils'
import LevelIcon from '../common/levelIcon/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const formatMessages = defineMessages({
    set:{
      id: 'alertManage.addTags',
      defaultMessage: '关注设置',
    },
    header: {
      id: 'alertManage.headerTitle',
      defaultMessage: '最近一小时活跃告警: ',
    }
})

const AlertManageHead = ({
  isSetAlert,
  levels,
  showTagsModal
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
          <div className={styles.alertItemSet}>
            <p><FormattedMessage {...formatMessages['header']} /></p>
            <ul>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='jj' /><p>{`${window['_severity']['3']}（${levels.totalCriticalCnt !== undefined ? levels.totalCriticalCnt : 0}）`}</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='gj' /><p>{`${window['_severity']['2']}（${levels.totalWarnCnt !== undefined ? levels.totalWarnCnt : 0}）`}</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='tx' /><p>{`${window['_severity']['1']}（${levels.totalInfoCnt !== undefined ? levels.totalInfoCnt : 0}）`}</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='hf' /><p>{`${window['_severity']['0']}（${levels.totalOkCnt !== undefined ? levels.totalOkCnt : 0}）`}</p></li>
            </ul>
          </div>
        }

    </div>
  )
}

export default AlertManageHead
