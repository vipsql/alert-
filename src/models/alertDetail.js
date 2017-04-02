import {parse} from 'qs'
import { queryDetail } from '../services/alertDetail'
import { message } from 'antd'

const initalState = {
  isShowDetail: false, // 是否显示detail

  currentAlertDetail: {
    
  },

  operateForm: undefined, // 操作工单（当前）
  isSowOperateForm: false, // 是否显示操作工单文本

  isShowTicketModal: false, //派发工单框
  ticketUrl: '', //工单链接

  operateRemark: undefined, // 备注信息
  isShowRemark: false, // 是否显示备注框

}

export default {
  namespace: 'alertDetail',

  state: initalState,

  subscriptions: {

  },

  effects: {
    *initalForm() {
      // 将初始的detail form --> operateForm
    },

    // 点击展开detail时的操作
    *openDetailModal({payload}, {select, put, call}) {
      const viewDetailAlertId = yield select( state => state.alertListTable.viewDetailAlertId )
      
      if (viewDetailAlertId) {
        const detailResult = yield queryDetail(viewDetailAlertId);
        if ( detailResult.result ) {
          yield put({
            type: 'setDetail',
            payload: detailResult.data || {}
          })
          if (detailResult.data.orderInfo) {
            yield put({
              type: 'setFormData',
              payload: detailResult.data.orderInfo
            })
          }
          yield put({
            type: 'toggleDetailModal',
            payload: true
          })
        } else {
          yield message.error(window.__alert_appLocaleData.messages[detailResult.message], 3);
        }
      } else {
        console.error('viewDetailAlertId type error')
      }
    },
    // 关闭时
    *closeDetailModal({payload}, {select, put, call}) {
      yield put({
        type: 'alertListTable/toggleDetailAlertId',
        payload: false
      })
      yield put({
          type: 'toggleDetailModal',
          payload: false
      })
    }
  },

  reducers: {
    // 初始化operateForm
    initalFormData(state) {
      return { ...state, operateRemark: state.currentAlertDetail.form }
    },
    // 储存detail信息
    setDetail(state, {payload: currentAlertDetail}) {
      return { ...state, currentAlertDetail }
    },
    // 切换侧滑框的状态
    toggleDetailModal(state, {payload: isShowDetail}) {
      return { ...state, isShowDetail }
    },
    // 切换工单的状态
    toggleFormModal(state, {payload: isSowOperateForm}) {
      return { ...state, isSowOperateForm }
    },
    // 切换备注的状态
    toggleRemarkModal(state, {payload: isShowRemark}) {
      return { ...state, isShowRemark }
    },
    // 存储工单信息
    setFormData(state, {payload: operateForm}) {
      return { ...state, operateForm }
    },
    // 存储备注信息
    setRemarkData(state, {payload: operateRemark}) {
      return { ...state, operateRemark }
    },
    // 派发工单框
    toggleTicketModal(state, {payload: payload}){
        return {...state , ...payload}
    },
    // 关闭工单
    closeTicketModal(state){
        return {
            ...state,
            isShowTicketModal: false
        }
    }
  },
}
