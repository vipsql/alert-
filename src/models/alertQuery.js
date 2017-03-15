import { querySource, queryAlertList, queryCount} from '../services/alertQuery'

import { message } from 'antd'

import {parse} from 'qs'

const initalState = {

    haveQuery: false, // 是否包含查询条件
    sourceOptions: [], // 来源
    queryCount: {}, // 查询数量结果

    isGroup: false,
    groupBy: 'source',

    viewDetailAlertId: false, // 查看详细告警ID

    isShowMore: false,
    isLoading: false,

    orderBy: undefined,
    orderType: undefined,
    pageSize: 20,
    currentPage: 1,
    
    data: [],

    columns: [{
      key: 'entity',
      title: '对象',
      width: 100,
    }, {
      key: 'alertName',
      title: '告警名称',
      width: 100,
    }, {
      key: 'entityName',
      title: '告警来源',
      width: 200,
      order: true
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
      order: true
    }, {
      key: 'lastOccurtime',
      title: '最后发送时间',
      order: true
    }],
}

export default {
  namespace: 'alertQuery',

  state: initalState,

  subscriptions: {
    alertQuerySetup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/alertQuery') {
          dispatch({
            type: 'alertQuerySetup'
          })
        }
      })

    }
  },

  reducers: {
    // 存放告警来源的options
    setSourceOptions(state, { payload: sourceOptions}) {
      return { ...state, sourceOptions }
    },
    // 用来一次性结构状态，避免过度渲染
    changeState(state, { payload }) {
      return { ...state, ...payload }
    },
    // 加载状态
    toggleLoading(state, { payload: isLoading }) {
      return { ...state, isLoading }
    },
    // 更新显示更多字段
    updateShowMore(state,{payload: isShowMore}){
      return {
        ...state,
        isShowMore
      }
    },
    // 点击查看更多
    setMore(state, { payload: currentPage }){

      return {
        ...state,
        currentPage
      }
    },
    // 设置viewDetailAlertId
    toggleDetailAlertId(state, {payload: viewDetailAlertId}) {
      return { ...state, viewDetailAlertId }
    },
    // 初始化
    clear(state) {
      return { ...state, ...initalState }
    },
    // 不分组更新
    updateAlertListToNoGroup(state, {payload: {info, isShowMore, isGroup, orderBy, orderType, queryCount}}) {
      
      return { ...state, data: info, isShowMore, isGroup, orderBy, orderType, queryCount}
    },
    // 分组时更新
    updateAlertListToGroup(state, {payload: {info, isShowMore, isGroup, groupBy, queryCount}}) {
      
      return { ...state, data: info, isShowMore, isGroup, groupBy, queryCount}
    },
    
    // 自定义列
    customCols(state, {payload: columns}){
      return {
        ...state,
        columns
      }
    },
    // 手动添加分组展开状态
    addGroupSpread(state, { payload }) {
      const { data } = state;
      const newData = data.map( (group) => {
        if (group.classify == payload) {
          group.isGroupSpread = false;
        }
        return group
      })
      return { ...state, data: newData }
    },
    // 转换分组的展开状态
    toggleGroupSpread(state, { payload }) {
      const { data } = state;
      const newData = data.map( (group) => {
        if (group.classify == payload) {
          group.isGroupSpread = !group.isGroupSpread;
        }
        return group
      })
      return { ...state, data: newData }
    },
    // 排序
    toggleOrder(state, {payload}) {
      return { ...state, ...payload }
    },
    // 删除时触发
    deleteAlert(state, {payload}) {
      const { data, isGroup, checkAlert } = state;
      if (isGroup === true) {
        const newData = data.map( (group) => {
          const arr = group.children.filter( (item) => {
            let status = true;
            payload.forEach( (id) => {
              if (item.id == id) {
                status = false;
                delete checkAlert[item.id]
              } 
            })
            return status;
          })
          group.children = arr;
          return group;
        })
        return { ...state, data: newData, checkAlert: checkAlert}
      } else if (isGroup === false) {
        const newData = data.filter( (item, index) => {
          let status = true;
          payload.forEach( (id) => {
            if (item.id == id) {
              status = false;
              delete checkAlert[item.id]
            } 
          })
          return status;
        })
        return { ...state, data: newData, checkAlert: checkAlert }
      }
      return { ...state }
    }

  },
  effects: {
    /**
     * open alertQuery page operate
     * 1. clear state
     * 3. 查询告警来源的options
     */
    *alertQuerySetup({payload},{call, put, select}){
       yield put({ type: 'alertQueryDetail/toggleDetailModal', payload: false })
       yield put({ type: 'clear'})

       const optionsResult = yield call(querySource)
       if (optionsResult.result) {
         yield put({
           type: 'setSourceOptions',
           payload: optionsResult.data || [],
         })
       } else {
         yield message.error('查询告警来源失败', 3)
       }
    },

    //查询告警列表
    *queryAlertList({payload},{call, put, select}){
      console.log(payload)
      // payload为空时是有内置的查询条件的
      yield put({
        type: 'changeState',
        payload: {
          isLoading: true,
          haveQuery: true
        }
      })

      var {
        isGroup,
        groupBy,
        pageSize,
        orderBy,
        orderType
      } = yield select(state => {
        const alertQuery = state.alertQuery

        return {
          isGroup: alertQuery.isGroup,
          groupBy: alertQuery.groupBy,
          pageSize: alertQuery.pageSize,
          orderBy: alertQuery.orderBy,
          orderType: alertQuery.orderType
        }
      })
      var extraParams = {};

      if(payload !== undefined && payload.isGroup !== undefined) {
        isGroup = payload.isGroup;
        groupBy = payload.groupBy;
        orderBy = payload.orderBy;
        orderType = payload.orderType;
      }

      if(isGroup){
        extraParams = {
          groupBy: groupBy
        }
      }else{
        // 这里触发时currentPage始终为1，如果从common取在分组转分页时会有问题
        extraParams = {
          pageSize: pageSize,
          currentPage: 1,
          orderBy: orderBy,
          orderType: orderType
        }
      }

      const listData = yield call(queryAlertList, {
        ...payload,
        ...extraParams
      })

      const countData = yield call(queryCount, {
        ...payload
      })

      if(listData.result){
        if(isGroup){
          
          yield put({
            type: 'updateAlertListToGroup',
            payload: {
              info: listData.data.datas,
              isShowMore: false,
              isGroup: isGroup,
              groupBy: groupBy,
              queryCount: countData.result === true ? countData.data : {}
            }
          })
          yield put({
            type: 'toggleLoading',
            payload: false
          })

        }else{
        
          yield put({
            type: 'updateAlertListToNoGroup',
            payload: {
              info: listData.data.datas,
              isShowMore: listData.data.hasNext,
              isGroup: false,
              orderBy: orderBy,
              orderType: orderType,
              queryCount: countData.result === true ? countData.data : {}
            }
          })
          yield put({
            type: 'toggleLoading',
            payload: false
          })
          
        }

      }
    },
    // 展开组
    *spreadGroup({payload},{call, put, select}) {
      yield put({ type: 'toggleGroupSpread', payload: payload })
    },
    // 合拢组
    *noSpreadGroup({payload},{call, put, select}) {
      yield put({ type: 'addGroupSpread', payload: payload })
    },
    // ------------------------------------------------------------------------------------------------

    // 点击分组时触发
    *setGroup({payload}, {select, put, call}) {
      if (payload.isGroup) {
        yield put({ type: 'queryAlertList', payload: { isGroup: payload.isGroup, groupBy: payload.group } })   
      } else {
        yield put({ type: 'queryAlertList', payload: { isGroup: payload.isGroup, orderBy: undefined, orderType: undefined } })
      }
    },
    // 点击展开详情
    *clickDetail({payload}, {select, put, call}) {
      yield put({ type: 'toggleDetailAlertId', payload: payload })
      yield put({ type: 'alertDetail/openDetailModal'})
    },
    // show more
    *loadMore({}, {call, put, select}){

      yield put({
        type: 'toggleLoading',
        payload: true
      })
      
      let { currentPage, listData, alertListTable }=  yield select(state => {
         return {
           'currentPage': state.alertListTable.currentPage,
           'listData': state.alertListTable.data,
           'alertListTable': state.alertListTable
         }
      })

      currentPage =  currentPage + 1
      const params = {
        currentPage: currentPage,
        begin: alertListTable.begin,
        end: alertListTable.end,
        orderBy: alertListTable.orderBy,
        orderType: alertListTable.orderType,
        pageSize: alertListTable.pageSize,
        ...alertListTable.tagsFilter
      }

      const listReturnData = yield call(queryAlertList, params)

      if (listReturnData.result) {

        listData = listData.concat(listReturnData.data.datas);
        
        yield put({
          type: 'resetCheckAlert',
          payload: {
            origin: alertListTable.checkAlert,
            newObj: listData
          }
        })
        if (!listReturnData.data.hasNext) {
          yield put({
            type: 'updateShowMore',
            payload: listReturnData.data.hasNext
          })
        }

        yield put({
          type: 'updateAlertListData',
          payload: {
            data: listData,
            newLevels: listReturnData.data.levels
          }
        })

        yield put({ type: 'setMore', payload: currentPage })

        yield put({
          type: 'toggleLoading',
          payload: false
        })
      } else {
        console.error('显示更多查询有错误');
      }
      
    },
    //orderList排序
    *orderList({payload}, {select, put, call}) {
      //yield put({ type: 'toggleOrder', payload: payload })
      yield put({ type: 'queryAlertList', payload: { isGroup: false, orderBy: payload.orderBy, orderType: payload.orderType } })   
    },
    //orderByTittle
    *orderByTittle({payload}, {select, put, call}) {
      const { orderType } = yield select( state => {
        return {
          'orderType': state.alertListTable.orderType,
        }
      } )
      if (payload !== undefined) {
        yield put({ 
          type: 'toggleOrder', 
          payload: {
            orderBy: payload,
            orderType: orderType === undefined || orderType === 1 ? 0 : 1,
          } 
        })
        yield put({ type: 'queryAlertList' })   
      } else {
        console.error('orderBy有误')
      }
    }
  },

}
