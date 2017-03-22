import {parse} from 'qs'
import { getFormOptions, dispatchForm, close, merge, relieve } from '../services/alertOperation'
import { message } from 'antd';

const initalState = {
    // 操作的alertIds
    formOptions: [],

    // 各个modal弹窗
    isShowFormModal: false, // 派发
    isShowCloseModal: false, // 关闭

    isDropdownSpread: false,
    closeMessage: undefined // 关闭原因
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
                  payload: options || []
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
          const { viewDetailAlertId } = yield select( state => {
              return {
                  'viewDetailAlertId': state.alertListTable.viewDetailAlertId
              }
          })
          
          if ( viewDetailAlertId ) {
              let stringId = '' + viewDetailAlertId;
              const resultData = yield close({
                  incidentIds: [stringId],
                  closeMessage: payload
              })
              if (resultData.result) {
                  yield put({ type: 'alertListTable/deleteAlert', payload: [stringId]})
                  yield message.success(`关闭成功`, 3);
                  yield put({ type: 'alertDetail/toggleDetailModal', payload: false})
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

          const viewDetailAlertId = yield select( state => state.alertListTable.viewDetailAlertId)
          
          if ( viewDetailAlertId ) {
              const result = yield dispatchForm({
                  code: payload, 
                  id: viewDetailAlertId
              })
              if (result !== undefined) {
                  yield window.open(result.url); 
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
      },
      // 是否展开dropdown - closemodal
      toggleDropdown(state, { payload: isDropdownSpread }) {
          return { ...state, isDropdownSpread }
      },
      setCloseMessge(state, { payload: closeMessage}) {
          return { ...state, closeMessage }
      }

  }
}
