import {parse} from 'qs'
import { getFormOptions, dispatchForm, close, merge, relieve, getChatOpsOptions, shareRoom} from '../services/alertOperation'
import { message } from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const initalState = {
    // 操作的alertIds
    formOptions: [],
    chatOpsRooms: [],

    // 各个modal弹窗
    isShowFormModal: false, // 派发
    isShowCloseModal: false, // 关闭
    isShowChatOpsModal: false, //chatops

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
          if (options.result) {
              yield put({
                  type: 'setFormOptions',
                  payload: options.data || []
              })
          } else {
              yield message.error(`${options.message}`, 3)
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
                  yield put({ type: 'alertListTable/changeCloseState', payload: [stringId]})
                  yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                  yield put({ type: 'alertDetail/toggleDetailModal', payload: false})
              } else {
                  yield message.error(window.__alert_appLocaleData.messages[resultData.message], 3);
              }
          } else {
              console.error('please select incidet/incident is error');
          }
          yield put({
            type: 'toggleCloseModal',
            payload: false
          })
      },
      // 确定派发工单
      *dispatchForm({payload}, {select, put, call}) {
          const { viewDetailAlertId} = yield select( state => {
              return {
                  'viewDetailAlertId':state.alertListTable.viewDetailAlertId
              }
          })
          if (viewDetailAlertId) {
            let stringId = '' + viewDetailAlertId;
            const data = yield call(dispatchForm, {
                id: stringId,
                code: payload
            })
            if(data.result){
                //window.open(data.data.url)
                 yield put({ 
                    type: 'alertDetail/toggleTicketModal', 
                    payload: {
                        isShowTicketModal: true,
                        ticketUrl: data.data.url
                    }
                })
            } else {
                yield message.error(window.__alert_appLocaleData.messages[data.message], 3);
            }
            
          }else{
              console.error('selectedAlertIds error');
          }

          yield put({
              type: 'toggleFormModal',
              payload: false
          })
      },
      // 打开分享到ChatOps的modal
      *openChatOps({payload}, {select, put, call}) {
            const options = yield getChatOpsOptions();
            if (options.result) {
                yield put({
                    type: 'setChatOpsRoom',
                    payload: options.data || [],
                })
            } else {
                yield message.error(`${options.message}`, 2);
            }
            yield put({
                type: 'toggleChatOpsModal',
                payload: true
            })
      },
      *shareChatOps({payload}, {select, put, call}) {
        const {currentAlertDetail} = yield select( state => {
            return {
                'currentAlertDetail': state.alertDetail.currentAlertDetail
            }
        })
        if (currentAlertDetail !== undefined && Object.keys(currentAlertDetail).length !== 0) {
            const shareResult = yield shareRoom(payload, {
                body: {
                    ...currentAlertDetail,
                    type: 'alert',
                    severityDesc: window['_severity'][currentAlertDetail['severity']],
                    status: window['_status'][currentAlertDetail['status']],
                }
            });
            if (shareResult.result) {
                yield message.success(window.__alert_appLocaleData.messages['constants.success'], 2)
            } else {
                yield message.error(`${shareResult.message}`, 2)
            }
        }
        yield put({
            type: 'toggleChatOpsModal',
            payload: false
        })
    }

  },

  reducers: {
      // 设置工单类型
      setFormOptions(state, { payload }) {
          return { ...state, formOptions: payload }
      },
      // 设置chatOps群组
      setChatOpsRoom(state, { payload }) {
          return { ...state, chatOpsRooms: payload }
      },
      // 转换modal状态
      toggleChatOpsModal(state, {payload: isShowChatOpsModal}) {
          return { ...state, isShowChatOpsModal}
      },
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
