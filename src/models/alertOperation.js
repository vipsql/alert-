import {parse} from 'qs'
import { getFormOptions, dispatchForm, close, resolve, merge, relieve, suppress, getChatOpsOptions, shareRoom} from '../services/alertOperation'
import { queryAlertList, queryChild, queryAlertListTime } from '../services/alertList'
import { queryCloumns } from '../services/alertQuery'
import { message } from 'antd';
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const initalState = {
    // 操作的alertIds
    operateAlertIds: [], // 只有合并length>1
    formOptions: [],
    chatOpsRooms: [],

    // 各个modal弹窗
    isShowFormModal: false, // 派发
    isShowCloseModal: false, // 关闭
    isShowResolveModal: false, // 解决
    isShowMergeModal: false, // 合并
    isShowRelieveModal: false, // 解除
    isShowChatOpsModal: false, //chatops
    isShowTimeSliderModal: false, // suppress
    isShowRemindModal: false, // 提醒框

    isSelectAlert: false, // 是否选择了告警
    isSelectOrigin: false, // 是否选择了源告警

    originAlert: [], //选择的radio是个数组
    relieveAlert: {}, // 选中的解除对象
    mergeInfoList: [
        
    ], // 合并列表展示信息

    // 列定制(点击需要初始化进行数据结构转换)
    selectColumn: [], // 选择的列
    extendColumnList: [], //扩展字段
    extendTagsKey: [], // 标签
    columnList: [
        {
            type: 0, // id 
            cols: [
                {id: 'entityName', checked: false,},
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
        }
    ],

    // 分组显示
    isGroup: false,
    selectGroup: window['_groupBy'], // 默认是分组设置
}

export default {
  namespace: 'alertOperation',

  state: initalState,

  effects: {
      // 打开抑制告警Modal
      *openSuppressTimeSlider({payload: {position}}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const { operateAlertIds } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
              }
          })
          yield put({
              type: 'alertList/toggleModalOrigin',
              payload: position
          })
          if (position !== undefined && position === 'detail') {
              yield put({
                  type: 'alertDetailOperation/openSuppressTimeSlider',
              })
          } else {
            if (operateAlertIds.length === 0) {
                yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
            } else {
                yield put({
                    type: 'toggleSuppressTimeSliderModal',
                    payload: true
                })
            }
          }
      },
      // 抑制告警
      *beforeSuppressIncidents({payload: {time, position}}, {select, put, call}) {
        // 触发筛选
        yield put({ type: 'alertListTable/filterCheckAlert'})
        
        yield put({
            type: 'alertList/toggleModalOrigin',
            payload: position
        })
        if (position !== undefined && position === 'detail') {
            yield put({
                type: 'alertDetailOperation/suppressIncidents',
                payload: {
                    time: time
                }
            })
        } else {
            yield put({
                type: 'suppressIncidents',
                payload: {
                    time: time
                }
            })
        }
      },
      // 抑制告警
      *suppressIncidents({payload: {time}}, {select, put, call}) {
        const successRemind = yield localStorage.getItem('__alert_suppress_remind')
        const {operateAlertIds} = yield select( state => {
            return {
                'operateAlertIds':state.alertListTable.operateAlertIds
            }
        })
        if (operateAlertIds.length !== 0) {
            const suppressData = yield suppress({
                incidentIds: operateAlertIds,
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
        } else if(operateAlertIds.length === 0){
            yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
        }
      },
      // 打开解除告警modal
      *openRelieveModal({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const relieveAlert = yield select( state => state.alertListTable.selectedAlertIds)

          if (relieveAlert !== undefined && relieveAlert.length === 1) {
              yield put({
                  type: 'setRelieveAlert',
                  payload: relieveAlert[0] || {}
              })
              yield put({
                  type: 'toggleRelieveModal',
                  payload: true
              })
          } else {
              yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 2);
          }
      },
      // 打开解除告警modal(点击按钮的方式)
      *openRelieveModalByButton({payload}, {select, put, call}) {
          if (payload !== undefined) {
              yield put({
                  type: 'setRelieveAlert',
                  payload: payload || {}
              })
              yield put({
                  type: 'toggleRelieveModal',
                  payload: true
              })
          } else {
              console.error('relieve origin error')
          }
      },
      // 解除告警
      *relieveAlert({payload}, {select, put, call}) {
          const {relieveAlert, begin, end} = yield select( state => {
              return {
                  'relieveAlert': state.alertOperation.relieveAlert,
                  'begin': state.alertListTable.begin,
                  'end': state.alertListTable.end
              }
          })
          
          if (relieveAlert !== undefined && relieveAlert.id !== undefined) {
              let childResult = {}
              if (relieveAlert.childrenAlert === undefined) {
                  childResult = yield call(queryChild, {incidentId: relieveAlert.id, begin: begin, end: end})
              }
              const relieveResult = yield relieve({
                  parentId: relieveAlert.id
              })
              if (!relieveResult.result) {
                  yield message.error(window.__alert_appLocaleData.messages[relieveResult.message], 3);
              } else if (childResult.result !== undefined && !childResult.result) {
                  yield message.error(window.__alert_appLocaleData.messages[childResult.message], 3);
              } else {
                  yield put({ type: 'alertListTable/resetCheckedAlert'})
                  yield put({ type: 'alertListTable/relieveChildAlert', payload: {
                      childs: childResult.data === undefined ? relieveAlert.childrenAlert : childResult.data,
                      relieveId: relieveAlert.id
                  }})
                  yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
              }
          } else {
              console.error('relieveAlert error');
          }

          yield put({
            type: 'toggleRelieveModal',
            payload: false
          })
      },
      // 打开合并告警需要做的处理
      *openMergeModal({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const { mergeInfoList } = yield select( state => {
              return {
                  'mergeInfoList': state.alertListTable.selectedAlertIds,
              }
          })
          if (mergeInfoList !== undefined && mergeInfoList.length >= 2) {
              yield put({
                  type: 'setMergeInfoList',
                  payload: mergeInfoList
              })
              yield put({
                  type: 'toggleMergeModal',
                  payload: true
              })
          } else if (mergeInfoList.length < 2) {
              yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip3'], 3);
          } else {
              console.error('roll up incident error');
          }
      },
      // 合并告警
      *mergeAlert({payload}, {select, put, call}) {
          const { originAlert, mergeInfoList} = yield select( state => {
              return {
                  'originAlert': state.alertOperation.originAlert,
                  'mergeInfoList': state.alertOperation.mergeInfoList
              }
          })
          if (mergeInfoList !== undefined && mergeInfoList.length > 1) { // 合并告警数量少于2不允许合并的操作在页面就不允许删除，还需和交互讨论，暂时不做处理
              let filterList = yield mergeInfoList.filter( item => item.id != originAlert[0] )
              let filterListIds = yield filterList.map( item => item.id )
              const result = yield merge({
                  parentId: originAlert[0],
                  childs: filterListIds
              })
              if (result.result) {
                  yield put({ type: 'alertListTable/resetCheckedAlert'})
                  yield put({ type: 'alertListTable/mergeChildAlert', payload: { pId: originAlert[0], cItems: filterList, totalItems: mergeInfoList }})
                  yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
              } else {
                  yield message.error(window.__alert_appLocaleData.messages[result.message], 3);
              }
          } else {
              console.error('children incident error');
          }

          yield put({
            type: 'toggleMergeModal',
            payload: false
          })
      },
      // 打开派发工单做的相应处理
      *openFormModal({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const { operateAlertIds, selectedAlertIds } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
                  'selectedAlertIds': state.alertListTable.selectedAlertIds,
              }
          })
          yield put({
              type: 'alertList/toggleModalOrigin',
              payload: payload
          })
          if (payload !== undefined && payload === 'detail') {
              yield put({
                  type: 'alertDetailOperation/openFormModal'
              })
          } else {
            if (operateAlertIds.length === 0) {
                yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
            } else if (operateAlertIds.length > 1) {
                yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip4'], 3);
            } else if (selectedAlertIds.length === 1 && selectedAlertIds[0]['status'] != 0 ) { // 只能是新告警且不是子告警才能合并，子告警在该页面上没有checkbox所以不做判断
                yield message.error(window.__alert_appLocaleData.messages['modal.operate.allowRollUp'], 3);
            } else {
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
            }
          }
      },
      // 确定派发工单
      *dispatchForm({payload}, {select, put, call}) {
          const { selectedAlertIds} = yield select( state => {
              return {
                  'selectedAlertIds':state.alertListTable.selectedAlertIds
              }
          })
          if (selectedAlertIds.length === 1 && selectedAlertIds[0] !== undefined) {

            const data = yield call(dispatchForm, {
                id: selectedAlertIds[0]['id'],
                code: payload.id,
                name: payload.name
            })
            if(data.result){
                // window.open(data.data.url)
                // 显示工单modal
                yield put({ 
                    type: 'alertDetail/toggleTicketModal', 
                    payload: {
                        isShowTicketModal: true,
                        ticketUrl: data.data.url
                    }
                })

                yield put({ type: 'alertListTable/resetCheckedAlert'})
            }else{
                // 500 error
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
          const { alertOperateModalOrigin, operateAlertIds } = yield select( state => {
              return {
                  'alertOperateModalOrigin': state.alertList.alertOperateModalOrigin,
                  'operateAlertIds': state.alertListTable.operateAlertIds
              }
          })
          if (alertOperateModalOrigin === 'detail') {
              yield put({ type: 'alertDetailOperation/afterDispatch'})
          } else {
            let stingIds = operateAlertIds.map( item => '' + item)
            yield put({ type: 'alertListTable/changeCloseState', payload: {arrList: stingIds, status: 150}})
            yield put({ type: 'alertDetail/closeTicketModal'})
          }
      },
      *openCloseModal({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const { operateAlertIds } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
              }
          })
          yield put({
              type: 'alertList/toggleModalOrigin',
              payload: payload.origin
          })
          if (payload.origin !== undefined && payload.origin === 'detail') {
              yield put({type: 'alertDetailOperation/toggleCloseModal',payload: payload.state})
          } else {
            if (operateAlertIds.length === 0) {
                yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
            } else {
                yield put({type: 'toggleCloseModal', payload: payload.state})
            }
          }
      },
      // 关闭告警
      *closeAlert({payload}, {select, put, call}) {
          const { operateAlertIds } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
              }
          })
          if ( operateAlertIds !== undefined ) {
            let stingIds = operateAlertIds.map( item => '' + item)
            const resultData = yield close({
                incidentIds: stingIds,
                closeMessage: payload
            })
            if (resultData.result) {
                if (resultData.data.result) {
                    yield put({ type: 'alertListTable/resetCheckedAlert'})
                    yield put({ type: 'alertListTable/changeCloseState', payload: {arrList: stingIds, status: 255}})
                    yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                } else {
                    yield message.error(`${resultData.data.failures}`, 3);
                }
            } else {
                yield message.error(window.__alert_appLocaleData.messages[resultData.message], 3);
            }
          } else {
              console.error('operateAlertIds error');
          }

          yield put({
            type: 'toggleCloseModal',
            payload: false
          })
      },
      // 打开解决告警
      *openResolveModal({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const { operateAlertIds } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
              }
          })
          yield put({
              type: 'alertList/toggleModalOrigin',
              payload: payload.origin
          })
          if (payload.origin !== undefined && payload.origin === 'detail') {
              yield put({type: 'alertDetailOperation/toggleResolveModal',payload: payload.state})
          } else {
            if (operateAlertIds.length === 0) {
                yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
            } else {
                yield put({type: 'toggleResolveModal', payload: payload.state})
            }
          }
      },
      // 解决告警
      *resolveAlert({payload}, {select, put, call}) {
          const { operateAlertIds } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
              }
          })
          if ( operateAlertIds !== undefined ) {
            let stingIds = operateAlertIds.map( item => '' + item)
            const resultData = yield resolve({
                incidentIds: stingIds,
                resolveMessage: payload
            })
            if (resultData.result) {
                if (resultData.data.result) {
                    yield put({ type: 'alertListTable/resetCheckedAlert'})
                    yield put({ type: 'alertListTable/changeCloseState', payload: {arrList: stingIds, status: 190}})
                    yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
                } else {
                    yield message.error(`${resultData.data.failures}`, 3);
                }
            } else {
                yield message.error(window.__alert_appLocaleData.messages[resultData.message], 3);
            }
          } else {
              console.error('operateAlertIds error');
          }

          yield put({
            type: 'toggleResolveModal',
            payload: false
          })
      },
      // 打开分享到ChatOps的modal
      *openChatOps({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const { operateAlertIds } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
              }
          })
          yield put({
              type: 'alertList/toggleModalOrigin',
              payload: payload
          })
          if (payload !== undefined && payload === 'detail') {
              yield put({
                  type: 'alertDetailOperation/openChatOps'
              })
          } else {
            if (operateAlertIds.length === 0) {
                yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip1'], 3);
            } else if (operateAlertIds.length > 1) {
                yield message.error(window.__alert_appLocaleData.messages['modal.operate.infoTip2'], 3);
            } else {
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
            }
          }
      },
      *shareChatOps({payload}, {select, put, call}) {
            const {selectedAlertIds} = yield select( state => {
                return {
                    'selectedAlertIds':state.alertListTable.selectedAlertIds
                }
            })
            if (selectedAlertIds.length === 1 && selectedAlertIds[0] !== undefined) {
                delete selectedAlertIds[0]['timeLine']
                let roomId = payload.id;
                let incidentId = selectedAlertIds[0]['id'];
                let roomName = payload.roomName
                const shareResult = yield shareRoom(roomId, incidentId, roomName, {
                    body: {
                        type: 'alert',
                        data: {
                            ...selectedAlertIds[0],
                            severityDesc: window['_severity'][selectedAlertIds[0]['severity']],
                            status: window['_status'][selectedAlertIds[0]['status']]
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
              type: 'alertListTable/setGroup',
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
              type: 'alertListTable/setGroup',
              payload: {
                  isGroup: false,
              }
          })
      },
      // 列定制
      *checkColumn({payload}, {select, put, call}) {
          yield put({ type: 'setColumn', payload: payload })
          yield put({ type: 'filterColumn' })
          const selectColumn = yield select(state => state.alertOperation.selectColumn)
          yield put({ type: 'alertListTable/customCols', payload: selectColumn})
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
            newList[1] = extend;
        }
        return { ...state, columnList: newList, extendColumnList: extend.cols, extendTagsKey: tags }
      },
      // show more时需要叠加columns
      addProperties(state, {payload: {properties, tags}}) {
          const { columnList, extendTagsKey } = state;
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
                    if (col.id == 'source' || col.id == 'lastTime' || col.id == 'lastOccurTime' || col.id == 'count') {
                        arr.push({ key: col.id, title: col.name, order: true }) // order字段先定死
                    } else {
                        arr.push({ key: col.id, title: col.name })
                    }
                }
                return col;
            })
            return group;
        })
        
        return { ...state, columnList: newList, selectColumn: arr }
      },
      // 设置合并子列表
      setMergeInfoList(state, { payload }) {
          return { ...state, mergeInfoList: payload }
      },
      // 设置要被解除的告警
      setRelieveAlert(state, { payload: relieveAlert }) {
          return { ...state, relieveAlert }
      },
      // 设置chatOps群组
      setChatOpsRoom(state, { payload }) {
          return { ...state, chatOpsRooms: payload }
      },
      // 设置工单类型
      setFormOptions(state, { payload }) {
          return { ...state, formOptions: payload }
      },
      // 设置分组显示的类型
      setGroupType(state, {payload: selectGroup}) {
          return { ...state, selectGroup, isGroup: true }
      },
      // 移除分组显示的类型
      removeGroupType(state) {
          return { ...state, selectGroup: initalState.selectGroup, isGroup: false }
      },
      // 转换modal状态
      toggleFormModal(state, {payload: isShowFormModal}) {
          return { ...state, isShowFormModal }
      },
      toggleChatOpsModal(state, {payload: isShowChatOpsModal}) {
          return { ...state, isShowChatOpsModal}
      },
      toggleCloseModal(state, {payload: isShowCloseModal}) {
          return { ...state, isShowCloseModal }
      },
      toggleMergeModal(state, {payload: isShowMergeModal}) {
          return { ...state, isShowMergeModal }
      },
      toggleRelieveModal(state, {payload: isShowRelieveModal}) {
          return { ...state, isShowRelieveModal }
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
      // selectRows是合并告警时触发
      selectRows(state, {payload: originAlert}) {
          return { ...state, originAlert }
      },
      // remove告警
      removeAlert(state, {payload}) {
          const { mergeInfoList } = state;
          const newList = mergeInfoList.filter( (item) => (item.id !== payload) )
          return { ...state, mergeInfoList: newList}
      }
  }
}
