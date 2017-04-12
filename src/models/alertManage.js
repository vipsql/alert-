import { queryDashbord } from '../services/alertManage'
import { isSetUserTags } from '../services/alertTags.js'
import { message } from 'antd'
import {parse} from 'qs'

const initialState = {
    isSetAlert: false, // 是否设置过告警标签
    hideAlertSetTip: false, // 设置提示false有提示
    modalVisible: false,
    currentDashbordData: undefined,
    isLoading: true, //加载
    levels: { }
}

export default {
  namespace: 'alertManage',

  state: initialState,

  subscriptions: {
    alertManageSetup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/alertManage' || location.pathname === '/') {
          dispatch({
            type: 'alertManageSetup'
          })
        }
      })
    }
  },

  effects: {
    *alertManageSetup({payload}, {put, call, select}) {

      const isSet = yield isSetUserTags()
      if(isSet.result && isSet.data) {
        yield put({
          type: 'alertTagsSet/queryDashbordBySetted',
        })
        yield put({
          type: 'toggleAlertSetTip',
          payload: true
        })
      } else {
        yield put({
          type: 'toggleAlertSetTip',
          payload: false
        })
        yield put({
          type: 'toggleAlertSet',
          payload: false
        })
      }
    }, 
    *queryAlertDashbord({}, {call, put, select}) {
      
      const treemapData = yield queryDashbord()

      if (treemapData.result) {
        let filterDate = [];
        if (treemapData.data && treemapData.data.picList && treemapData.data.picList.length !== 0) {
          filterDate = yield treemapData.data.picList.filter( item => item['path'] != 'status' )
        }

        yield put({
          type: 'setCurrentTreemap',
          payload: {
            currentDashbordData: filterDate || [],
            isLoading: false
          }
        })

        yield put({
          type: 'setLevels',
          payload: {
            levels: {
              totalOkCnt: treemapData.data.totalOkCnt, // 恢复
              totalCriticalCnt: treemapData.data.totalCriticalCnt, // 紧急
              totalWarnCnt: treemapData.data.totalWarnCnt, // 警告
              totalInfoCnt: treemapData.data.totalInfoCnt // 提醒
            }
          }
        })

      } else {
        yield message.error(window.__alert_appLocaleData.messages[treemapData.message], 2)
      }
    }
  },

  reducers: {
    // 显示标签设置
    toggleAlertSet(state, { payload: isSetAlert }){
      return { ...state, isSetAlert }
    },
    // 显示treemap
    setCurrentTreemap(state, { payload: {currentDashbordData,isLoading} }){
      return { ...state, currentDashbordData, isLoading}
    },
    // 设置告警状态
    setLevels(state, {payload}) {
      return { ...state, ...payload }
    },
    // 隐藏标签设置提示
    toggleAlertSetTip(state, { payload: hideAlertSetTip }){
      return { ...state, hideAlertSetTip }
    },
  }

}
