import {parse} from 'qs'
import { queryDetail } from '../services/alertDetail'
import { queryCloumns } from '../services/alertQuery'
import { getFormOptions, dispatchForm, close, resolve, merge, relieve, suppress, getChatOpsOptions, shareRoom, changeTicket, viewTicket, notifyOperate} from '../services/alertOperation'
import { getUsers } from '../services/alertAssociationRules';
import { message } from 'antd'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const initalState = {
    isShowDetail: false, // 是否显示detail
    selectGroup: window['_groupBy'], // 默认是分组设置

    isShowFormModal: false, // 派发工单modal
    isShowChatOpsModal: false,
    formOptions: [],
    chatOpsRooms: [], // 群组
    isShowCloseModal: false,
    isShowResolveModal: false,
    isShowTimeSliderModal: false, // suppress
    isShowRemindModal: false, // 提醒框
    isShowNotifyModal: false, // 手工通知
    notifyIncident: {}, // 通知告警
    notifyUsers: [], // 告警通知用户
    disableChatOps: false, // 是否可以私发chatops

    isShowTicketModal: false, //派发工单框
    ticketUrl: '', //工单链接
    ciUrl: '', //ci信息的链接

    selectColumn: [], // 选择的列
    extendColumnList: [], //扩展字段
    extendTagsKey: [], // 标签
    columnList: [
        {
            type: 0, // id 
            cols: [
                {id: 'entityName', checked: true,},
                {id: 'name', checked: false,},
                {id: 'source', checked: false,},
                {id: 'description', checked: false,},
                {id: 'count', checked: false,},
                {id: 'lastTime', checked: false,},
                {id: 'lastOccurTime', checked: false,},
                {id: 'status', checked: false,},
                {id: 'firstOccurTime', checked: false,},
                {id: 'entityAddr', checked: false,},
                {id: 'orderFlowNum', checked: false,},
                {id: 'notifyList', checked: false,},
            ]
        },
    ],

    currentAlertDetail: {},

    operateForm: undefined, // 操作工单（当前）
    isShowOperateForm: false, // 是否显示操作工单文本

    operateRemark: undefined, // 备注信息
    isShowRemark: false, // 是否显示备注框
}

