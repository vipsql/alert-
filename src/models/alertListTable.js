import { queryAlertList } from '../services/alertList'
import {parse} from 'qs'

export default {
  namespace: 'alertListTable',
  state: {
    gridWidth: 100,
    minuteToWidth: 5, //以分钟单位计算间隔
    data: [],
    columns: [{
      key: 'entityAddr',
      title: '对象',
      width: 100,
    }, {
      key: 'typeName',
      title: '告警名称',
      width: 100,
    }, {
      key: 'entityName',
      title: '告警来源',
      width: 200,
    }, {
      key: 'status',
      title: '告警状态',
      width: 150,
    }, {
      key: 'description',
      title: '告警描述',
    }, {
      key: 'count',
      title: '次数',
    }, {
      key: 'lastTime',
      title: '持续时间',
    }, {
      key: 'lastOccurtime',
      title: '最后发送时间',
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
    // 自定义列
    customCols(state, {payload: columns}){
      return {
        ...state,
        columns
      }

    },
    // 更新告警列表
    updateAlertListData(state, {payload: data}){
      return {
        ...state,
        data
      }
    },

  },
  effects: {

    //查询告警列表
    *queryAlertList({payload},{call, put, select}){

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
      //     payload: true
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

      const data = yield call(queryAlertList, {
        ...tagsFilter,
        ...extraParams
      })

      if(data.result){
        if(isGroup){
          yield put({
            type: 'updateAlertListData',
            payload: data.data
          })
          yield put({
            type: 'alertListTableCommon/updateShowMore',
            payload: false
          })
          yield put({
            type: 'alertListTableCommon/initCheckAlertToGroup',
            payload: data.data
          })

        }else{
          yield put({
            type: 'updateAlertListData',
            payload: data.data.datas
          })
          yield put({
            type: 'alertListTableCommon/updateShowMore',
            payload: data.data.hasNext
          })
          yield put({
            type: 'alertListTableCommon/initCheckAlert',
            payload: data.data.datas
          })
        }

      }
    }
  },


}
