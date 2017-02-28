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
    }

  },
  effects: {
    // 更新选中告警状态
    *updateCheckAlert({payload: alertInfo}, {select}){

      let {selectedAlertIds, operateAlertIds }= yield select( state => {
        const alertListTableCommon = state.alertListTableCommon

        return {
          selectedAlertIds: alertListTableCommon.selectedAlertIds,
          operateAlertIds: alertListTableCommon.operateAlertIds
        }
      })

      const { id } = alertInfo

      operateAlertIds.push(id)
      selectedAlertIds.push(alertInfo)
    },
    // 点击分组时触发
    *setGroup({payload}, {select, put, call}) {
      if (payload.isGroup) {
        yield put({ type: 'updateGroup', payload: { isGroup: payload.isGroup, groupBy: payload.group }})
        yield put({ type: 'alertListTable/queryAlertList' })
        yield put({ type: 'alertListTimeTable/queryAlertListTime' })
        yield 
      } else {
        yield put({ type: 'updateGroup', payload: { isGroup: payload.isGroup }})
        yield put({ type: 'alertListTable/queryAlertList' })
        yield put({ type: 'alertListTimeTable/queryAlertListTime' })
      }
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

        if (!listReturnData.data.hasNext && !timeReturnData.data.hasNext) {
          yield put({
            type: 'updateShowMore',
            payload: listReturnData.data.hasNext
          })
        }

        listData = listData.concat(listReturnData.data.datas);
        timeData = timeData.concat(timeReturnData.data.datas);

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
