import {parse} from 'qs'
import { queryDetail } from '../services/alertDetail'
import { queryCloumns } from '../services/alertQuery'
import { getFormOptions, dispatchForm, close, merge, relieve, getChatOpsOptions, shareRoom } from '../services/alertOperation'
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
    closeMessage: undefined,
    isDropdownSpread: false, // 是否展开关闭modal的dropdown

    isShowTicketModal: false, //派发工单框
    ticketUrl: '', //工单链接
    ciUrl: '', //ci信息的链接

    selectColumn: [], // 选择的列
    extendColumnList: [], //扩展字段
    columnList: [
        {
            type: 0, // id 
            cols: [
                {id: 'entityName', checked: true,},
                {id: 'name', checked: false,},
                {id: 'source', checked: false,},
                {id: 'status', checked: true,},
                {id: 'description', checked: false,},
                {id: 'count', checked: false,},
                {id: 'lastTime', checked: false,},
                {id: 'lastOccurTime', checked: false,}
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
                code: payload
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
    // 打开关闭工单
    *openCloseModal({payload}, {select, put, call}) {
        yield put({type: 'setCloseMessge', payload: undefined})
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
          if (detailResult.data.orderFlowNum) {
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
                yield put({ type: 'alertQuery/changeCloseState', payload: [stringId]})
                yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3);
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
    // 列定制初始化(将数据变为设定的结构)
    *initalColumn({payload}, {select, put, call}) {
        // 这里后期要先做查询得到扩展字段，再和columnList拼接
        const { columns } = yield select( state => {
            return {
                'columns': state.alertQuery.columns
            }
        })
        const columnResult = yield call(queryCloumns)
        if (!columnResult.result) {
            yield message.error(window.__alert_appLocaleData.messages[columnResult.message], 2);
        }
        yield put({ type: 'initColumn', payload: {baseCols: columns, extend: columnResult.data || {}}})
        
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
    initColumn(state, {payload: {baseCols, extend}}) {
        const { columnList } = state;
        let newList = columnList;
        let haveExtend = false;
        baseCols.forEach( (column, index) => {
            newList.forEach( (group) => {
                if (group.type == 1) {
                    haveExtend = true;
                }
                group.cols.forEach( (col) => {
                  if (column.key === col.id) {
                      col.checked = true;
                  }
                }) 
            })
        })
        if (Object.keys(extend.cols).length !== 0 && !haveExtend) {
            extend.cols.forEach( (col) => {
                col.checked = false;
            })
            newList.push(extend)
        }
        return { ...state, columnList: newList, extendColumnList: extend.cols }
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
      return { ...state, currentAlertDetail }
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
    setCloseMessge(state, { payload: closeMessage}) {
        return { ...state, closeMessage }
    },
    // 是否展开dropdown - closemodal
    toggleDropdown(state, { payload: isDropdownSpread }) {
        return { ...state, isDropdownSpread }
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
            isShowTicketModal: false
        }
    }
  },

}
