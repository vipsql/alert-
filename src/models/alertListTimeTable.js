import { queryAlertListTime } from '../services/alertList'
import {parse} from 'qs'

export default {
  namespace: 'alertListTimeTable',
  state: {
    gridWidth: 100,
    isGroup: false,
    minuteToWidth: 5, //以分钟单位计算间隔
    startTime: 1487031735817,
    endTime: 1487035335817,
    isShowMore: true, // 是否显示更多
    curPage: 1, //当前页
    data: []
  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({
        type: 'queryAlertListTime',
        payload: {
          curPage: 1
        }
      })
    }
  },
  reducers: {
    setTimeLineWidth(state,{payload: {gridWidth,minuteToWidth}}){
      return{
        ...state,
        gridWidth,
        minuteToWidth
      }
    },

    showListTime(state, {payload: data} ){
      return {
        ...state,
        data
      }
    },
    loadMore(state, {payload: {data, curPage}}){

      return {
        ...state,
        data,
        curPage
      }
    }
  },
  effects: {
    *queryAlertListTime({ payload }, {call, put, select}){
      const data = yield call(queryAlertListTime, parse(payload))
      if(data.length > 0){
        yield put({
          type: 'showListTime',
          payload: data
        })
      }
    },
    *showMore({}, {call, put, select}){
      let { curPage, data }=  yield select(state => {
         return state.alertListTimeTable
      })
      curPage =  curPage + 1
      const payload = {
        curPage : curPage
      }

      const returnData = yield call(queryAlertListTime, payload)
      data = data.concat(returnData)
      yield put({
        type: 'loadMore',
        payload: {
          data,
          curPage
        }
      })


    }
  }



}
