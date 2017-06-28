import { parse } from 'qs'
import { queryDetail } from '../services/alertDetail'
import { changeTicket, viewTicket } from '../services/alertOperation'
import { message } from 'antd'

const initalState = {
  isShowDetail: false, // 是否显示detail

  currentAlertDetail: {

  },

  operateForm: undefined, // 操作工单（当前）
  isShowOperateForm: false, // 是否显示操作工单文本

  isShowTicketModal: false, //派发工单框
  ticketUrl: '', //工单链接
  ciUrl: '', //ci信息的链接

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
    *openDetailModal({ payload }, { select, put, call }) {
      const viewDetailAlertId = yield select(state => state.alertListTable.viewDetailAlertId)
      // 去除上一次的orderFlowNum和ciUrl地址
      yield put({
        type: 'beforeOpenDetail',
      })
      if (viewDetailAlertId) {
        const detailResult = yield queryDetail(viewDetailAlertId);
        if (detailResult.result) {
          yield put({
            type: 'setDetail',
            payload: detailResult.data || {}
          })
          yield put({
            type: 'alertDetailOperation/setDetailBtnDisable',
            payload: detailResult.data
          })
          if (detailResult.data && detailResult.data.orderFlowNum) {
            yield put({
              type: 'setFormData',
              payload: detailResult.data.orderFlowNum
            })
          }
          if (detailResult.data && detailResult.data.ciUrl !== undefined && detailResult.data.ciUrl != '') {
            yield put({
              type: 'setCiUrl',
              payload: detailResult.data.ciUrl
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
    // 编辑工单流水号
    *changeTicketFlow({ payload }, { select, put, call }) {
      const { currentAlertDetail } = yield select(state => {
        return {
          'currentAlertDetail': state.alertDetail.currentAlertDetail
        }
      })
      if (payload !== undefined) {
        const changeResult = yield call(changeTicket, {
          id: currentAlertDetail.id,
          orderFlowNum: payload
        })
        if (changeResult.result) {
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
          yield put({
            type: 'setFormData',
            payload: payload
          })
        } else {
          yield message.error(window.__alert_appLocaleData.messages[changeResult.message], 3);
        }
      } else {
        console.error('ticket flow is null')
      }
    },
    // 工单详情
    *viewTicketDetail({ payload }, { select, put, call }) {
      const { currentAlertDetail } = yield select(state => {
        return {
          'currentAlertDetail': state.alertDetail.currentAlertDetail
        }
      })
      if (currentAlertDetail.itsmDetailUrl) {
        yield window.open(currentAlertDetail.itsmDetailUrl)

        return;
      }
      if (payload !== undefined) {
        const viewResult = yield call(viewTicket, payload)
        if (viewResult.result) {
          if (viewResult.data !== undefined && viewResult.data.url !== '') {
            window.open(viewResult.data.url)
          }
        } else {
          yield message.error(window.__alert_appLocaleData.messages[viewResult.message], 3);
        }
      } else {
        console.error('Ticket Flow is null')
      }
    },
    // 关闭时
    *closeDetailModal({ payload }, { select, put, call }) {
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
    // beforeOpenDetail
    beforeOpenDetail(state, { payload }) {
      return { ...state, operateForm: initalState.operateForm, ciUrl: initalState.ciUrl }
    },
    // 初始化operateForm
    initalFormData(state) {
      return { ...state, operateRemark: state.currentAlertDetail.form }
    },
    // 储存detail信息
    setDetail(state, { payload: currentAlertDetail }) {
      return { ...state, currentAlertDetail, isShowOperateForm: false }
    },
    // 切换侧滑框的状态
    toggleDetailModal(state, { payload: isShowDetail }) {
      return { ...state, isShowDetail }
    },
    // 切换工单的状态
    toggleFormModal(state, { payload: isShowOperateForm }) {
      return { ...state, isShowOperateForm }
    },
    // 切换备注的状态
    toggleRemarkModal(state, { payload: isShowRemark }) {
      return { ...state, isShowRemark }
    },
    // 存储工单信息
    setFormData(state, { payload: operateForm }) {
      return { ...state, operateForm }
    },
    // 存储备注信息
    setRemarkData(state, { payload: operateRemark }) {
      return { ...state, operateRemark }
    },
    // 派发工单框
    toggleTicketModal(state, { payload: payload }) {
      return { ...state, ...payload }
    },
    // 关闭工单
    closeTicketModal(state) {
      return {
        ...state,
        isShowTicketModal: false,
        ticketUrl: '',
      }
    },
    // ci链接
    setCiUrl(state, { payload: ciUrl }) {
      return { ...state, ciUrl: ciUrl }
    },
  },
}
