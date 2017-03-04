import { queryAlertList, queryAlertListTime } from '../services/alertList'

const initvalState = {
    isGroup: false,
    groupBy: 'source',

    selectedAlertIds: [], //选中的告警(合并告警)
    operateAlertIds: [], //选中的告警(派发 关闭)
    viewDetailAlertId: false, // 查看详细告警ID

    isShowMore: false,

    orderBy: 'source',
    orderType: 0,
    pageSize: 20,
    currentPage: 1,

    begin: 0,
    end: 0,

    tagsFilter: {}, // 过滤标签

    checkAlert: {}, //此对象将alertId作为属性，用来过滤checked的alert
}

export default {
  namespace: 'alertListTableCommon',

  state: initvalState,

  subscriptions: {
    setup({dispatch}) {


    }
  },
  reducers: {
    // 更新分组字段
    updateGroup(state,{ payload }){
      return {
        ...state,
        ...payload
      }
    },
    // 更新显示更多字段
    updateShowMore(state,{payload: isShowMore}){
      return {
        ...state,
        isShowMore
      }
    },
    // 点击查看更多
    setMore(state, { payload: currentPage }){

      return {
        ...state,
        currentPage
      }
    },
    // 注入通用状态
    setInitvalScope(state, { payload }) {
      return { ...state, ...payload }
    },
    // 设置viewDetailAlertId
    toggleDetailAlertId(state, {payload: viewDetailAlertId}) {
      return { ...state, viewDetailAlertId }
    },
    // 初始化
    clear(state) {
      return { ...state, ...initvalState }
    },
    // 初始化checkAlerts
    initCheckAlert(state, { payload }) {
      let checkList = {};
      payload.forEach( (item, index) => {
        checkList[`${item.id}`] = {
          info: item,
          checked: false
        }
      })
      return { ...state, checkAlert: checkList }
    },
    // 初始化checkAlerts分组的
    initCheckAlertToGroup(state, { payload }) {
      let checkList = {};
      payload.forEach( (group, index) => {
        group.children.forEach( (item) => {
          checkList[`${item.id}`] = {
            info: item,
            checked: false
          }
        })
      })
      return { ...state, checkAlert: checkList }
    },
    // 记录下原先checked数据
    resetCheckAlert(state, { payload: { origin, newObj } }) {
      let ids = Object.keys(origin);
      let checkList = {};
      newObj.forEach( (item, index) => {
        checkList[`${item.id}`] = {
          info: item,
          checked: false
        }
        ids.forEach( (id) => {
          if (item.id == id && origin[id].checked) {
            checkList[`${item.id}`] = {
              info: item,
              checked: true
            }
          }
        })
      })
      return { ...state, checkAlert: checkList }
    },
    // 重置勾选状态
    resetCheckedAlert(state) {
      const { checkAlert } = state;
      let ids = Object.keys(checkAlert);
      ids.forEach( (id) => {
        checkAlert[id].checked = false
      })
      return { ...state, checkAlert: checkAlert }
    },
    // 更改勾选状态
    changeCheckAlert(state, { payload: alertInfo }) {
      const { checkAlert } = state;
      if (checkAlert[alertInfo.id] !== undefined) {
        checkAlert[alertInfo.id].checked = !checkAlert[alertInfo.id].checked
        return { ...state, checkAlert: checkAlert }
      } else {
        return { ...state }
      }
    },
    // 在点击操作时进行过滤处理
    filterCheckAlert(state) {
      const { checkAlert } = state;
      let operateAlertIds = [], selectedAlertIds = [];
      let keyArr = Object.keys(checkAlert) || [];
      keyArr.forEach( (id) => {
        if (checkAlert[id].checked) {
          operateAlertIds.push(id);
          selectedAlertIds.push(checkAlert[id].info)
        }
      })
      return { ...state, operateAlertIds: operateAlertIds, selectedAlertIds: selectedAlertIds }
    }

  },
  effects: {
    // 点击分组时触发
    *setGroup({payload}, {select, put, call}) {
      if (payload.isGroup) {
        yield put({ type: 'updateGroup', payload: { isGroup: payload.isGroup, groupBy: payload.group }})
        yield put({ type: 'alertListTable/queryAlertList' })
        //yield put({ type: 'alertListTimeTable/queryAlertListTime', payload: { isGroup: payload.isGroup, groupBy: payload.group } })
        yield 
      } else {
        yield put({ type: 'updateGroup', payload: { isGroup: payload.isGroup }})
        yield put({ type: 'alertListTable/queryAlertList' })
        //yield put({ type: 'alertListTimeTable/queryAlertListTime', payload: { isGroup: payload.isGroup } })
      }
    },
    // 点击展开详情
    *clickDetail({payload}, {select, put, call}) {
      yield put({ type: 'toggleDetailAlertId', payload: payload })
      yield put({ type: 'alertDetail/openDetailModal'})
    },
    // show more
    *loadMore({}, {call, put, select}){
      
      let { currentPage, listData, timeData, alertListTableCommon }=  yield select(state => {
         return {
           'currentPage': state.alertListTableCommon.currentPage,
           'listData': state.alertListTable.data,
           'timeData': state.alertListTimeTable.data,
           'alertListTableCommon': state.alertListTableCommon
         }
      })

      currentPage =  currentPage + 1
      const params = {
        currentPage: currentPage,
        begin: alertListTableCommon.begin,
        end: alertListTableCommon.end,
        orderBy: alertListTableCommon.orderBy,
        orderType: alertListTableCommon.orderType,
        pageSize: alertListTableCommon.pageSize,
        ...alertListTableCommon.tagsFilter
      }

      const listReturnData = yield call(queryAlertList, params)
      const timeReturnData = yield call(queryAlertListTime, params)

      if (listReturnData.result && timeReturnData.result) {

        listData = listData.concat(listReturnData.data.datas);
        timeData = timeData.concat(timeReturnData.data.datas);
        yield put({
          type: 'resetCheckAlert',
          payload: {
            origin: alertListTableCommon.checkAlert,
            newObj: listData
          }
        })
        if (!listReturnData.data.hasNext && !timeReturnData.data.hasNext) {
          yield put({
            type: 'updateShowMore',
            payload: listReturnData.data.hasNext
          })
        }

        yield put({
          type: 'alertListTable/updateAlertListData',
          payload: listData
        })
        yield put({
          type: 'alertListTimeTable/updateAlertListTimeData',
          payload: timeData
        })

        yield put({ type: 'setMore', payload: currentPage })
      } else {
        console.error('显示更多查询有错误');
      }
      
    }
  },


}
