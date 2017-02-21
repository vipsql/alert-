import { queryDashbord } from '../services/alertManage'
import { isSetUserTags } from '../services/alertTags.js'
import {parse} from 'qs'

const initialState = {
    isSetAlert: false, // 是否设置过告警标签
    hideAlertSetTip: false, // 设置提示false有提示
    modalVisible: false,
    currentDashbordData: [],
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
    alertManageSetup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/alertManage') {
          dispatch({
            type: 'queryAlertDashbord'
          })
        }
      })
    }
  },

  effects: {
    *alertManageSetup({payload}, {put, call, select}) {

      const { userId } = yield select( state => {
        return {
          'userId': state.app.userId,
        }
      })

      const tagSet = yield isSetUserTags(userId)
      if(tagSet.data.isSet) {
        yield put({
          type: 'alertTagsSet/queryDashbordBySetted',
          payload: userId
        })
        // yield put({
        //   type: 'app/showMask',
        //   payload: false
        // })
        // yield put({
        //   type: 'toggleAlertSetTip',
        //   payload: true
        // })
      } else {
        yield put({
          type: 'app/showMask',
          payload: true
        })
        yield put({
          type: 'toggleAlertSet',
          payload: false
        })
      }
    },
    *queryAlertDashbord({payload}, {put, call, select}) {
      const pays = yield select( state => {
        return state.alertManage.levels
      })
      const treemapData = yield call(queryDashbord,pays)
     
      if (typeof treemapData.data !== 'undefined') {
        yield put({
          type: 'setCurrentTreemap',
          payload: treemapData.data || treemapData.data.picList || []
        })

        yield put({
          type: 'setLevels',
          payload: {
            levels: {
              totalMinorCnt: treemapData.data.totalMinorCnt, // 次要
              totalCriticalCnt: treemapData.data.totalCriticalCnt, // 紧急
              totalWarnCnt: treemapData.data.totalWarnCnt, // 告警
              totalMajorCnt: treemapData.data.totalMajorCnt, // 主要
              totalInfoCnt: treemapData.data.totalInfoCnt // 提醒
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
    setCurrentTreemap(state, { payload: currentDashbordData }){
      return { ...state, currentDashbordData }
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
