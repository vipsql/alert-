import React, { PropTypes, Component } from 'react'
import { Tabs, Select } from 'antd';
import ListTableWrap from './listTable'
import ListTimeTableWrap from './listTimeTable'
import AlertBar from './alertBar'
import AlertTagsFilter from './alertTagsFilter'
import AlertOperation from './alertOperation'
import AlertDetail from './alertDetail'
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../utils'

const TabPane = Tabs.TabPane

class AlertListManage extends Component{
  constructor(props){
    super(props)
  }
  render(){
    const { alertDetail } = this.props;
    console.log(alertDetail);
    return (
      <div>
        <AlertTagsFilter />
        <AlertBar />
        <div>
          <Tabs>
            <TabPane tab="列表" key={1}>
              <AlertOperation position='list' />
              <ListTableWrap />
            </TabPane>
            <TabPane tab="时间线" key={2}>
              <AlertOperation position='timeAxis' />
              <ListTimeTableWrap />

            </TabPane>
          </Tabs>

        </div>
        <div className={ alertDetail.isShowDetail ? classnames(styles.alertDetailModal, styles.show) : styles.alertDetailModal }>
          <AlertDetail />
        </div>
      </div>
    )
  }
}

export default connect((state) => {
  return {
    alertDetail: state.alertDetail
  }
})(AlertListManage)
