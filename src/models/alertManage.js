import {queryAlertDashbord} from '../services/alertManage'
import {parse} from 'qs'

export default {
  namespace: 'alertManage',
  state: {
    isSetAlert: false, // 是否设置过告警标签
    hideAlertSetTip: false, // 设置提示
    modalVisible: false,
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
      tx: 44
    }
  },
  subscriptions: {
    setup({dispatch}){
      dispatch({
        type: 'queryAlertDashbord'
      })
    }
  },
  reducers: {
    // 显示标签设置
    showAlertSet(state){
      return {
        ...state,
        isSetAlert: false
      }
    },
    // 显示treemap
    showAlertDashbord(state){
      return {
        ...state,
        isSetAlert: true,
        hideAlertSetTip: true
      }
    },
    // 隐藏标签设置提示
    hideAlertSetTip(state){
      return {
        ...state,
        hideAlertSetTip: true
      }
    },
    // 显示标签设置框
    showTagsModal(state){
      return {
        ...state,
        modalVisible: true
      }
    },
    // 标签选择
    changSelectTag(state){

    },
    // 关闭标签设置框
    closeTagsModal(state){
      return {
        ...state,
        modalVisible: false
      }
    }



  },
  effects: {
    *queryAlertDashbord ({
      payload
    }, {put, call}) {
      const data = yield call(queryAlertDashbord, parse(payload))
      if(data.isSet){
        yield put({
          type: 'showAlertDashbord',
        })
      }else{
        yield put({
          type: 'showAlertSet',
        })
      }
    }
  }


}
