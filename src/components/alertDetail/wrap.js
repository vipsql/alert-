import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import AlertDetail from '../common/alertDetail/index'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import styles from './index.less'
import { classnames } from '../../utils'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import SuppressModal from '../common/suppressModal/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import ReassignModal from '../common/reassignModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'

const AlertDetailWrap = ({ alertDetail, dispatch, afterTakeOver, afterChatOpsh, afterClose, afterDispatch, afterMunalNotify, afterReassign, afterResolve, afterSuppress }) => {

  const localeMessage = defineMessages({
    assign_ticket: {
      id: 'alertDetail.ticket.assgin',
      defaultMessage: '派发工单'
    },
  })

  const reassignModalProps = {
    isShowReassingModal: alertDetail.isShowReassingModal,
    users: alertDetail.users,
    onOk: (selectedUser) => {
      console.log(selectedUser, "reassignModal");
      dispatch({
        type: 'alertDetail/submitReassign',
        payload: {
          toWho: selectedUser,
          resolve: afterReassign
        }
      })
    },
    onCancel: () => {
      dispatch({
        type: 'alertDetail/toggleReassignModal',
        payload: false
      })
    }
  }

  const shanchuClass = classnames(
    'iconfont',
    'icon-shanchux'
  )

  const closeModalProps = {
    currentData: alertDetail,

    onOk: (form) => {
      form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        const formData = form.getFieldsValue()

        dispatch({
          type: 'alertDetail/closeAlert',
          payload: {
            closeMessage: formData.closeMessage,
            resolve: afterClose
          }
        })
        form.resetFields();
      })

    },
    onCancal: (form) => {
      dispatch({
        type: 'alertDetail/toggleCloseModal',
        payload: false
      })
      form.resetFields();
    }
  }

  const resolveModalProps = {
    currentData: alertDetail,

    onOk: (form) => {
      form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        const formData = form.getFieldsValue()

        dispatch({
          type: 'alertDetail/resolveAlert',
          payload: {resolveMessage: formData.resolveMessage, resolve: afterResolve}
        })
        form.resetFields();
      })

    },
    onCancal: (form) => {
      dispatch({
        type: 'alertDetail/toggleResolveModal',
        payload: false
      })
      form.resetFields();
    }
  }

  const dispatchModalProps = {
    currentData: alertDetail,

    closeDispatchModal: () => {
      dispatch({
        type: 'alertDetail/toggleDispatchModal',
        payload: false
      })
    },
    onOk: (value) => {
      dispatch({
        type: 'alertDetail/dispatchForm',
        payload: {...value, resolve: afterDispatch}
      })
    },
    onCancal: () => {
      dispatch({
        type: 'alertDetail/toggleDispatchModal',
        payload: false
      })
    }
  }

  const chatOpsModalProps = {
    currentData: alertDetail,

    closeChatOpsModal: () => {
      dispatch({
        type: 'alertDetail/toggleChatOpsModal',
        payload: false
      })
    },
    onOk: (value) => {
      dispatch({
        type: 'alertDetail/shareChatOps',
        payload: {...value, resolve: afterChatOpsh}
      })
    },
    onCancal: () => {
      dispatch({
        type: 'alertDetail/toggleChatOpsModal',
        payload: false
      })
    }
  }

  const notifyModalProps = {
    disableChatOps: alertDetail.disableChatOps,
    isShowNotifyModal: alertDetail.isShowNotifyModal,
    notifyIncident: alertDetail.notifyIncident,
    notifyUsers: alertDetail.notifyUsers,
    onOk: (data) => {
      dispatch({
        type: "alertDetail/notyfiyIncident",
        payload: { data, resolve: afterMunalNotify }
      })
    },
    onCancel: () => {
      dispatch({
        type: "alertDetail/initManualNotifyModal",
        payload: {
          isShowNotifyModal: false
        }
      })
    }
  }

  const timeSliderProps = {
    isShowTimeSliderModal: alertDetail.isShowTimeSliderModal,
    onOk: (time) => {
      dispatch({
        type: "alertDetail/suppressIncidents",
        payload: {
          time: time,
          resolve: afterSuppress
        }
      })
      dispatch({
        type: "alertDetail/toggleSuppressTimeSliderModal",
        payload: false
      })
    },
    onCancel: () => {
      dispatch({
        type: "alertDetail/toggleSuppressTimeSliderModal",
        payload: false
      })
    }
  }

  const suppressModalProps = {
    isShowRemindModal: alertDetail.isShowRemindModal,
    onKnow: (checked) => {
      if (checked) {
        localStorage.setItem('__alert_suppress_remind', 'false')
      }
      dispatch({
        type: "alertDetail/toggleRemindModal",
        payload: false
      })
      dispatch({ type: 'alertDetail/openDetailModal' })
    }
  }

  const ticketModalProps = {
    isShowTicketModal: alertDetail.isShowTicketModal,
    ticketUrl: alertDetail.ticketUrl,
    onCloseTicketModal() {
      dispatch({
        type: 'alertDetail/closeTicketModal'
      })
    }
  }
  const operateProps = {
    dispatchFunc: (position) => {
      dispatch({
        type: 'alertDetail/openFormModal',
      })
    },
    closeFunc: (position) => {
      dispatch({
        type: 'alertDetail/openCloseModal',
      })
    },
    resolveFunc: (position) => {
      dispatch({
        type: 'alertDetail/toggleResolveModal',
        payload: true
      })
    },
    showChatOpsFunc: (position) => {
      dispatch({
        type: 'alertDetail/openChatOps',
      })
    },
    showNotifyFunc: (position) => {
      dispatch({
        type: 'alertDetail/openNotify',
      })
    },
    suppressIncidents: (min, position) => {
      dispatch({
        type: 'alertDetail/suppressIncidents',
        payload: {
          time: min
        }
      })
    },
    showSuppressTimeSlider: (position) => {
      dispatch({
        type: 'alertDetail/openSuppressTimeSlider',
      })
    },
    takeOverFunc: () => {
      dispatch({
        type: 'alertDetail/takeOver',
        payload: {
          resolve: afterTakeOver
        }
      })
    },
    showReassiginFunc: () => {
      dispatch({
        type: 'alertDetail/openReassign'
      })
    }
  }

  const alertDeatilProps = {
    extraProps: {
      currentAlertDetail: alertDetail.currentAlertDetail,
      isShowOperateForm: alertDetail.isShowOperateForm,
      operateForm: alertDetail.operateForm,
      isShowRemark: alertDetail.isShowRemark,
      operateRemark: alertDetail.operateRemark,
      ciUrl: alertDetail.ciUrl,
      isLoading: alertDetail.isLoading,
      invokeByOutside: alertDetail.invokeByOutside
    },
    operateProps: {
      ...operateProps,
      dispatchDisabled: alertDetail.dispatchDisabled,
      closeDisabled: alertDetail.closeDisabled,
      resolveDisabled: alertDetail.resolveDisabled,
      notifyDisabled: alertDetail.notifyDisabled,
      shareDisabled: alertDetail.shareDisabled
    },

    closeDeatilModal: () => {
      dispatch({
        type: 'alertDetail/closeDetailModal',
        payload: false
      })
    },
    clickTicketFlow: (operateForm) => {
      if (operateForm !== undefined && operateForm !== '') {
        dispatch({
          type: 'alertDetail/viewTicketDetail',
          payload: operateForm
        })
      }
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
  const detailModal = Object.keys(alertDetail.currentAlertDetail).length !== 0 ?
    <div
      className={
        alertDetail.invokeByOutside ?
        styles.alertDetailModalByOutside
        :
        alertDetail.isShowDetail ?
        classnames(styles.alertDetailModal, styles.show)
        :
        styles.alertDetailModal
      }
    >
      <AlertDetail {...alertDeatilProps} />
    </div>
    :
    undefined
  return (
    <div>
      {ticketModalProps.ticketUrl && <div
        className={
          alertDetail.invokeByOutside ?
          styles.ticketModalByOutside
          :
          ticketModalProps.isShowTicketModal ?
          classnames(styles.ticketModal, styles.show)
          : styles.ticketModal
        }
      >
        <div className={styles.detailHead}>
          <p><FormattedMessage {...localeMessage['assign_ticket']} /></p>
          <i className={classnames(styles.shanChu, shanchuClass)} onClick={ticketModalProps.onCloseTicketModal}></i>
        </div>
        <iframe src={ticketModalProps.ticketUrl}>
        </iframe>
      </div>}
      <CloseModal {...closeModalProps} />
      <DispatchModal {...dispatchModalProps} />
      <ChatOpshModal {...chatOpsModalProps} />
      <ResolveModal {...resolveModalProps} />
      <SuppressModal {...suppressModalProps} />
      <SuppressTimeSlider {...timeSliderProps} />
      <ManualNotifyModal {...notifyModalProps} />
      <ReassignModal {...reassignModalProps} />
      {
        detailModal
      }
    </div>
  )
}

AlertDetailWrap.propTypes = {
  afterTakeOver: PropTypes.func, // 告警接手后的回调方法
  afterClose: PropTypes.func, // 告警关闭后的回调方法
  afterDispatch: PropTypes.func, // 告警派发后的回调方法
  afterChatOpsh: PropTypes.func, // 告警发送到ChatOps后的回调方法
  afterResolve: PropTypes.func, // 告警解决后的回调方法
  afterSuppress: PropTypes.func, // 告警抑制后的回调方法
  afterReassign: PropTypes.func, // 告警转派后的回调方法
  afterMunalNotify: PropTypes.func // 告警通知后的回调方法
}

AlertDetailWrap.defaultProps = {
  afterTakeOver: () => {}, // 告警接手后的回调方法
  afterClose: () => {}, // 告警关闭后的回调方法
  afterDispatch: () => {}, // 告警派发后的回调方法
  afterChatOpsh: () => {}, // 告警发送到ChatOps后的回调方法
  afterResolve: () => {}, // 告警解决后的回调方法
  afterSuppress: () => {}, // 告警抑制后的回调方法
  afterReassign: () => {}, // 告警转派后的回调方法
  afterMunalNotify: () => {} // 告警通知后的回调方法
}

export default injectIntl(connect((state) => {
  return {
    alertDetail: state.alertDetail,
  }
})(AlertDetailWrap))