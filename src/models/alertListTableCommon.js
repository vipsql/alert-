
export default {
  namespace: 'alertListTableCommon',
  state: {
    isGroup: false,
    groupBy: 'source',
    selectedAlertIds: [], //选中的告警(合并告警)
    operateAlertIds: [], //选中的告警(派发 关闭)
    isShowMore: false,
    orderBy: 'source',
    orderType: 0,
    pageSize: 50,
    currentPage: 1,
    begin: 0,
    end: 0,
    viewDetailAlertId: false // 查看详细告警ID
  },
  subscriptions: {
    setup({dispatch}) {


    }
  },
  reducers: {
    // 更新分组字段
    updateGroup(state,{payload: isGroup}){
      return {
        ...state,
        isGroup
      }
    },
    // 更新显示更多字段
    updateShowMore(state,{payload: isShowMore}){
      return {
        ...state,
        isShowMore
      }
    },
    // 
    toggleDetailAlertId(state, {payload: viewDetailAlertId}) {
      return { ...state, viewDetailAlertId }
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
    }
  },


}
