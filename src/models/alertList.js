// import {login, userInfo, logout} from '../services/alertManage'
import {parse} from 'qs'

export default {
  namespace: 'alertList',
  state: {
    isRefresh: false, //是否实时更新
    tagsFilter: [
      {jb: [1,2,3]}
    ],
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
  effects: {
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
    // 转换icon状态
    toggleLevelState(state, {payload: type}) {
      if (type !== undefined && state.levels[type] !== undefined && Object.keys(state.levels).includes(type)) {
        state.levels[type].state = !(state.levels[type].state);
      }
      return { ...state }
    }
  },


}
