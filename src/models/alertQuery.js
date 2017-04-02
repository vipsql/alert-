import { querySource, queryAlertList, queryCount} from '../services/alertQuery'
import { groupSort } from '../utils'
import { message } from 'antd'
import {parse} from 'qs'
import { injectIntl, formatMessage, defineMessages, IntlProvider} from 'react-intl';

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
    
    tempListData: [], //用于临时记录列表数据，在分组时取用这块的数据（避免连续分组时的BUG）
    data: [],

    columns: [{
      key: 'entityName',
    }, {
      key: 'name',
    }, {
      key: 'source',
      order: true
    }, {
      key: 'status',
    }, {
      key: 'description',
    }, {
      key: 'count',
      order: true
    }, {
      key: 'lastTime',
      order: true
    }, {
      key: 'lastOccurTime',
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
    updateAlertListData(state, {payload: {data, tempListData}}) {
      return { ...state, data, tempListData }
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
    updateAlertListToNoGroup(state, {payload: {info, tempListData, isShowMore, isGroup, orderBy, orderType, queryCount, currentPage}}) {
      
      return { ...state, data: info, tempListData, isShowMore, isGroup, orderBy, orderType, queryCount, currentPage}
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
    // 修改状态为处理中
    changeCloseState(state, {payload}) {
      const { data, isGroup } = state;
      if (isGroup === true) {
        const newData = data.map( (group) => {
          const arr = group.children.map( (item) => {
            payload.forEach( (id) => {
              if (item.id == id) {
                item['status'] = 255; // 手动变为150 -> 已解决
              } 
            })
            return item;
          })
          group.children = arr;
          return group;
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.map( (item, index) => {
          payload.forEach( (id) => {
            if (item.id == id) {
              item['status'] = 255; // 手动变为150 -> 已解决
            } 
          })
          return item;
        })
        return { ...state, data: newData }
      }
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
         yield message.error(window.__alert_appLocaleData.messages[options.message], 3)
       }
    },

    // 点击查找
    *queryBefore({payload},{call, put, select}) {
      yield put({ type: 'setCurrentQuery', payload: payload })
      yield put({ type: 'queryAlertList'})
      yield put({ type: 'alertQueryDetail/removeGroupType'})
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

      // 这里触发时currentPage始终为1，如果从common取在分组转分页时会有问题
      extraParams = {
        pageSize: pageSize,
        currentPage: 1,
        orderBy: orderBy,
        orderType: orderType
      }

      const listData = yield call(queryAlertList, {
        ...currentQuery,
        ...extraParams
      })

      const countData = yield call(queryCount, {
        ...currentQuery
      })
      
      if(listData.result){
          yield put({
            type: 'updateAlertListToNoGroup',
            payload: {
              info: listData.data.data,
              tempListData: listData.data.data,
              isShowMore: listData.data.hasNext,
              isGroup: false,
              orderBy: orderBy,
              orderType: orderType,
              currentPage: 1,
              queryCount: countData.result ? countData.data : {}
            }
          })
          yield put({
            type: 'toggleLoading',
            payload: false
          })

      } else {
        yield message.error(window.__alert_appLocaleData.messages[listData.message], 2)
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
      const { tempListData, queryCount }=  yield select(state => {
         return {
           'tempListData': state.alertQuery.tempListData,
           'queryCount': state.alertQuery.queryCount
         }
      })
      if (payload.isGroup) {
        yield put({
          type: 'toggleLoading',
          payload: true
        })
        const groupList = yield groupSort()(tempListData, payload.group)
        yield put({
          type: 'updateAlertListToGroup',
          payload: {
            info: groupList,
            isShowMore: false,
            isGroup: true,
            groupBy: payload.group,
            queryCount: queryCount
          }
        })
        yield put({
          type: 'toggleLoading',
          payload: false
        })
        //yield put({ type: 'queryAlertList', payload: { isGroup: payload.isGroup, groupBy: payload.group } })   
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
          payload: {
            data: listData,
            tempListData: listData
          }
        })

        yield put({ type: 'setMore', payload: currentPage })

        yield put({
          type: 'toggleLoading',
          payload: false
        })
      } else {
        yield message.error(window.__alert_appLocaleData.messages[listReturnData.message], 2)
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
        console.error('orderBy error')
      }
    }
  },

}
