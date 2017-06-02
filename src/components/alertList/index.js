import React, { PropTypes, Component } from 'react'

import { Tabs, Select, Switch, Checkbox, Button } from 'antd'
import ListTableWrap from './listTable'
import ListTimeTableWrap from './listTimeTable'
import VisualAnalyzeWrap from './visualAnalyze'
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
import SuppressModal from '../common/suppressModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import { classnames } from '../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const TabPane = Tabs.TabPane

class AlertListManage extends Component{
  constructor(props){
    super(props)
  }

  componentDidMount() {
    const {dispatch} = this.props;
    
    window.addEventListener('message', (e) => {
		  if(e.data.creatTicket !== undefined && e.data.creatTicket === 'success') {
        dispatch({
          type: 'alertOperation/afterDispatch'
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
      tab_visual: {
        id: 'alertList.tabs.visual',
        defaultMessage: '可视化分析'
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
      extendTagsKey: alertOperation.extendTagsKey,
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
      },
      showNotifyFunc: (position) => {
        dispatch({
          type: 'alertOperation/openNotify',
          payload: position
        })
      },
      suppressIncidents: (min, position) => {
        dispatch({
          type: 'alertOperation/beforeSuppressIncidents',
          payload: {
            time: min,
            position: position
          }
        })
      },
      showSuppressTimeSlider: (position) => {
        dispatch({
          type: 'alertOperation/openSuppressTimeSlider',
          payload: {
            position: position
          }
        })
      }
    }

    const currentAlertDetail = alertDetail['currentAlertDetail'] || {};
    const toggleBarButtonClick = (e) => {
      const isShowAlertBar = !alertList.isShowBar;
      dispatch({
        type: 'alertList/toggleBar',
        payload: isShowAlertBar,
      })
    }
    const alertDeatilProps = {
      extraProps: {
        currentAlertDetail, 
        isShowOperateForm: alertDetail.isShowOperateForm, 
        operateForm: alertDetail.operateForm, 
        isShowRemark: alertDetail.isShowRemark, 
        operateRemark: alertDetail.operateRemark,
        ciUrl: alertDetail.ciUrl
      },
      operateProps: {
        ...operateProps,
        // 子告警不能派发、已关闭的不能派发
        dispatchDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255,
        // 子告警不能关闭、处理中和已关闭的不能关闭
        closeDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255 || currentAlertDetail['status'] == 40,
        // 子告警不能解决、已解决和已关闭的不能解决
        resolveDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255 || currentAlertDetail['status'] == 190,
        // 子告警不能通知、只有未接手和处理中的告警能通知
        notifyDisabled: currentAlertDetail['parentId'] || !(currentAlertDetail['status'] == 0 || currentAlertDetail['status'] == 150),
        // 子告警不能分享
        shareDisabled: currentAlertDetail['parentId']
      },
      clickTicketFlow: (operateForm) => {
        if (operateForm !== undefined && operateForm !== '') {
          dispatch({
              type: 'alertDetail/viewTicketDetail',
              payload: operateForm
          })
        }
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
            type: 'alertDetail/changeTicketFlow',
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

    const timeSliderProps = {
      isShowTimeSliderModal: alertOperateModalOrigin === 'detail' ? alertDetailOperation.isShowTimeSliderModal : alertOperation.isShowTimeSliderModal,
      onOk: (time) => {
        dispatch({
          type: alertOperateModalOrigin === 'detail' ? "alertDetailOperation/suppressIncidents" : "alertOperation/suppressIncidents",
          payload: {
            time: time
          }
        })
        dispatch({
          type: alertOperateModalOrigin === 'detail' ? "alertDetailOperation/toggleSuppressTimeSliderModal" : "alertOperation/toggleSuppressTimeSliderModal",
          payload: false
        })
      },
      onCancel: () => {
        dispatch({
          type: alertOperateModalOrigin === 'detail' ? "alertDetailOperation/toggleSuppressTimeSliderModal" : "alertOperation/toggleSuppressTimeSliderModal",
          payload: false
        })
      }
    }

    const suppressModalProps = {
      isShowRemindModal: alertOperateModalOrigin === 'detail' ? alertDetailOperation.isShowRemindModal : alertOperation.isShowRemindModal,
      onKnow: (checked) => {
        if (checked) {
          localStorage.setItem('__alert_suppress_remind', 'false')
        }
        dispatch({
          type: alertOperateModalOrigin === 'detail' ? "alertDetailOperation/toggleRemindModal" : "alertOperation/toggleRemindModal",
          payload: false
        })
      }
    }

    const notifyModalProps = {
      isShowNotifyModal: alertOperateModalOrigin === 'detail' ? alertDetailOperation.isShowNotifyModal : alertOperation.isShowNotifyModal,
      notifyIncident: alertOperateModalOrigin === 'detail' ? alertDetailOperation.notifyIncident : alertOperation.notifyIncident,
      notifyUsers: alertOperateModalOrigin === 'detail' ? alertDetailOperation.notifyUsers : alertOperation.notifyUsers,
      onOk: (data) => {
        dispatch({
          type: alertOperateModalOrigin === 'detail' ? "alertDetailOperation/notyfiyIncident" : "alertOperation/notyfiyIncident",
          payload: data
        })
      },
      onCancel: () => {
        dispatch({
          type: alertOperateModalOrigin === 'detail' ? "alertDetailOperation/initManualNotifyModal" : "alertOperation/initManualNotifyModal",
          payload: {
            isShowNotifyModal: false
          }
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
              dispatch({
                type: 'tagListFilter/refresh',
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
      styles['listTab']
    )
    const tabLine = classnames(
      'iconfont',
      'icon-shijian',
      styles['timeTab']
    )
    const tabVisual = classnames(
      'iconfont',
      'icon-yunweichangjing',
      styles['visualTab']
    )
    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux'
    )
    const zhankaiClass = classnames(
      'iconfont',
      'icon-xialasanjiao'
    )
    const shouqiClass = classnames(
      'iconfont',
      'icon-xialasanjiao-copy'
    )
    // 转数字匹配等级，并作排序
    let levels_wapper = {};
    Object.keys(levels).length !== 0 && Object.keys(levels).forEach( (severity) => {
      switch (severity) {
        case 'Critical':
          levels_wapper['3'] = levels['Critical']
          break;
        case 'Warning':
          levels_wapper['2'] = levels['Warning']
          break;
        case 'Information':
          levels_wapper['1'] = levels['Information']
          break;
        case 'OK':
          levels_wapper['0'] = levels['OK']
          break;
        default:
          break;
      }
    })
    const groupName = localStorage.getItem('__visual_group'),
          isShowVisualTab = !(groupName == 'source' || groupName == 'status'  || groupName == 'severity' )
          
    return (
      <div style={{ position: 'relative'}}>
        <div className={alertList.isShowBar?styles.showBar:styles.hideBar}>
          <AlertTagsFilter />
          <div className={styles.alertSwitch}><span><FormattedMessage {...localeMessage['auto_refresh']} /></span><Switch {...refreshProps}/></div>
          <AlertBar />
        </div>
        <Button className={classnames(styles.toggleBarButton, zhankaiClass)} onClick={toggleBarButtonClick} size="small"><i className={ alertList.isShowBar?shouqiClass:zhankaiClass }/></Button>
        <div className={styles.alertListPage + " " + (alertList.isShowBar?'':styles.marginTop0)}>
          <Tabs>
            <TabPane tab={<span className={tabList}><FormattedMessage {...localeMessage['tab_list']} /></span>} key={1}>
              <AlertOperation position='list' {...operateProps}/>
              <ListTableWrap />
            </TabPane>
            <TabPane tab={<span className={tabLine} ><FormattedMessage {...localeMessage['tab_time']} /></span>}  key={2}>
              <AlertOperation position='timeAxis' {...operateProps}/>
              <ListTimeTableWrap />
            </TabPane>
            { isShowVisualTab && 
           <TabPane tab={<span  className={tabVisual}><FormattedMessage {...localeMessage['tab_visual']} /></span>}  key={3}>
                <VisualAnalyzeWrap key={new Date().getTime()}/>
            </TabPane>
            }
          </Tabs>
          <ul className={styles.levelBar}>
            {
              Object.keys(levels_wapper).length !== 0 && Object.keys(levels_wapper).sort((prev, next) => {
                return Number(next) - Number(prev);
              }).map( (key, index) => {
                return (<li key={index}><LevelIcon extraStyle={styles.extraStyle} iconType={key} /><p>{`${window['_severity'][key]}（${levels_wapper[key]}）`}</p></li>)
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
        <SuppressModal {...suppressModalProps}/>
        <SuppressTimeSlider {...timeSliderProps} />
        <ManualNotifyModal {...notifyModalProps} />
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
