import {queryAlertManage} from '../services/alertManage'
import {parse} from 'qs'

const initialState = {
    isSetAlert: false, // 是否设置过告警标签
    hideAlertSetTip: false, // 设置提示false有提示
    modalVisible: false,
    currentDashbordData: [],
    tagsNum: 0,
    tagsList: [
      {
        name:'告警来源',
        tags: [
          {
            name: "cmdb",
            selected: true
          },
          {
            name: "apm",
            selected: false
          },
          {
            name: "zabbx",
            selected: false
          }
        ]
      }
    ],
    levels: { //告警级别
      jj: 23,
      gj: 33,
      tx: 44,
      zy: 30,
      cy: 11
    }
}

export default {
  namespace: 'alertManage',

  state: initialState,

  subscriptions: {
    
  },

  effects: {
    
  },

  reducers: {
    // 显示标签设置
    toggleAlertSet(state, { payload: isSetAlert }){
      return { ...state, isSetAlert }
    },
    // 显示treemap
    setCurrentTreemap(state, { payload }){
      return { ...state, ...payload }
    },
    // 隐藏标签设置提示
    toggleAlertSetTip(state, { payload: hideAlertSetTip }){
      return { ...state, hideAlertSetTip }
    },
  }

}
