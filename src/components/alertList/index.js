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
    const { alertDetail, alertListTable, isShowDetail } = this.props;
    
    const { levels } = alertListTable;

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
            {
              Object.keys(levels).length !== 0 && Object.keys(levels).map( (key, index) => {
                let levelName = key == 'jj' ? '紧急' :
                                  key == 'zy' ? '主要' :
                                    key == 'cy' ? '次要' :
                                      key == 'gj' ? '警告' :
                                        key == 'tx' ? '提醒' : undefined

                return (<li key={index}><LevelIcon extraStyle={styles.extraStyle} iconType={key} /><p>{`${levelName}（${levels[key]}）`}</p></li>)
              })
            }
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
    alertListTable: state.alertListTable,
    alertDetail: state.alertDetail,

  }
})(AlertListManage)
