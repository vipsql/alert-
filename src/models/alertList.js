import { queryAlertBar } from '../services/alertList'
import { parse } from 'qs'

export default {
  namespace: 'alertList',
  state: {
    isRefresh: false, //是否实时更新
    alertOperateModalOrigin: undefined, // 这个状态是用来区别那个Modal打开的 --> 对应position
    isLoading: false, // alertBar加载
    isResize: false, //是否折叠
    isShowBar: true, // 是否显示时间段柱状图
    barData: [], // 最近4小时告警数据
    begin: 0, //告警开始时间(时间线)
    end: 0,  //告警结束时间(时间线)
    selectedTime: '',
  },
  subscriptions: {

  },
  effects: {
    // 查询柱状图
    *queryAlertBar({ payload }, { call, put, select }) {

      let { selectedTime } = yield select(state => {
        return {
          'selectedTime': state.alertList.selectedTime
        }
      })

      if (payload !== undefined && payload.selectedTime !== undefined) {
        selectedTime = payload.selectedTime;
        delete payload.selectedTime
      }

      yield put({ type: 'toggleAlertBarLoading', payload: true })

      const data = yield call(queryAlertBar, {
        ...payload,
        type: selectedTime
      })

      if (data.result) {
        let barData = data.data
        let endtTime = barData[barData.length - 1]['time']
        let startTime = barData[0]['time'] - (barData[0]['granularity'] || 0)

        // 更新柱状图数据
        yield put({
          type: 'updateAlerBarData',
          payload: {
            barData: data.data,
            begin: startTime,
            end: endtTime,
            selectedTime: selectedTime,
            isLoading: false
          }
        })

        // 将公用数据放入commonList
        yield put({
          type: 'alertListTable/setInitvalScope',
          payload: {
            begin: startTime,
            end: endtTime,
            isGroup: false,
            tagsFilter: payload,
            selectedAlertIds: [],
            operateAlertIds: [],
            selectedAll: false
          }
        })

        // yield put({
        //   type: 'setInitialExceptPayload',
        //   payload: {
        //   }
        // })

        // 发起查询列表请求
        yield put({
          type: 'alertListTable/queryAlertList',
        })

        yield put({ type: 'alertOperation/removeGroupType' })

      }

    },
    // 滑动时间条触发
    *editAlertBar({ payload }, { call, put, select }) {
      // 将公用数据放入commonList
      yield put({
        type: 'alertListTable/setInitvalScope',
        payload: {
          begin: payload.begin,
          end: payload.end,
          currentPage: 1,
          isGroup: false,
          orderBy: undefined,
          orderType: undefined,
        }
      })

      // 发起查询列表请求
      yield put({
        type: 'alertListTable/queryAlertList',
      })

      yield put({ type: 'alertOperation/removeGroupType' })

    }

  },
  reducers: {
    updateAlerBarData(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    updateResize(state, { payload: isResize }) {
      return {
        ...state,
        isResize
      }
    },
    // 转换modal的来源
    toggleModalOrigin(state, { payload: alertOperateModalOrigin }) {
      return { ...state, alertOperateModalOrigin }
    },
    toggleAlertBarLoading(state, { payload: isLoading }) {
      return { ...state, isLoading }
    },
    // 显示或隐藏时间段柱状统计图
    toggleBar(state, { payload: isShowBar }) {
      return { ...state, isShowBar }
    },
  },


}
