import { querySource, queryAlertList, queryCount} from '../services/alertQuery'

import { message } from 'antd'

import {parse} from 'qs'

const initalState = {

    haveQuery: false, // 是否包含查询条件
    sourceOptions: [], // 来源
    queryCount: {}, // 查询数量结果
    currentQuery: {}, // 当前的查询条件

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
      key: 'entityName',
      title: '对象',
      width: 100,
    }, {
      key: 'name',
      title: '告警名称',
      width: 100,
    }, {
      key: 'source',
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
      order: true
    }, {
      key: 'lastTime',
      title: '持续时间',
      order: true
    }, {
      key: 'lastOccurTime',
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
    // 更新查询条件
    setCurrentQuery(state, {payload: currentQuery}) {
      return { ...state, currentQuery }
    },
    // 更新data数据
    updateAlertListData(state, {payload: data}) {
      return { ...state, data }
    },
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
      const { data, isGroup } = state;
      if (isGroup === true) {
        const newData = data.map( (group) => {
          const arr = group.children.filter( (item) => {
            let status = true;
            payload.forEach( (id) => {
              if (item.id == id) {
                status = false;
              } 
            })
            return status;
          })
          group.children = arr;
          return group;
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.filter( (item, index) => {
          let status = true;
          payload.forEach( (id) => {
            if (item.id == id) {
              status = false;
            } 
          })
          return status;
        })
        return { ...state, data: newData }
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
       // 列定制初始化
       yield put({ type: 'alertQueryDetail/initalColumn'})

       const options = yield call(querySource)
       
       if (options.result) {
         yield put({
           type: 'setSourceOptions',
           payload: options.data || [],
         })
       } else {
         yield message.error('查询告警来源失败', 3)
       }
    },

    // 点击查找
    *queryBefore({payload},{call, put, select}) {
      console.log(payload)
      yield put({ type: 'setCurrentQuery', payload: payload })
      yield put({ type: 'queryAlertList'})
    },

    //查询告警列表
    *queryAlertList({payload},{call, put, select}){
      
      // payload为空时是有内置的查询条件的
      yield put({
        type: 'changeState',
        payload: {
          isLoading: true,
          haveQuery: true,
        }
      })

      var {
        isGroup,
        groupBy,
        pageSize,
        orderBy,
        orderType,
        currentQuery
      } = yield select(state => {
        const alertQuery = state.alertQuery

        return {
          isGroup: alertQuery.isGroup,
          groupBy: alertQuery.groupBy,
          pageSize: alertQuery.pageSize,
          orderBy: alertQuery.orderBy,
          orderType: alertQuery.orderType,
          currentQuery: alertQuery.currentQuery
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
        ...currentQuery,
        ...extraParams
      })

      const countData = yield call(queryCount, {
        ...currentQuery
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
              info: listData.data.data,
              isShowMore: listData.data.hasNext,
              isGroup: false,
              orderBy: orderBy,
              orderType: orderType,
              queryCount: countData.result ? countData.data : {}
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
      yield put({ type: 'alertQueryDetail/openDetailModal'})
    },
    // show more
    *loadMore({}, {call, put, select}){

      yield put({
        type: 'toggleLoading',
        payload: true
      })
      
      let { currentPage, listData, alertQuery }=  yield select(state => {
         return {
           'currentPage': state.alertQuery.currentPage,
           'listData': state.alertQuery.data,
           'alertQuery': state.alertQuery
         }
      })

      currentPage =  currentPage + 1
      const params = {
        currentPage: currentPage,
        orderBy: alertQuery.orderBy,
        orderType: alertQuery.orderType,
        pageSize: alertQuery.pageSize,
        ...alertQuery.currentQuery
      }

      const listReturnData = yield call(queryAlertList, params)

      if (listReturnData.result) {

        listData = listData.concat(listReturnData.data.data);
        
        if (!listReturnData.data.hasNext) {
          yield put({
            type: 'updateShowMore',
            payload: listReturnData.data.hasNext
          })
        }

        yield put({
          type: 'updateAlertListData',
          payload: listData,
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
      yield put({ type: 'queryAlertList', payload: { isGroup: false, orderBy: payload.orderBy, orderType: payload.orderType } })   
    },
    //orderByTittle
    *orderByTittle({payload}, {select, put, call}) {
      const { orderType } = yield select( state => {
        return {
          'orderType': state.alertQuery.orderType,
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
