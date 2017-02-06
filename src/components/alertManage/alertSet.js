import React, { PropTypes, Component } from 'react'
import styles from './index.less'

class AlertSet extends Component{

  render(){
    const {onOk, hideAlertSetTip} = this.props
    return (
      <div className={styles.alertSet}>
        <div className={styles.alertSetInfo}>告警看板暂无数据，请先设置关注数据</div>
        {!hideAlertSetTip && <div className={styles.alertSetTip} onClick={onOk}></div>}
      </div>
    )
  }
}
// function AlertSet({alertSetProps}){
//
//
// }
export default AlertSet
