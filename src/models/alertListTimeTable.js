import { queryAlertListTime } from '../services/alertList'
import {parse} from 'qs'

export default {
  namespace: 'alertListTimeTable',
  state: {
    gridWidth: 100,
    isGroup: false,
    minuteToWidth: 5, //以分钟单位计算间隔
    begin: 0,
    end: 0,
    isShowMore: true, // 是否显示更多
    orderBy: 'source',
    orderType: 0,
    groupBy: 'source',
    pageSize: 50,
    currentPage: 1,
    data: [],
    columns: [{
      title: '对象',
      key: 'entity',
      width: 100
    }, {
      title: '告警名称',
      key: 'description',
      width: 180
    }]
  },
  subscriptions: {
    setup({dispatch}) {

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
    },
    // 更新告警列表
    updateAlertListTimeData(state, {payload: {data,isShowMore}}){
      return {
        ...state,
        data,
        isShowMore
      }
    },
    // 更新分组字段
    updateGroup(state,{payload: isGroup}){
      return {
        ...state,
        isGroup
      }
    }
  },
  effects: {
    *queryAlertListTime({ payload }, {call, put, select}){

      let {
        isGroup,
        begin,
        end
      } = yield select(state => {
        const alertListTimeTable = state.alertListTimeTable
        return {
          isGroup: alertListTimeTable.isGroup,
          begin: alertListTimeTable.begin,
          end: alertListTimeTable.end
        }
      })


      // 如果是分组
      if(payload.begin){
        begin = payload.begin
        end = payload.end
        isGroup = payload.isGroup
      }

      // 如果存在表示分组
      if(isGroup){
        yield put({
          type: 'updateGroup',
          payload: true,

        })
      }
      const tagsFilter = yield select( state => {

        return {
          ...state.alertList.tagsFilter,
          begin: begin,
          end: end
        }
      })

      const extraParams = yield select( state => {
        const alertListTimeTable = state.alertListTimeTable
        if(isGroup){
          return {
            groupBy: payload.group
          }
        }else{
          return {
            pageSize: alertListTimeTable.pageSize,
            currentPage: alertListTimeTable.currentPage,
            orderBy: alertListTimeTable.orderBy,
            orderType: alertListTimeTable.orderType
          }
        }
      })

      const data = yield call(queryAlertListTime, {
        ...tagsFilter,
        ...extraParams
      })


      if(data.result){
        // 更新当前状态
        // yield put({
        //   type: 'updateCurState',
        //   payload: {
        //     data: data.data,
        //     begin,
        //     end,
        //     isGroup
        //   },
        //
        // })

        if(isGroup){
          yield put({
            type: 'updateAlertListTimeData',
            payload:{
              data: data.data,
              isShowMore: false
            }
          })
        }else{
          yield put({
            type: 'updateAlertListTimeData',
            payload:{
              data: data.data,
              isShowMore: data.data
            }
          })




        }

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
