import {parse} from 'qs'
import { queryDetail } from '../services/alertDetail'
import { message } from 'antd'

const initalState = {
  isShowDetail: false, // 是否显示detail

  currentAlertDetail: {
    // alertId: 1,
    // alertName: '不满意交易笔数告警',
    // status: '已解决',
    // severity: '紧急',
    // entityName: 'CMDB',
    // description: '不满意交易笔数超过阈值2000',
    // firstOccurtime: '1487312852758', // 时间格式后期需要处理
    // lastOccurtime: '1487316452758',
    // count: 13,
    // responsiblePerson: '张某某',
    // responsibleDepartment: '---',
    // orderInfo: '张某某张某某张某某张某某张某某张某某张某某张某某张某某张某某张某某张某某', // 工单
    // propertys: [
    //   {code: 'affiliation', value: '江城分区'},
    //   {code: 'position', value: '华中区域'},
    //   {code: 'david', value: '武汉联通'}
    // ]
  },

  operateForm: undefined, // 操作工单（当前）
  isSowOperateForm: false, // 是否显示操作工单文本

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
      const viewDetailAlertId = yield select( state => state.alertListTableCommon.viewDetailAlertId )
      
      if (typeof viewDetailAlertId === 'number') {
        const detailResult = yield queryDetail(viewDetailAlertId);
        if ( typeof detailResult.data !== 'undefined' ) {
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
          yield message.error(`${detailResult.message}`, 3);
        }
      } else {
        console.error('viewDetailAlertId类型错误')
      }
    },
    // 关闭时
    *closeDetailModal({payload}, {select, put, call}) {
      yield put({
        type: 'alertListTableCommon/toggleDetailAlertId',
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
    }
  },
}
