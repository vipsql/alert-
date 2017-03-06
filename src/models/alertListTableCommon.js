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
    

  },
  effects: {
    
  },


}
