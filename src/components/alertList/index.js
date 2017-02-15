import React, { PropTypes, Component } from 'react'
import { Tabs, Select } from 'antd';
import ListTable from './listTable'
import AlertBar from './alertBar'
import AlertTagsFilter from './alertTagsFilter'
import AlertOperation from './alertOperation'
import { connect } from 'dva'
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
        <div >
          <Tabs>
            <TabPane tab="列表" key={1}>
              <AlertOperation position='list' />
              <ListTable isGroup={true}/>
            </TabPane>
            <TabPane tab="时间线" key={2}>
              <AlertOperation position='timeAxis' />
            </TabPane>
          </Tabs>
        </div>
      </div>
    )
  }
}

export default AlertListManage

