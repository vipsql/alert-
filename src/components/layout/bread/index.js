import React, { PropTypes } from 'react'
import { Breadcrumb } from 'antd'
import styles from '../main.less'
import { connect } from 'dva'
import { menu } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const path = defineMessages({
  alertManage: {
    id: 'leftMenu.alertManage',
    defaultMessage:'告警管理'
  },
  alertConfig: {
    id: 'leftMenu.alertConfig',
    defaultMessage: '告警配置',
  },
  alertQuery: {
    id: 'leftMenu.alertQuery',
    defaultMessage: '告警查询',
  },
  watchManage: {
    id: 'leftMenu.watchManage',
    defaultMessage: '值班管理',
  },
  alertList:{
    id: 'bread.alertList',
    defaultMessage:'告警列表'
  },
  integration:{
    id: 'bread.integrations',
    defaultMessage: '应用集成'
  },
  associationRules: {
    id: 'bread.association',
    defaultMessage: '关联配置'
  },
  associationRules_add: {
    id: 'bread.association.add',
    defaultMessage: '添加规则'
  },
  associationRules_edit: {
    id: 'bread.association.edit',
    defaultMessage: '编辑规则'
  },
  integrationConfig: {
    id: 'bread.integrationConfig',
    defaultMessage: '应用配置'
  }
})

function Bread ({ location, appTypeName }) {
  const pathname = location.pathname
  const pathDepth = pathname.split('/')
  let breads = []

  if(pathname == '\/') { //首页进去时需要处理
    breads.push(
      <Breadcrumb.Item key='alertManage'><FormattedMessage {...path['alertManage']}/></Breadcrumb.Item>
    )

  } else if(pathDepth.length > 2 && pathDepth.indexOf('alertManage') > -1){ //告警列表
    breads.push(
      <Breadcrumb.Item key="alertManage"><a href="#alertManage"><FormattedMessage {...path['alertManage']}/></a></Breadcrumb.Item>,
      <Breadcrumb.Item key="alertList"><FormattedMessage {...path['alertList']}/></Breadcrumb.Item>
    )

  } else if(pathDepth.length > 2 && pathDepth.length < 4 && pathDepth.indexOf('alertApplication') > -1){ //告警配置
    breads.push(
      <Breadcrumb.Item key="alertConfig"><a href="#alertConfig"><FormattedMessage {...path['alertConfig']}/></a></Breadcrumb.Item>,
      <Breadcrumb.Item key="alertApplication"><FormattedMessage {...path['integration']}/></Breadcrumb.Item>
    )
  } else if(pathDepth.length > 2 && pathDepth.length < 4 && pathDepth.indexOf('alertAssociationRules') > -1){
    breads.push(
      <Breadcrumb.Item key="alertConfig"><a href="#alertConfig"><FormattedMessage {...path['alertConfig']}/></a></Breadcrumb.Item>,
      <Breadcrumb.Item key="alertAssociationRules"><FormattedMessage {...path['associationRules']}/></Breadcrumb.Item>
    )
  } else if(pathDepth.length > 3 && pathDepth.indexOf('ruleEditor') > -1) {
    let routers = [
      <Breadcrumb.Item key="alertConfig"><a href="#alertConfig"><FormattedMessage {...path['alertConfig']}/></a></Breadcrumb.Item>,
      <Breadcrumb.Item key="alertAssociationRules"><a href="#alertConfig/alertAssociationRules"><FormattedMessage {...path['associationRules']}/></a></Breadcrumb.Item>,
      pathDepth.indexOf('add') > -1 ?
      <Breadcrumb.Item key="applicationView"><FormattedMessage {...path['associationRules_add']}/></Breadcrumb.Item>
      :
      <Breadcrumb.Item key="applicationView"><FormattedMessage {...path['associationRules_edit']}/></Breadcrumb.Item>
    ]
    breads.push(routers)
  } else if(pathDepth.length > 3 && pathDepth.indexOf('alertApplication') > -1){ // 告警配置应用详情
    breads.push(
      <Breadcrumb.Item key="alertConfig"><a href="#alertConfig"><FormattedMessage {...path['alertConfig']}/></a></Breadcrumb.Item>,
      <Breadcrumb.Item key="alertApplication"><a href="#alertConfig/alertApplication"><FormattedMessage {...path['integration']}/></a></Breadcrumb.Item>,
      <Breadcrumb.Item key="applicationView">{appTypeName}</Breadcrumb.Item>
    )
  } else {
    const key = pathDepth[1]
    breads.push(<Breadcrumb.Item key={pathDepth[1]}><FormattedMessage {...path[key]}/></Breadcrumb.Item>)
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
  appTypeName: alertConfig.currentOperateAppType.name !== undefined
    ? alertConfig.currentOperateAppType.name
      : alertConfig.currentEditApp.applyType !== undefined && alertConfig.currentEditApp.applyType.name !== undefined ?
        alertConfig.currentEditApp.applyType.name
          : 'Integrations Config'
}))(Bread)

