import { queryAlertList } from '../services/alertList'
import {parse} from 'qs'

export default {
  namespace: 'alertListTable',
  state: {
    gridWidth: 100,
    isGroup: false,
    minuteToWidth: 5, //以分钟单位计算间隔
    begin: 0,
    end: 0,
    isShowMore: false,
    data: [],
    orderBy: 'source',
    orderType: 0,
    groupBy: 'source',
    pageSize: 50,
    currentPage: 1,
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
      title: '来源',
      width: 200,
    }, {
      key: 'status',
      title: '状态',
      width: 150,
    }, {
      key: 'description',
      title: '告警描述',
    }, {
      key: 'count',
      title: '次数',
    }, {
      key: 'time',
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
    updateAlertListData(state, {payload: {data,isShowMore}}){
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

    //查询告警列表
    *queryAlertList({payload},{call, put, select}){
      let {
        isGroup,
        begin,
        end
      } = yield select(state => {
        const alertListTable = state.alertListTable
        return {
          isGroup: alertListTable.isGroup,
          begin: alertListTable.begin,
          end: alertListTable.end
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
          payload: true
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
        const alertListTable = state.alertListTable
        if(isGroup){
          return {
            groupBy: payload.group
          }
        }else{
          return {
            pageSize: alertListTable.pageSize,
            currentPage: alertListTable.currentPage,
            orderBy: alertListTable.orderBy,
            orderType: alertListTable.orderType
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
            payload:{
              data: data.data,
              isShowMore: false
            }
          })
        }else{
          yield put({
            type: 'updateAlertListData',
            payload:{
              data: data.data.datas,
              isShowMore: data.data.hasNext
            }
          })
        }

      }
    }
  },


}
