import React, { PropTypes } from 'react'
import { Breadcrumb } from 'antd'
import styles from '../main.less'
import { connect } from 'dva'
import { menu } from '../../../utils'

// 枚举所有的路径
const path = {
  alertManage: {
    name:'告警管理'
  },
  alertConfig: {
    name:'告警配置'
  },
  alertQuery: {
    name:'告警查询'
  },
  watchManage: {
    name:'值班管理'
  },
  alertList:{
    name:'告警管理 告警列表'
  }
}
function Bread ({ location, appTypeName }) {
  const pathname = location.pathname
  const pathDepth = pathname.split('/')
  let breads = []
  
  if(pathname == '\/') { //首页进去时需要处理
    breads.push(
      <Breadcrumb.Item key='alertManage'>告警管理</Breadcrumb.Item>
    )

  } else if(pathDepth.length > 2 && pathDepth.indexOf('alertManage') > -1){ //告警列表
    breads.push(
      <Breadcrumb.Item key="alertManage"><a href="#alertManage">告警管理</a></Breadcrumb.Item>,
      <Breadcrumb.Item key="alertList">告警列表</Breadcrumb.Item>
    )

  }else if(pathDepth.length > 2 && pathDepth.length < 4 && pathDepth.indexOf('alertConfig') > -1){ //告警配置
    breads.push(
      <Breadcrumb.Item key="alertConfig"><a href="#alertConfig">告警配置</a></Breadcrumb.Item>,
      <Breadcrumb.Item key="alertApplication">应用集成</Breadcrumb.Item>
    )
  }else if(pathDepth.length > 3 && pathDepth.indexOf('alertConfig') > -1){ // 告警配置应用详情
    breads.push(
      <Breadcrumb.Item key="alertConfig"><a href="#alertConfig">告警配置</a></Breadcrumb.Item>,
      <Breadcrumb.Item key="alertApplication"><a href="#alertConfig/alertApplication">应用集成</a></Breadcrumb.Item>,
      <Breadcrumb.Item key="applicationView">{appTypeName}</Breadcrumb.Item>
    )
  }else{
    const key = path[pathDepth[1]]
    breads.push(<Breadcrumb.Item key={pathDepth[1]}>{key['name']}</Breadcrumb.Item>)
  }



  return (
    <div className={styles.bread}>
      <Breadcrumb separator=">">
        {breads}
      </Breadcrumb>
    </div>
  )
}

Bread.propTypes = {
  location: PropTypes.object
}

export default connect(({alertConfig}) => ({
  appTypeName: alertConfig.currentOperateAppType.name !== undefined ? alertConfig.currentOperateAppType.name : '应用配置'
}))(Bread)

