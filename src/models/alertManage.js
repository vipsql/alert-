import { queryDashbord } from '../services/alertManage'
import { isSetUserTags } from '../services/alertTags.js'
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
      if(isSet) {
        yield put({
          type: 'alertTagsSet/queryDashbordBySetted',
          payload: userId
        })
        yield put({
          type: 'toggleAlertSetTip',
          payload: true
        })
      } else {
        yield put({
          type: 'toggleAlertSet',
          payload: false
        })
      }
    }, 
    *queryAlertDashbord({payload}, {call, put, select}) {
      if(!payload){
        payload = {
          tagIds: yield select( state => {
            return state.alertTagsSet.commitTagIds
          })
        }
        
      }
      const treemapData = yield queryDashbord(payload)
  
      if (typeof treemapData !== 'undefined') {
        yield put({
          type: 'setCurrentTreemap',
          payload: {
            currentDashbordData: treemapData && treemapData.picList || [],
            isLoading: false
          }
        })

        yield put({
          type: 'setLevels',
          payload: {
            levels: {
              totalOkCnt: treemapData.totalOkCnt, // 恢复
              totalCriticalCnt: treemapData.totalCriticalCnt, // 紧急
              totalWarnCnt: treemapData.totalWarnCnt, // 警告
              totalInfoCnt: treemapData.totalInfoCnt // 提醒
            }
          }
        })

      } else {
        console.error(treemapData.message);
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
