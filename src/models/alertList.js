import { queryAlertBar } from '../services/alertList'
import {parse} from 'qs'

export default {
  namespace: 'alertList',
  state: {
    isRefresh: false, //是否实时更新
    alertOperateModalOrigin: undefined, // 这个状态是用来区别那个Modal打开的 --> 对应position
    tagsFilter: {
      "severity":"紧急,次要"
    },
    barData:[], // 最近4小时告警数据
    begin: 0, //告警开始时间(时间线)
    end: 0,  //告警结束时间(时间线)
    levels: { //告警级别
      jj: {
        number: 22,
        state: true,
      },
      gj: {
        number: 33,
        state: true,
      },
      tx: {
        number: 44,
        state: true,
      },
      zy: {
        number: 55,
        state: true,
      },
      cy: {
        number: 66,
        state: true,
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
        const barData = data.data
        const endtTime = barData[barData.length - 1]['time']
        const startTime = endtTime - 3600000

        // 更新柱状图数据
        yield put({
          type: 'updateAlerBarData',
          payload: {
            barData:data.data
          }

        })

        // 发起查询列表请求
        yield put({
          type: 'alertListTable/queryAlertList',
          payload: {
            begin: startTime,
            end: endtTime,
            isGroup: false,
            group: 'severity'
          }
        })

        // 预加载告警列表时间线数据
        yield put({
          type: 'alertListTimeTable/queryAlertListTime',
          payload: {
            begin: startTime,
            end: endtTime,
            isGroup: false
          }
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
    updateAlerBarData(state,{payload: {barData,begin,end}}){
      return {
        ...state,
        barData,
        begin,
        end
      }
    },
    // 转换icon状态
    toggleLevelState(state, {payload: type}) {
      if (type !== undefined && state.levels[type] !== undefined && Object.keys(state.levels).includes(type)) {
        state.levels[type].state = !(state.levels[type].state);
      }
      return { ...state }
    },
    // 转换modal的来源
    toggleModalOrigin(state, {payload: alertOperateModalOrigin}) {
      return { ...state, alertOperateModalOrigin }
    }
  },


}
