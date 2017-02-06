import React, { PropTypes, Component } from 'react'
import styles from './index.less'
import { classnames } from '../../utils'

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
          <div>
          最近一小时活跃告警：
          <ul>
            <li>紧急（{levels.jj}）</li>
            <li>告警（{levels.gj}）</li>
            <li>提醒（{levels.tx}）</li>
          </ul>
          </div>
        }

    </div>
  )
}

export default AlertManageHead
