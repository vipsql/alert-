import {parse} from 'qs'
import { queryDetail } from '../services/alertDetail'

const initalState = {
    isShowDetail: false, // 是否显示detail
    selectGroup: '分组显示', // 默认是分组设置

    columnList: [
        {
            type: 0, // id 
            name: '常规',
            cols: [
                {id: 'entity', name: '对象', checked: false,},
                {id: 'alertName', name: '告警名称', checked: false,},
                {id: 'entityName', name: '告警来源', checked: false,},
                {id: 'status', name: '告警状态', checked: false,},
                {id: 'description', name: '告警描述', checked: false,},
                {id: 'lastTime', name: '持续时间', checked: false,},
                {id: 'lastOccurtime', name: '发生时间', checked: false,}
            ]
        },
    ],

    currentAlertDetail: {},

    operateForm: undefined, // 操作工单（当前）
    isSowOperateForm: false, // 是否显示操作工单文本

    operateRemark: undefined, // 备注信息
    isShowRemark: false, // 是否显示备注框
}

export default {
  namespace: 'alertQueryDetail',

  state: initalState,

  effects: {
    *initalForm() {
      // 将初始的detail form --> operateForm
    },

    // 点击展开detail时的操作
    *openDetailModal({payload}, {select, put, call}) {
      const viewDetailAlertId = yield select( state => state.alertQuery.viewDetailAlertId )
      
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
        type: 'alertQuery/toggleDetailAlertId',
        payload: false
      })
      yield put({
          type: 'toggleDetailModal',
          payload: false
      })
    },
    
    // 分组显示
    *groupView({payload}, {select, put, call}) {
        yield put({
            type: 'setGroupType',
            payload: payload
        })
        yield put({
            type: 'alertQuery/setGroup',
            payload: {
                isGroup: true,
                group: payload
            }
        })
    },
    // 无分组显示
    *noGroupView({payload}, {select, put, call}) {
        yield put({
            type: 'removeGroupType',
        })
        yield put({
            type: 'alertQuery/setGroup',
            payload: {
                isGroup: false,
            }
        })
    },
  },

  reducers: {
    // 设置分组显示的类型
    setGroupType(state, {payload: selectGroup}) {
        return { ...state, selectGroup }
    },
    // 移除分组显示的类型
    removeGroupType(state) {
        return { ...state, selectGroup: initalState.selectGroup }
    },
    // -----------------------------------------------
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
