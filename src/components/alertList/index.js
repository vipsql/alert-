import React, { PropTypes, Component } from 'react'
import { Tabs, Select } from 'antd';
import ListTable from './listTable'
import ListTimeTableWrap from './listTimeTable'
import AlertBar from './alertBar'
import AlertTagsFilter from './alertTagsFilter'
import AlertOperation from './alertOperation'
import { connect } from 'dva'
import styles from './index.less'
const TabPane = Tabs.TabPane

class AlertListManage extends Component{
  constructor(props){
    super(props)
  }
  render(){
    return (
      <div>
        <AlertTagsFilter />
        <AlertBar />
        <div>
          <Tabs>
            <TabPane tab="列表" key={1}>
              <AlertOperation position='list' />
              

            </TabPane>
            <TabPane tab="时间线" key={2}>
              <AlertOperation position='timeAxis' />
              <ListTimeTableWrap />

            </TabPane>
          </Tabs>

        </div>
        <div className={styles.alertDetailModal}>

        </div>
      </div>
    )
  }
}

export default AlertListManage
