import { queryAlertListTime } from '../services/alertList'
import {parse} from 'qs'

export default {
  namespace: 'alertListTimeTable',
  state: {
    gridWidth: 100,
    isGroup: false,
    minuteToWidth: 5, //以分钟单位计算间隔
    // begin: 0,
    // end: 0,
    // isShowMore: true, // 是否显示更多
    // orderBy: 'source',
    // orderType: 0,
    // groupBy: 'source',
    // pageSize: 50,
    // currentPage: 1,
    data: [],
    columns: [{
      title: '对象',
      key: 'entity',
      width: 100
    }, {
      title: '告警名称',
      key: 'alertName',
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
    // 更新告警列表
    updateAlertListTimeData(state, {payload: data}){
      return {
        ...state,
        data
      }
    },
    // 更新分组字段
    // updateGroup(state,{payload: isGroup}){
    //   return {
    //     ...state,
    //     isGroup
    //   }
    // },
    // 更新时间
    // updateCurState(state, {payload: {begin,end}}){
    //   return {
    //     ...state,
    //     begin,
    //     end
    //   }
    // }
  },
  effects: {
    *queryAlertListTime({ payload }, {call, put, select}){
      
      let {
        isGroup,
        groupBy,
        begin,
        end
      } = yield select(state => {
        const alertListTableCommon = state.alertListTableCommon
        return {
          isGroup: alertListTableCommon.isGroup,
          groupBy: alertListTableCommon.groupBy,
          begin: alertListTableCommon.begin,
          end: alertListTableCommon.end
        }
      })


      // 如果是分组
      // if(payload.begin){
      //   begin = payload.begin
      //   end = payload.end
      //   isGroup = payload.isGroup
      // }

      // 如果存在表示分组
      // if(isGroup){
      //   yield put({
      //     type: 'alertListTableCommon/updateGroup',
      //     payload: true,

      //   })
      // }
      const tagsFilter = yield select( state => {

        return {
          ...state.alertListTableCommon.tagsFilter,
          begin: begin,
          end: end
        }
      })

      const extraParams = yield select( state => {
        const alertListTableCommon = state.alertListTableCommon
        if(isGroup){
          return {
            groupBy: groupBy
          }
        }else{
          return {
            pageSize: alertListTableCommon.pageSize,
            currentPage: alertListTableCommon.currentPage,
            orderBy: alertListTableCommon.orderBy,
            orderType: alertListTableCommon.orderType
          }
        }
      })

      const data = yield call(queryAlertListTime, {
        ...tagsFilter,
        ...extraParams
      })


      if(data.result){

        if(isGroup){
          yield put({
            type: 'updateAlertListTimeData',
            payload: data.data,
          })
          yield put({
            type: 'alertListTableCommon/updateShowMore',
            payload: false
          })
        }else{
          yield put({
            type: 'updateAlertListTimeData',
            payload: data.data.datas
          })

          yield put({
            type: 'alertListTableCommon/updateShowMore',
            payload:data.data.hasNext
          })

        }

      }



    }
  }



}
