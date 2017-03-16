import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col } from 'antd'
import { classnames } from '../../utils'
import { Link } from 'dva/router'

const alertConfig = (props) => {

    const switchClass = classnames(
        styles['icon'],
        styles.iconfont,
        styles['icon-anonymous-iconfont']
    )

    return (
        <div className={styles.configHome}>
          <Link to={`/alertConfig/alertApplication`} >
            <div>
                <i className={classnames(switchClass, styles.configIcon)}></i>
                <p className={styles.title}>第三方应用集成</p>
                <p className={styles.message}>接入第三方应用，如网络、服务器和应用监控工具、帮助台和客户支持、聊天协同等应用</p>
            </div>
          </Link>
          <Link to={`/alertConfig/alertApplication`} >
            <div>
                <i className={classnames(switchClass, styles.configIcon)}></i>
                <p className={styles.title}>第三方应用集成</p>
                <p className={styles.message}>接入第三方应用，如网络、服务器和应用监控工具、帮助台和客户支持、聊天协同等应用</p>
            </div>
          </Link>
          <Link to={`/alertConfig/alertApplication`} ><div></div></Link>
          <Link to={`/alertConfig/alertApplication`} ><div></div></Link>
          <Link to={`/alertConfig/alertApplication`} ><div></div></Link>
        </div>
    )
}

export default alertConfig