import React, { PropTypes, Component } from 'react'

import { Tabs, Select, Switch, Checkbox, Button } from 'antd'
import ListTableWrap from './listTable'
import ListTimeTableWrap from './listTimeTable'
import VisualAnalyzeWrap from './visualAnalyze'
import AlertDetailWrap from '../alertDetail/wrap'
import AlertOperationWrap from '../alertOperation/wrap'
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
import ReassignModal from '../common/ReassignModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import AlertOriginSliderWrap from '../alertOriginSlider/wrap.js'
import FilterHead from '../common/filterHead/index.js'
import ScrollTopButton from '../common/scrollTopButton/index'
import { classnames } from '../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const TabPane = Tabs.TabPane

class AlertListManage extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { dispatch } = this.props;

    window.addEventListener('message', (e) => {
      if (e.data.creatTicket !== undefined && e.data.creatTicket === 'success') {
        dispatch({
          type: 'alertOperation/afterDispatch'
        })
      }
    }, false)
  }

  render() {
    const { alertDetail, alertListTable, alertList, dispatch, alertOperation, alertDetailOperation, alertManage, intl: { formatMessage } } = this.props;

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
      },
      noAlert: {
        id: 'alertManage.noAlert',
        defaultMessage: '无告警'
      }
    })

    const { levels } = alertListTable;
    const { alertOperateModalOrigin } = alertList

    const toggleBarButtonClick = (e) => {
      const isShowAlertBar = !alertList.isShowBar;
      dispatch({
        type: 'alertList/toggleBar',
        payload: isShowAlertBar,
      })
    }
<<<<<<< HEAD
    const alertDeatilProps = {
      extraProps: {
        currentAlertDetail,
        isShowOperateForm: alertDetail.isShowOperateForm,
        operateForm: alertDetail.operateForm,
        isShowRemark: alertDetail.isShowRemark,
        operateRemark: alertDetail.operateRemark,
        ciUrl: alertDetail.ciUrl,
        isLoading: alertDetail.isLoading
      },
      operateProps: {
        ...operateProps,
        dispatchDisabled: alertDetailOperation.dispatchDisabled,
        closeDisabled: alertDetailOperation.closeDisabled,
        resolveDisabled: alertDetailOperation.resolveDisabled,
        notifyDisabled: alertDetailOperation.notifyDisabled,
        shareDisabled: alertDetailOperation.shareDisabled
        // // 子告警不能派发、已关闭的不能派发、未接手的不能派发
        // dispatchDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255 || currentAlertDetail['status'] === 0,
        // // 子告警不能关闭、处理中和已关闭的不能关闭
        // closeDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255 || currentAlertDetail['status'] == 40,
        // // 子告警不能解决、已解决和已关闭的不能解决
        // resolveDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255 || currentAlertDetail['status'] == 190,
        // // 子告警不能通知、只有未接手和处理中的告警能通知
        // notifyDisabled: currentAlertDetail['parentId'] || !(currentAlertDetail['status'] == 0 || currentAlertDetail['status'] == 150),
        // // 子告警不能分享
        // shareDisabled: currentAlertDetail['parentId']
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
        form.validateFieldsAndScroll((errors, values) => {
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
        form.validateFieldsAndScroll((errors, values) => {
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
        alertOperateModalOrigin === 'detail' && dispatch({ type: 'alertDetail/openDetailModal' })
      }
    }

    const notifyModalProps = {
      disableChatOps: alertOperateModalOrigin === 'detail' ? alertDetailOperation.disableChatOps : alertOperation.disableChatOps,
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

    const reassignModalProps = {
      isShowReassingModal: alertOperateModalOrigin === 'detail' ? alertDetailOperation.isShowReassingModal : alertOperation.isShowReassingModal,
      users: alertOperation.users,
      onOk: (selectedUser) => {
        dispatch({
          type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/submitReassign' : 'alertOperation/submitReassign',
          payload: {
            toWho: selectedUser
          }
        })
      },
      onCancel: () => {
        dispatch({
          type: alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleReassignModal' : 'alertOperation/toggleReassignModal',
          payload: false
        })
      }
    }
=======
>>>>>>> 64c5b31cd13a159daf56731d4a604858be8a6073

    const refreshProps = {
      onChange(checked) {

        localStorage.setItem('__alert_refresh', checked)
        if (!checked) {
          window.__alert_refresh_timer && clearInterval(window.__alert_refresh_timer)
          window.__alert_refresh_timer = undefined

        } else {
          if (!window.__alert_refresh_timer) {

            window.__alert_refresh_timer = setInterval(function () {
              dispatch({
                type: 'tagListFilter/refresh',
              })
            }, 60000)

          }
        }
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
    Object.keys(levels).length !== 0 && Object.keys(levels).forEach((severity) => {
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
      isShowVisualTab = !(groupName == 'source' || groupName == 'status' || groupName == 'severity')

    return (
      <div style={{ position: 'relative' }}>
        <FilterHead
          style={{ marginBottom: '20px' }}
          defaultTime={alertManage.selectedTime}
          defaultStatus={alertManage.selectedStatus}
          queryByTime={(value) => {
            dispatch({ type: 'tagListFilter/selectTime', payload: value })
          }}
          queryByStatus={(value) => {
            dispatch({ type: 'tagListFilter/selectStatus', payload: value })
          }}
        />
        <div className={alertList.isShowBar ? styles.showBar : styles.hideBar}>
          <AlertTagsFilter />
          <div className={styles.alertSwitch}><span><FormattedMessage {...localeMessage['auto_refresh']} /></span><Switch {...refreshProps} /></div>
          <AlertBar />
        </div>
        <Button className={classnames(styles.toggleBarButton, zhankaiClass)} onClick={toggleBarButtonClick} size="small"><i className={classnames(alertList.isShowBar ? shouqiClass : zhankaiClass, styles.toggleBarButtonIcon)} /></Button>
        <div className={styles.alertListPage + " " + (alertList.isShowBar ? '' : styles.marginTop0)}>
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span className={tabList}><FormattedMessage {...localeMessage['tab_list']} /></span>} key='1'>
              {/*<AlertOperation position='list' {...operateProps} />*/}
              <AlertOperationWrap />
              <ListTableWrap />
            </TabPane>
            <TabPane tab={<span className={tabLine} ><FormattedMessage {...localeMessage['tab_time']} /></span>} key='2'>
              {/*<AlertOperation position='timeAxis' {...operateProps} />*/}
              <AlertOperationWrap />
              <ListTimeTableWrap />
            </TabPane>
            {isShowVisualTab &&
              <TabPane tab={<span className={tabVisual}><FormattedMessage {...localeMessage['tab_visual']} /></span>} key='3'>
                <VisualAnalyzeWrap key={new Date().getTime()} />
              </TabPane>
            }
          </Tabs>
          <ul className={styles.levelBar}>
            {
              Object.keys(levels_wapper).length !== 0 && Object.keys(levels_wapper).sort((prev, next) => {
                return Number(next) - Number(prev);
              }).map((key, index) => {
                return (<li key={index}><LevelIcon extraStyle={styles.extraStyle} iconType={key} /><p>{`${window['_severity'][key]}（${levels_wapper[key]}）`}</p></li>)
              })
            }
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='noAlerts' /><p><FormattedMessage {...localeMessage['noAlert']} /></p></li>
          </ul>
        </div>

        <AlertDetailWrap />
        <AlertOriginSliderWrap />
        <ScrollTopButton />
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  return {
    alertManage: state.alertManage,
    alertListTable: state.alertListTable,
    alertList: state.alertList,
  }
})(AlertListManage))
