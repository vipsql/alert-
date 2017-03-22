import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../utils'
import LevelIcon from '../common/levelIcon/index.js'

const AlertManageHead = ({
  isSetAlert,
  levels,
  showTagsModal
}) => {
  const setClass = classnames(
    styles['iconfont'],
    styles['icon-bushu']
  )

  return (
    <div>
        <div className={styles.focusSet} onClick={showTagsModal}>
          <i className={setClass}></i>关注设置
        </div>
        {isSetAlert &&
          <div className={styles.alertItemSet}>
            <p>最近一小时活跃告警：</p>
            <ul>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='jj' /><p>紧急（{levels.totalCriticalCnt !== undefined ? levels.totalCriticalCnt : 0}）</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='zy' /><p>恢复（{levels.totalOkCnt !== undefined ? levels.totalOkCnt : 0}）</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='gj' /><p>警告（{levels.totalWarnCnt !== undefined ? levels.totalWarnCnt : 0}）</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='tx' /><p>提醒（{levels.totalInfoCnt !== undefined ? levels.totalInfoCnt : 0}）</p></li>
            </ul>
          </div>
        }

    </div>
  )
}

export default AlertManageHead
