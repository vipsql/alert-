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
          <div className={styles.alertItemSet}>
            <p>最近一小时活跃告警：</p>
            <ul>
              <li><div className={styles.jjColorIcon}></div><p>紧急（{levels.jj}）</p></li>
              <li><div className={styles.gjColorIcon}></div><p>告警（{levels.gj}）</p></li>
              <li><div className={styles.txColorIcon}></div><p>提醒（{levels.tx}）</p></li>
            </ul>
          </div>
        }

    </div>
  )
}

export default AlertManageHead
