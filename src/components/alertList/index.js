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
import LevelIcon from '../common/levelIcon/index.js'
import MergeModal from './mergeModal'
import CloseModal from './closeModal'
import DispatchModal from './dispatchModal'
import RelieveModal from './relieveModal'
import { classnames } from '../../utils'

const TabPane = Tabs.TabPane

class AlertListManage extends Component{
  constructor(props){
    super(props)
    this.clickIcon = this.clickIcon.bind(this);
  }

  clickIcon(e) {
    const { dispatch } = this.props;

    const levelType = e.target.getAttribute('data-Type');
    dispatch({
      type: 'alertList/toggleLevelState',
      payload: levelType
    })
  }

  render(){
    const { alertDetail, alertList, isShowDetail } = this.props;
    
    const { levels } = alertList;

    const tabList = classnames(
      styles['iconfont'],
      styles['icon-liebiao'],
      styles['listTab']
    )
    const tabLine = classnames(
      styles['iconfont'],
      styles['icon-shijian'],
      styles['timeTab']
    )

    return (
      <div>
        <AlertTagsFilter />
        <AlertBar />
        <div className={styles.alertListPage}>
          <Tabs>
            <TabPane tab={<span className={tabList}>列表</span>} key={1}>
              <AlertOperation position='list' />
              <ListTableWrap />
            </TabPane>
            <TabPane tab={<span className={tabLine} >时间线</span>}  key={2}>
              <AlertOperation position='timeAxis' />
              <ListTimeTableWrap />
            </TabPane>
          </Tabs>
          <ul className={styles.levelBar}>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='jj' iconState={levels.jj.state} onClick={ this.clickIcon } /><p>紧急（{levels.jj.number}）</p></li>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='zy' iconState={levels.zy.state} onClick={ this.clickIcon } /><p>主要（{levels.zy.number}）</p></li>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='cy' iconState={levels.cy.state} onClick={ this.clickIcon } /><p>次要（{levels.cy.number}）</p></li>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='gj' iconState={levels.gj.state} onClick={ this.clickIcon } /><p>告警（{levels.gj.number}）</p></li>
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='tx' iconState={levels.tx.state} onClick={ this.clickIcon } /><p>提醒（{levels.tx.number}）</p></li>
          </ul>
        </div>
        {
          Object.keys(alertDetail).length !== 0 && alertDetail.currentAlertDetail !== undefined && Object.keys(alertDetail.currentAlertDetail).length !== 0 ?
          <div className={ alertDetail.isShowDetail ? classnames(styles.alertDetailModal, styles.show) : styles.alertDetailModal }>
            <AlertDetail />
          </div>
          :
          undefined
        }
        <MergeModal />
        <CloseModal />
        <DispatchModal />
        <RelieveModal />
      </div>
    )
  }
}

export default connect((state) => {
  return {
    alertList: state.alertList,
    alertDetail: state.alertDetail
  }
})(AlertListManage)