export default {
  namespace: 'alertQueryDetail',

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
                'viewDetailAlertId': state.alertQuery.viewDetailAlertId
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
    // 手工通知
    *openNotify({payload}, {select, put, call}) {
        const options = yield getChatOpsOptions();
        const {currentAlertDetail} = yield select( state => {
            return {
                'currentAlertDetail': state.alertQueryDetail.currentAlertDetail
            }
        })
        const result = yield call(getUsers);
        if (result.result) {
            yield put({
                type: 'initManualNotifyModal',
                payload: {
                    notifyIncident: currentAlertDetail,
                    isShowNotifyModal: true,
                    notifyUsers: result.data,
                    disableChatOps: options.result ? false : true
                }
            })
        } else {
            yield message.error(window.__alert_appLocaleData.messages[result.message], 3);
        }
    },
    *notyfiyIncident({payload}, {select, put, call}) {
        const { viewDetailAlertId } = yield select( state => {
            return {
                'viewDetailAlertId': state.alertQuery.viewDetailAlertId
            }
        })
        if (viewDetailAlertId) {
            let stringId = '' + viewDetailAlertId;
            const notify = yield call(notifyOperate, {
                incidentId: stringId,
                ...payload
            })
            if (notify.result) {
                yield put({ type: 'alertQuery/changeCloseState', payload: {arrList: [stringId], status: 150}})
                yield put({ type: 'openDetailModal' })
                yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
            } else {
                yield message.error(window.__alert_appLocaleData.messages[notify.message], 3);
            }
        } else {
            console.error('please select incidet/incident is error');
        }
        yield put({
            type: 'initManualNotifyModal',
            payload: {
                isShowNotifyModal: false
            }
        })
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
            type: 'toggleDispatchModal',
            payload: true
        })
    },
    // 确定派发工单
    *dispatchForm({payload}, {select, put, call}) {

        const viewDetailAlertId = yield select( state => state.alertQuery.viewDetailAlertId )

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
                    type: 'toggleTicketModal', 
                    payload: {
                        isShowTicketModal: true,
                        ticketUrl: data.data.url
                    }
                })
            } else {
                yield message.error(window.__alert_appLocaleData.messages[data.message], 3);
            }
        } else {
            console.error('selectedAlertIds error');
        }
        yield put({
          type: 'toggleDispatchModal',
          payload: false
        })
    },
    // 派发工单成功后的操作
    *afterDispatch({payload}, {select, put, call}) {
        const { viewDetailAlertId } = yield select( state => {
            return {
                'viewDetailAlertId': state.alertQuery.viewDetailAlertId
            }
        })
        yield put({ type: 'alertQuery/changeCloseState', payload: {arrList: ['' + viewDetailAlertId], status: 150}})
        yield put({type: 'openDetailModal'})
        yield put({type: 'closeTicketModal'})
    },
    // 打开关闭工单
    *openCloseModal({payload}, {select, put, call}) {
        yield put({type: 'toggleCloseModal', payload: true })  
    },
    // 点击展开detail时的操作
    *openDetailModal({payload}, {select, put, call}) {
      const viewDetailAlertId = yield select( state => state.alertQuery.viewDetailAlertId )
      // 去除上一次的orderFlowNum和ciUrl地址
      yield put({
          type: 'beforeOpenDetail',
      })
      if ( viewDetailAlertId ) {
        const detailResult = yield queryDetail(viewDetailAlertId);
        if ( detailResult.result ) {
          yield put({
            type: 'setDetail',
            payload: detailResult.data || {}
          })
          if (detailResult.data && detailResult.data.orderFlowNum) {
            yield put({
              type: 'setFormData',
              payload: detailResult.data.orderFlowNum
            })
          }
          if (detailResult.data.ciUrl !== undefined && detailResult.data.ciUrl != '') {
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
    *changeTicketFlow({payload}, {select, put, call}) {
        const { currentAlertDetail } = yield select( state => {
            return {
                'currentAlertDetail': state.alertQueryDetail.currentAlertDetail
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
    *viewTicketDetail({payload}, {select, put, call}) {
        const { currentAlertDetail } = yield select( state => {
            return {
                'currentAlertDetail': state.alertQueryDetail.currentAlertDetail
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
    // 关闭告警
    *closeAlert({payload}, {select, put, call}) {
        const { viewDetailAlertId } = yield select( state => {
            return {
                'viewDetailAlertId': state.alertQuery.viewDetailAlertId
            }
        })
        
        if (viewDetailAlertId) {
            let stringId = '' + viewDetailAlertId;
            const resultData = yield close({
                incidentIds: [stringId],
                closeMessage: payload
            })
            if (resultData.result) {
                if (resultData.data.result) {
                    yield put({ type: 'alertQuery/changeCloseState', payload: {arrList: [stringId], status: 255}})
                    yield put({ type: 'openDetailModal' })
                    yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                } else {
                    yield message.error(`${resultData.data.failures}`, 3);
                }
            } else {
                yield message.error(window.__alert_appLocaleData.messages[resultData.message], 3);
            }
        } else {
            console.error('select incident/incident type error');
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
                'viewDetailAlertId': state.alertQuery.viewDetailAlertId
            }
        })
        
        if (viewDetailAlertId) {
            let stringId = '' + viewDetailAlertId;
            const resultData = yield resolve({
                incidentIds: [stringId],
                resolveMessage: payload
            })
            if (resultData.result) {
                if (resultData.data.result) {
                    yield put({ type: 'alertQuery/changeCloseState', payload: {arrList: [stringId], status: 190}})
                    yield put({ type: 'openDetailModal' })
                    yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                } else {
                    yield message.error(`${resultData.data.failures}`, 3);
                }
            } else {
                yield message.error(window.__alert_appLocaleData.messages[resultData.message], 3);
            }
        } else {
            console.error('select incident/incident type error');
        }
        yield put({
          type: 'toggleResolveModal',
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
                'currentAlertDetail': state.alertQueryDetail.currentAlertDetail
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
                        status: window['_status'][currentAlertDetail['status']],
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
    // 列定制
    *checkColumn({payload}, {select, put, call}) {
        yield put({ type: 'setColumn', payload: payload })
        const selectColumn = yield select(state => state.alertQueryDetail.selectColumn)
        yield put({ type: 'alertQuery/customCols', payload: selectColumn})
    }
  },

  reducers: {
    // 列定制初始化
    initColumn(state, {payload: {baseCols, extend, tags}}) {
        const { columnList } = state;
        let newList = columnList;
        baseCols.forEach( (column, index) => {
            newList.forEach( (group) => {
                group.cols.forEach( (col) => {
                  if (column.key === col.id) {
                      col.checked = true;
                  }
                }) 
            })
        })
        if (extend.cols.length !== 0) {
            extend.cols.forEach( (col) => {
                col.checked = false;
            })
            newList[1] = extend
        }
        return { ...state, columnList: newList, extendColumnList: extend.cols, extendTagsKey: tags}
    },
    // show more时需要叠加columns
    addProperties(state, {payload: {properties, tags}}) {
        let { columnList, extendTagsKey } = state;
        let colIds = [];
        let newTags = [].concat(extendTagsKey);
        columnList.forEach( (item) => {
            if (item.type == 1) {
                item.cols.forEach( (col) => {
                    colIds.push(col.id)
                }) 
            }
        })
        if (properties.cols.length !== 0) {
            properties.cols.forEach( (targetCol) => {
                if (!colIds.includes(targetCol.id)) {
                    targetCol.checked = false;
                    columnList[columnList.length - 1].cols.push(targetCol)
                }
            })
        }
        if (tags.length !== 0) {
            tags.forEach( (tag) => {
                if (!extendTagsKey.includes(tag)) {
                    newTags.push(tag)
                }
            })
        }
        return {...state, columnList: columnList, extendColumnList: columnList[columnList.length - 1].cols, extendTagsKey: newTags}
    },
    // 列改变时触发
    setColumn(state, {payload: selectCol}) {
      const { columnList } = state;
      let arr = []
      const newList = columnList.map( (group) => {
          group.cols.map( (col) => {
              if (typeof selectCol !== 'undefined' && col.id === selectCol) {
                  col.checked = !col.checked;
              }
              if (col.checked) {
                  if (col.id == 'source' || col.id == 'lastTime' || col.id == 'lastOccurTime' || col.id == 'count' || col.id == 'status') {
                      arr.push({ key: col.id, title: col.name, order: true }) // order字段先定死
                  } else {
                      arr.push({ key: col.id, title: col.name }) // width先定死
                  }
              }
              return col;
          })
          return group;
      })
      
      return { ...state, columnList: newList, selectColumn: arr }
    },
    // beforeOpenDetail
    beforeOpenDetail(state, {payload}) {
        return { ...state, operateForm: initalState.operateForm, ciUrl: initalState.ciUrl}
    },
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
      return { ...state, currentAlertDetail, isShowOperateForm: false}
    },
    // 设置chatOps群组
    setChatOpsRoom(state, { payload }) {
        return { ...state, chatOpsRooms: payload }
    },
    // 转换modal状态
    toggleChatOpsModal(state, {payload: isShowChatOpsModal}) {
        return { ...state, isShowChatOpsModal}
    },
    // 切换侧滑框的状态
    toggleDetailModal(state, {payload: isShowDetail}) {
      return { ...state, isShowDetail }
    },
    // 设置工单类型
    setFormOptions(state, { payload }) {
        return { ...state, formOptions: payload }
    },
    // 切换派发工单modal的状态
    toggleDispatchModal(state, {payload: isShowFormModal}) {
        return { ...state, isShowFormModal }
    },
    toggleCloseModal(state, {payload: isShowCloseModal}) {
        return { ...state, isShowCloseModal }
    },
    toggleResolveModal(state, {payload: isShowResolveModal}) {
        return { ...state, isShowResolveModal }
    },
    // 切换工单的状态
    toggleFormModal(state, {payload: isShowOperateForm}) {
        return { ...state, isShowOperateForm }
    },
    // 切换备注的状态
    toggleRemarkModal(state, {payload: isShowRemark}) {
        return { ...state, isShowRemark }
    },
    toggleSuppressTimeSliderModal(state, {payload: isShowTimeSliderModal}) {
        return { ...state, isShowTimeSliderModal}
    },
    toggleRemindModal(state, {payload: isShowRemindModal}) {
        return { ...state, isShowRemindModal }
    },
    initManualNotifyModal(state, {payload: {isShowNotifyModal = false, notifyIncident = {}, notifyUsers = [], disableChatOps = false}}) {
        return { ...state, isShowNotifyModal, notifyIncident, notifyUsers, disableChatOps }
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
    // ci链接
    setCiUrl(state, {payload: ciUrl}) {
        return { ...state, ciUrl: ciUrl}
    },
    // 关闭工单
    closeTicketModal(state){
        return {
            ...state,
            isShowTicketModal: false,
            ticketUrl: '',
        }
    }
  },

}
