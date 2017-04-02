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

            const {currentAlertDetail} = yield select( state => {
                return {
                    'currentAlertDetail': state.alertDetail.currentAlertDetail
                }
            })
            if (currentAlertDetail !== undefined && Object.keys(currentAlertDetail).length !== 0 ) {
                let hostUrl = 'itsm.uyun.cn';
                let callbackHostUrl = 'alert.uyun.cn';
                let userInfo = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'))
                if (window.location.origin.indexOf("alert") > -1) {
                    //域名访问
                    hostUrl = window.location.origin.replace(/alert/, 'itsm');
                    callbackHostUrl = window.location.origin;
                } else {
                    //顶级域名/Ip访问
                    hostUrl = window.location.origin + '/itsm';
                    callbackHostUrl = window.location.origin + '/alert';
                }
                let callbackUrl = 
                    `${callbackHostUrl}/openapi/v2/incident/handleOrder?incidentId=${currentAlertDetail['id']}&api_key=${userInfo.apiKeys[0]}`;
                const result = {
                    id: payload, //payload
                    url: encodeURIComponent(callbackUrl),
                    title: encodeURIComponent(currentAlertDetail['name']),
                    urgentLevel: currentAlertDetail['severity'] + 1,
                    ticketDesc: encodeURIComponent(currentAlertDetail['description']),
                    announcer: encodeURIComponent(userInfo['realName']),
                    sourceId: currentAlertDetail['resObjectId'] ? currentAlertDetail['resObjectId'] : '',
                    hideHeader: 1
                }
                
                yield window.open(`${hostUrl}/#/create/${result.id}/${result.url}?ticketSource=${'alert'}&title=${result.title}&urgentLevel=${result.urgentLevel}&ticketDesc=${result.ticketDesc}&announcer=${result.announcer}&sourceId=${result.sourceId}&hideHeader=${result.hideHeader}`);
            } else {
                console.error('currentAlertDetail error');
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
        let userInfo = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'))
        const {currentAlertDetail} = yield select( state => {
            return {
                'currentAlertDetail': state.alertDetail.currentAlertDetail
            }
        })
        if (currentAlertDetail !== undefined && Object.keys(currentAlertDetail).length !== 0) {
            const shareResult = yield shareRoom(payload, 'ALERT', userInfo['userId'], {
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
