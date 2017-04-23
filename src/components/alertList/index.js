import React, { PropTypes, Component } from 'react'

import { Tabs, Select, Switch } from 'antd';
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
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import { classnames } from '../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const TabPane = Tabs.TabPane

class AlertListManage extends Component{
  constructor(props){
    super(props)
  }

  componentDidMount() {
    window.addEventListener('message', (e) => {
		  if(e.data.createTicket !== undefined && e.data.createTicket === 'success') {
        dispatch({
          type: 'alertDetail/toggleTicketModal', 
          payload: {
              isShowTicketModal: false,
          }
        })
      }
    }, false)
  }

  render(){
    const { alertDetail, alertListTable, alertList, dispatch, alertOperation, alertDetailOperation } = this.props;

    const localeMessage = defineMessages({
      tab_list: {
        id: 'alertList.tabs.list',
        defaultMessage: '列表'
      },
      assign_ticket: {
        id: 'alertDetail.ticket.assgin',
        defaultMessage: '派发工单'
      },
      tab_time: {
        id: 'alertList.tabs.timeList',
        defaultMessage: '时间线'
      },
      auto_refresh: {
        id: 'alertList.autoRefresh',
        defaultMessage: '自动刷新'
      }
    })
    
    const { levels } = alertListTable;
    const { alertOperateModalOrigin } = alertList

    const operateProps = {
      selectGroup: alertOperation.selectGroup,
      columnList: alertOperation.columnList,
      extendColumnList: alertOperation.extendColumnList,

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
      resolveFunc: (position) => {
        dispatch({
            type: 'alertOperation/openResolveModal',
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
      },
      showChatOpsFunc: (position) => {
        dispatch({
          type: 'alertOperation/openChatOps',
          payload: position
        })
      }
    }

    const alertDeatilProps = {
      extraProps: {
        currentAlertDetail: alertDetail.currentAlertDetail, 
        isSowOperateForm: alertDetail.isSowOperateForm, 
        operateForm: alertDetail.operateForm, 
        isShowRemark: alertDetail.isShowRemark, 
        operateRemark: alertDetail.operateRemark,
        ciUrl: alertDetail.ciUrl
      },
      operateProps: {
        ...operateProps,
        dispatchDisabled: !(alertDetail['currentAlertDetail']['status'] == 0 && !alertDetail['currentAlertDetail']['parentId']),
        closeDisabled: alertDetail['currentAlertDetail']['status'] == 255 || alertDetail['currentAlertDetail']['status'] == 40,
      },

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

      onOk: (form) => {
        form.validateFieldsAndScroll( (errors, values) => {
            if (!!errors) {
                return;
            }
            const formData = form.getFieldsValue()
            
            dispatch({
                type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/closeAlert' : 'alertOperation/closeAlert',
                payload: formData.closeMessage
            })
            form.resetFields();
        })
      },
      onCancal: (form) => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleCloseModal' : 'alertOperation/toggleCloseModal',
            payload: false
        })
        form.resetFields();
      }
    }

    const resolveModalProps = {
      currentData: alertOperateModalOrigin === 'detail' ? alertDetailOperation : alertOperation,

      onOk: (form) => {
        form.validateFieldsAndScroll( (errors, values) => {
            if (!!errors) {
                return;
            }
            const formData = form.getFieldsValue()
            
            dispatch({
                type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/resolveAlert' : 'alertOperation/resolveAlert',
                payload: formData.resolveMessage
            })
            form.resetFields();
        })
      },
      onCancal: (form) => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleResolveModal' : 'alertOperation/toggleResolveModal',
            payload: false
        })
        form.resetFields();
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

    const chatOpsModalProps = {
      currentData: alertOperateModalOrigin === 'detail' ? alertDetailOperation : alertOperation,

      closeChatOpsModal: () => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleChatOpsModal' : 'alertOperation/toggleChatOpsModal',
            payload: false
        })
      },
      onOk: (value) => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/shareChatOps' : 'alertOperation/shareChatOps',
            payload: value
        })
      },
      onCancal: () => {
        dispatch({
            type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleChatOpsModal' : 'alertOperation/toggleChatOpsModal',
            payload: false
        })
      }
    }
    
    const refreshProps = {
      onChange(checked){
        
        localStorage.setItem('__alert_refresh',checked)
        if(!checked){
          window.__alert_refresh_timer && clearInterval(window.__alert_refresh_timer)
          window.__alert_refresh_timer = undefined
          
        }else{
          if(!window.__alert_refresh_timer){
            
            window.__alert_refresh_timer = setInterval(function(){
              
              const originTags = localStorage.getItem('alertListPath')
              dispatch({
                type: 'alertList/queryAlertBar',
                payload: JSON.parse(originTags) || {}
              })
            }, 60000)
          }
        }
      }
    }

    const ticketModalProps = {
      isShowTicketModal: alertDetail.isShowTicketModal,
      ticketUrl: alertDetail.ticketUrl,
      onCloseTicketModal(){
        dispatch({
          type: 'alertDetail/closeTicketModal'
        })
      }
    }
    const tabList = classnames(
      'iconfont',
      'icon-liebiao',
      'listTab'
    )
    const tabLine = classnames(
      'iconfont',
      'icon-shijian',
      'timeTab'
    )
    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux'
    )

    return (
      <div style={{ position: 'relative'}}>
        <AlertTagsFilter />
        <div className={styles.alertSwitch}><span><FormattedMessage {...localeMessage['auto_refresh']} /></span><Switch {...refreshProps}/></div>
        <AlertBar />
        <div className={styles.alertListPage}>
          <Tabs>
            <TabPane tab={<span className={tabList}><FormattedMessage {...localeMessage['tab_list']} /></span>} key={1}>
              <AlertOperation position='list' {...operateProps}/>
              <ListTableWrap />
            </TabPane>
            <TabPane tab={<span className={tabLine} ><FormattedMessage {...localeMessage['tab_time']} /></span>}  key={2}>
              <AlertOperation position='timeAxis' {...operateProps}/>
              <ListTimeTableWrap />
            </TabPane>
          </Tabs>
          <ul className={styles.levelBar}>
            {
              Object.keys(levels).length !== 0 && Object.keys(levels).map( (key, index) => {
                let levelName = key == 'Critical' ? window['_severity']['3'] :
                                    key == 'Warning' ? window['_severity']['2'] :
                                      key == 'Information' ? window['_severity']['1'] :
                                        key == 'Ok' ? window['_severity']['0'] : undefined

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
        <div className={ticketModalProps.isShowTicketModal ?  classnames(styles.ticketModal, styles.show) : styles.ticketModal }>
          <div className={styles.detailHead}>
                <p><FormattedMessage {...localeMessage['assign_ticket']}/></p> 
                <i className={classnames(styles.shanChu, shanchuClass)} onClick={ticketModalProps.onCloseTicketModal}></i>
            </div>
          <iframe src={ticketModalProps.ticketUrl}>
          </iframe>
        </div>
        <MergeModal />
        <CloseModal {...closeModalProps}/>
        <DispatchModal {...dispatchModalProps}/>
        <ChatOpshModal {...chatOpsModalProps}/>
        <ResolveModal {...resolveModalProps}/>
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
