import {parse} from 'qs'
import { getFormOptions, dispatchForm, close, resolve, merge, relieve, suppress, getChatOpsOptions, shareRoom} from '../services/alertOperation'
import { message } from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const initalState = {
    // 操作的alertIds
    formOptions: [],
    chatOpsRooms: [],

    // 各个modal弹窗
    isShowFormModal: false, // 派发
    isShowCloseModal: false, // 关闭
    isShowResolveModal: false, // 解决
    isShowChatOpsModal: false, //chatops
    isShowTimeSliderModal: false, // suppress
    isShowRemindModal: false, // 提醒框
}

export default {
  namespace: 'alertDetailOperation',

  state: initalState,

  effects: {
    // 打开抑制告警Modal
    *openSuppressTimeSlider({payload}, {select, put, call}) {
        yield put({
            type: 'toggleSuppressTimeSliderModal',
            payload: true
        })
    },
    // 抑制告警
    *suppressIncidents({payload: {time}}, {select, put, call}) {
        const successRemind = yield localStorage.getItem('__alert_suppress_remind')
        const { viewDetailAlertId } = yield select( state => {
            return {
                'viewDetailAlertId': state.alertListTable.viewDetailAlertId
            }
        })
        
        if (viewDetailAlertId && time !== undefined) {
            let stringId = '' + viewDetailAlertId;
            const suppressData = yield suppress({
                incidentIds: [stringId],
                time: Number(time)
            })
            if (suppressData.result) {
                if (successRemind === null || JSON.parse(successRemind)) {
                    yield put({
                        type: 'toggleRemindModal',
                        payload: true
                    })
                } else {
                    yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                }
            } else {
                yield message.error(window.__alert_appLocaleData.messages[suppressData.message], 3);
            }
        } else {
            console.error('select incident/incident type error');
        }
    },
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
                if (resultData.data.result) {
                    yield put({ type: 'alertListTable/changeCloseState', payload: {arrList: [stringId], status: 255}})
                    yield put({ type: 'alertDetail/openDetailModal'})
                    yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                    yield put({ type: 'alertDetail/toggleDetailModal', payload: false})
                } else {
                    yield message.error(`${resultData.data.failures}`, 3);
                }
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
    // 解决告警
    *resolveAlert({payload}, {select, put, call}) {
        const { viewDetailAlertId } = yield select( state => {
            return {
                'viewDetailAlertId': state.alertListTable.viewDetailAlertId
            }
        })
        
        if ( viewDetailAlertId ) {
            let stringId = '' + viewDetailAlertId;
            const resultData = yield resolve({
                incidentIds: [stringId],
                resolveMessage: payload
            })
            if (resultData.result) {
                if (resultData.data.result) {
                    yield put({ type: 'alertListTable/changeCloseState', payload: {arrList: [stringId], status: 190}})
                    yield put({ type: 'alertDetail/openDetailModal'})
                    yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                    yield put({ type: 'alertDetail/toggleDetailModal', payload: false})
                } else {
                    yield message.error(`${resultData.data.failures}`, 3);
                }
            } else {
                yield message.error(window.__alert_appLocaleData.messages[resultData.message], 3);
            }
        } else {
            console.error('please select incidet/incident is error');
        }
        yield put({
            type: 'toggleResolveModal',
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
                code: payload.id,
                name: payload.name
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
    // 派发工单成功后的操作
    *afterDispatch({payload}, {select, put, call}) {
        const { viewDetailAlertId } = yield select( state => {
            return {
                'viewDetailAlertId': state.alertListTable.viewDetailAlertId
            }
        })
        yield put({ type: 'alertListTable/changeCloseState', payload: {arrList: ['' + viewDetailAlertId], status: 150}})
        yield put({ type: 'alertDetail/openDetailModal'})
        yield put({ type: 'alertDetail/closeTicketModal'})
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
            let roomId = payload.id;
            let incidentId = currentAlertDetail.id;
            let roomName = payload.roomName
            const shareResult = yield shareRoom(roomId, incidentId, roomName, {
                body: {
                    type: 'alert',
                    data: {
                        ...currentAlertDetail,
                        severityDesc: window['_severity'][currentAlertDetail['severity']],
                        status: window['_status'][currentAlertDetail['status']]
                    }  
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
      toggleResolveModal(state, {payload: isShowResolveModal}) {
          return { ...state, isShowResolveModal }
      },
      toggleSuppressTimeSliderModal(state, {payload: isShowTimeSliderModal}) {
          return { ...state, isShowTimeSliderModal}
      },
      toggleRemindModal(state, {payload: isShowRemindModal}) {
          return { ...state, isShowRemindModal }
      },
  }
}
