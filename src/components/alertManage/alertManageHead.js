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
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='jj' iconState={false}/><p>紧急（{levels.jj}）</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='zy' iconState={false}/><p>主要（{levels.zy}）</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='cy'/><p>次要（{levels.cy}）</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='gj'iconState={false}/><p>告警（{levels.gj}）</p></li>
              <li><LevelIcon extraStyle={styles.extraStyle} iconType='tx'/><p>提醒（{levels.tx}）</p></li>
            </ul>
          </div>
        }

    </div>
  )
}

export default AlertManageHead
