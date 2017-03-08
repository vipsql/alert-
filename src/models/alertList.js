import { queryAlertBar } from '../services/alertList'
import {parse} from 'qs'

export default {
  namespace: 'alertList',
  state: {
    isRefresh: false, //是否实时更新
    alertOperateModalOrigin: undefined, // 这个状态是用来区别那个Modal打开的 --> 对应position

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

    }
  },
  effects: {
    // 查询柱状图
    *queryAlertBar({payload}, {call, put, select}) {
      // 触发这个effect的时机是在刷新/tag转变的时候（不保存状态--所以需要初始化commonList）
      yield put({ type: 'alertListTable/clear' })

      const data = yield call(queryAlertBar, payload)

      if(data.result){
        const barData = data.data
        const endtTime = barData[barData.length - 1]['time']
        const startTime = endtTime - 3600000

        // 将公用数据放入commonList
        yield put({
          type: 'alertListTable/setInitvalScope',
          payload: {
            begin: startTime,
            end: endtTime,
            isGroup: false,
            tagsFilter: payload
          }
        })

        // 更新柱状图数据
        yield put({
          type: 'updateAlerBarData',
          payload: {
            barData: data.data,
            begin: startTime,
            end: endtTime
          }
        })

        // 发起查询列表请求
        yield put({
          type: 'alertListTable/queryAlertList',
        })

      }

    },
    // 滑动时间条触发
    *editAlertBar({payload}, {call, put, select}) {
      // 将公用数据放入commonList
      yield put({
        type: 'alertListTable/setInitvalScope',
        payload: {
          begin: payload.begin,
          end: payload.end,
          currentPage: 1,
          orderBy: undefined,
          orderType: undefined,
        }
      })
      
      // 发起查询列表请求
      yield put({
        type: 'alertListTable/queryAlertList',
      })

    },
    *editLevel() {

    }

  },
  reducers: {
    updateAlerBarData(state,{ payload }){
      return {
        ...state,
        ...payload
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
