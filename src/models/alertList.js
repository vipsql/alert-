import { queryAlertBar } from '../services/alertList'
import {parse} from 'qs'

export default {
  namespace: 'alertList',
  state: {
    isRefresh: false, //是否实时更新
    tagsFilter: {
      "severity":"紧急,次要",
      "name":"温度超标事件"
    },
    barData:[], // 最近4小时告警数据
    levels: { //告警级别
      jj: {
        number: 22,
        state: false,
      },
      gj: {
        number: 33,
        state: false,
      },
      tx: {
        number: 44,
        state: false,
      },
      zy: {
        number: 55,
        state: false,
      },
      cy: {
        number: 66,
        state: false,
      }
    }

  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({
        type: 'queryAlertBar'
      })
    }
  },
  effects: {
    // 查询柱状图
    *queryAlertBar({}, {call, put, select}) {
      const payload = yield select(state => {
        return state.alertList.tagsFilter
      })
      
      const data = yield call(queryAlertBar, payload)

      if(data.result){
        yield put({
          type: 'updateAlerBarData',
          payload: data.data
        })
      }

    },
    *editLevel() {

    }

  },
  reducers: {
    showLoading(state){
      return {...state, loading: true}
    },
    initAlertList(state, action) {
      return { ...state, ...action.payload, loading: false}
    },
    updateAlerBarData(state,{payload: barData}){
      return {
        ...state,
        barData
      }
    },
    // 转换icon状态
    toggleLevelState(state, {payload: type}) {
      if (type !== undefined && state.levels[type] !== undefined && Object.keys(state.levels).includes(type)) {
        state.levels[type].state = !(state.levels[type].state);
      }
      return { ...state }
    }
  },


}
