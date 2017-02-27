import {parse} from 'qs'
import { getFormOptions, dispatchForm, close, merge, relieve } from '../services/alertOperation'
import { message } from 'antd';

const initalState = {
    // 操作的alertIds
    formOptions: [],

    // 各个modal弹窗
    isShowFormModal: false, // 派发
    isShowCloseModal: false, // 关闭
}

export default {
  namespace: 'alertDetailOperation',

  state: initalState,

  effects: {
      // 打开派发工单做的相应处理
      *openFormModal({payload}, {select, put, call}) {
          const options = yield getFormOptions();
          if (options !== undefined) {
              yield put({
                  type: 'setFormOptions',
                  payload: options.data || []
              })
          } else {
              console.error('获取工单类型失败');
          }
          yield put({
            type: 'toggleFormModal',
            payload: true
          })
      },
      // 关闭告警
      *closeAlert({payload}, {select, put, call}) {
          const { userId, viewDetailAlertId } = yield select( state => {
              return {
                  'userId': state.app.userId,
                  'viewDetailAlertId': state.alertListTableCommon.viewDetailAlertId
              }
          })

          if (typeof viewDetailAlertId === 'number') {
              const resultData = yield close({
                  userId: userId, 
                  alertIds: [viewDetailAlertId],
                  closeMessage: payload
              })
              if (resultData.result) {
                  yield message.success(`关闭成功`, 3);
              } else {
                  yield message.error(`${resultData.message}`, 3);
              }
          } else {
              console.error('请先选择告警/告警Id类型错误');
          }
          yield put({
            type: 'toggleCloseModal',
            payload: false
          })
      },
      // 确定派发工单
      *dispatchForm({payload}, {select, put, call}) {

          const viewDetailAlertId = yield select( state => state.alertListTableCommon.viewDetailAlertId)

          if (typeof viewDetailAlertId === 'number') {
              const result = yield dispatchForm({
                  type: payload, 
                  alertId: viewDetailAlertId
              })
              if (result.data !== undefined) {
                  yield window.open(result.data); 
              } else {
                  yield message.error(`派发工单失败`, 3);
              }
          } else {
              console.error('请先选择告警/告警Id类型错误');
          }
          yield put({
            type: 'toggleFormModal',
            payload: false
          })
      }

  },

  reducers: {
      // 设置工单类型
      setFormOptions(state, { payload }) {
          return { ...state, formOptions: payload }
      },
      // 转换modal状态
      toggleFormModal(state, {payload: isShowFormModal}) {
          return { ...state, isShowFormModal }
      },
      toggleCloseModal(state, {payload: isShowCloseModal}) {
          return { ...state, isShowCloseModal }
      }

  }
}
