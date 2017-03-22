import React, { PropTypes, Component } from 'react'

import { Tabs, Select } from 'antd';
import ListTableWrap from './listTable'
import ListTimeTableWrap from './listTimeTable'

import AlertBar from './alertBar'
import AlertTagsFilter from './alertTagsFilter'
import AlertOperation from '../common/alertOperation/index.js'
import AlertDetail from '../common/alertDetail/index.js'
import { connect } from 'dva'
import styles from './index.less'
import LevelIcon from '../common/levelIcon/index.js'
import MergeModal from './mergeModal'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import RelieveModal from './relieveModal'
import { classnames } from '../../utils'
import CodeWords from '../../codewords.json'

const TabPane = Tabs.TabPane

class AlertListManage extends Component{
  constructor(props){
    super(props)
  }

  render(){
    const { alertDetail, alertListTable, alertList, dispatch, alertOperation, alertDetailOperation } = this.props;
    
    const { levels } = alertListTable;
    const { alertOperateModalOrigin } = alertList

    const operateProps = {
      selectGroup: alertOperation.selectGroup,
      columnList: alertOperation.columnList,

      checkCloumFunc: (e) => {
        dispatch({
            type: 'alertOperation/checkColumn',
            payload: e.target.value,
        })
      },
      relieveFunc: () => {
        dispatch({
            type: 'alertOperation/openRelieveModal',
        })
      },
      dispatchFunc: (position) => {
        dispatch({
            type: 'alertOperation/openFormModal',
            payload: position
        })
      },
      closeFunc: (position) => {
        dispatch({
            type: 'alertOperation/openCloseModal',
            payload: {
                state: true,
                origin: position
            }
        })
      },
      mergeFunc: () => {
        dispatch({
            type: 'alertOperation/openMergeModal',
        })
      },
      groupFunc: (value) => {
        dispatch({
            type: 'alertOperation/groupView',
            payload: value,
        })
      },
      noGroupFunc: () => {
        dispatch({
            type: 'alertOperation/noGroupView',
        })
      }
    }

    const alertDeatilProps = {
      extraProps: {
        currentAlertDetail: alertDetail.currentAlertDetail, 
        isSowOperateForm: alertDetail.isSowOperateForm, 
        operateForm: alertDetail.operateForm, 
        isShowRemark: alertDetail.isShowRemark, 
        operateRemark: alertDetail.operateRemark
      },
      operateProps: {...operateProps},

      closeDeatilModal: () => {
        dispatch({
            type: 'alertDetail/closeDetailModal',
            payload: false
        })
      },
      openForm: () => {
        dispatch({
            type: 'alertDetail/toggleFormModal',
            payload: true
        })
      },
      editForm: (formData) => {
        dispatch({
            type: 'alertDetail/setFormData',
            payload: formData.formContent
        })
        dispatch({
            type: 'alertDetail/toggleFormModal',
            payload: false
        })
      },
      closeForm: () => {
        dispatch({
            type: 'alertDetail/toggleFormModal',
            payload: false
        })
      },
      openRemark: () => {
        dispatch({
            type: 'alertDetail/toggleRemarkModal',
            payload: true
        })
      },
      editRemark: (formData) => {
        dispatch({
            type: 'alertDetail/setRemarkData',
            payload: formData.remark
        })
        dispatch({
            type: 'alertDetail/toggleRemarkModal',
            payload: false
        })
      },
      closeRemark: () => {
        dispatch({
            type: 'alertDetail/toggleRemarkModal',
            payload: false
        })
      }
    }

    const closeModalProps = {
      currentData: alertOperateModalOrigin === 'detail' ? alertDetailOperation : alertOperation,

      closeCloseModal: () => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleCloseModal' : 'alertOperation/toggleCloseModal',
            payload: false
        })
      },
      clickDropdown: (e) => {
        const message = e.target.getAttribute('data-message')
        
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/setCloseMessge' : 'alertOperation/setCloseMessge',
            payload: message
        })
      },
      onOk: (closeMessage) => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/closeAlert' : 'alertOperation/closeAlert',
            payload: closeMessage
        })
      },
      onCancal: () => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleCloseModal' : 'alertOperation/toggleCloseModal',
            payload: false
        })
      },
      okCloseMessage: (isDropdownSpread) => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleDropdown' : 'alertOperation/toggleDropdown',
            payload: !isDropdownSpread
        })
      },
      editCloseMessage: (e) => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/setCloseMessge' : 'alertOperation/setCloseMessge',
            payload: e.target.value
        })
      },
      mouseLeaveDropdown: () => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleDropdown' : 'alertOperation/toggleDropdown',
            payload: false
        })
      }
    }

    const dispatchModalProps = {
      currentData: alertOperateModalOrigin === 'detail' ? alertDetailOperation : alertOperation,

      closeDispatchModal: () => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleFormModal' : 'alertOperation/toggleFormModal',
            payload: false
        })
      },
      onOk: (value) => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/dispatchForm' : 'alertOperation/dispatchForm',
            payload: value
        })
      },
      onCancal: () => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleFormModal' : 'alertOperation/toggleFormModal',
            payload: false
        })
      }
    }

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
              <AlertOperation position='list' {...operateProps}/>
              <ListTableWrap />
            </TabPane>
            <TabPane tab={<span className={tabLine} >时间线</span>}  key={2}>
              <AlertOperation position='timeAxis' {...operateProps}/>
              <ListTimeTableWrap />
            </TabPane>
          </Tabs>
          <ul className={styles.levelBar}>
            {
              Object.keys(levels).length !== 0 && Object.keys(levels).map( (key, index) => {
                let levelName = key == 'Critical' ? CodeWords['severity']['3'] :
                                    key == 'Warning' ? CodeWords['severity']['2'] :
                                      key == 'Information' ? CodeWords['severity']['1'] :
                                        key == 'Ok' ? CodeWords['severity']['0'] : undefined

                return (<li key={index}><LevelIcon extraStyle={styles.extraStyle} iconType={key} /><p>{`${levelName}（${levels[key]}）`}</p></li>)
              })
            }
          </ul>
        </div>
        {
          Object.keys(alertDetail).length !== 0 && alertDetail.currentAlertDetail !== undefined && Object.keys(alertDetail.currentAlertDetail).length !== 0 ?
          <div className={ alertDetail.isShowDetail ? classnames(styles.alertDetailModal, styles.show) : styles.alertDetailModal }>
            <AlertDetail {...alertDeatilProps}/>
          </div>
          :
          undefined
        }
        <MergeModal />
        <CloseModal {...closeModalProps}/>
        <DispatchModal {...dispatchModalProps}/>
        <RelieveModal />
      </div>
    )
  }
}

export default connect((state) => {
  return {
    alertListTable: state.alertListTable,
    alertDetail: state.alertDetail,
    alertOperation: state.alertOperation,
    alertDetailOperation: state.alertDetailOperation,
    alertList: state.alertList
  }
})(AlertListManage)
