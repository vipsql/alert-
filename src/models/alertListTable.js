import { queryAlertList, queryChild, queryAlertListTime } from '../services/alertList'
import {parse} from 'qs'

const initvalState = {
    isGroup: false,
    groupBy: 'source',

    selectedAlertIds: [], //选中的告警(合并告警)
    operateAlertIds: [], //选中的告警(派发 关闭)
    viewDetailAlertId: false, // 查看详细告警ID

    isShowMore: false,
    isLoading: false,

    orderBy: undefined,
    orderType: undefined,
    pageSize: 20,
    currentPage: 1,

    begin: 0,
    end: 0,

    tagsFilter: {}, // 过滤标签
    selectedAll: false,

    checkAlert: {}, //此对象将alertId作为属性，用来过滤checked的alert

    gridWidth: 100,
    minuteToWidth: 5, //以分钟单位计算间隔
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
  namespace: 'alertListTable',
  state: initvalState,
  subscriptions: {
    setup({dispatch}) {


    }
  },
  reducers: {
    // 加载状态
    toggleLoading(state, { payload: isLoading }) {
      return { ...state, isLoading }
    },
    // 更改全选状态
    toggleSelectedAll(state, {payload}) {
      const { selectedAll, checkAlert } = state;
      let newStatus = !selectedAll;
      let ids = Object.keys(checkAlert);
      ids.forEach( (id) => {
        checkAlert[id].checked = newStatus;
      })
      return { ...state, selectedAll: newStatus, checkAlert: checkAlert }
    },
    // 更新分组字段
    updateGroup(state,{ payload }){
      return {
        ...state,
        ...payload
      }
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
    // 注入通用状态
    setInitvalScope(state, { payload }) {
      return { ...state, ...payload }
    },
    // 设置viewDetailAlertId
    toggleDetailAlertId(state, {payload: viewDetailAlertId}) {
      return { ...state, viewDetailAlertId }
    },
    // 初始化
    clear(state) {
      return { ...state, ...initvalState }
    },
    // 不分组更新
    updateAlertListToNoGroup(state, {payload: {info, isShowMore, isGroup}}) {
      let checkList = {};
      info.forEach( (item, index) => {
        checkList[`${item.id}`] = {
          info: item,
          checked: false
        }
      })
      return { ...state, checkAlert: checkList, data: info, isShowMore, isGroup}
    },
    // 分组时更新
    updateAlertListToGroup(state, {payload: {info, isShowMore, isGroup, groupBy}}) {
      let checkList = {};
      info.forEach( (group, index) => {
        group.children.forEach( (item) => {
          checkList[`${item.id}`] = {
            info: item,
            checked: false
          }
        })
      })
      return { ...state, checkAlert: checkList, data: info, isShowMore, isGroup, groupBy}
    },
    // 记录下原先checked数据
    resetCheckAlert(state, { payload: { origin, newObj } }) {
      let ids = Object.keys(origin);
      let checkList = {};
      newObj.forEach( (item, index) => {
        checkList[`${item.id}`] = {
          info: item,
          checked: false
        }
        ids.forEach( (id) => {
          if (item.id == id && origin[id].checked) {
            checkList[`${item.id}`] = {
              info: item,
              checked: true
            }
          }
        })
      })
      return { ...state, checkAlert: checkList }
    },
    // 重置勾选状态
    resetCheckedAlert(state) {
      const { checkAlert } = state;
      let ids = Object.keys(checkAlert);
      ids.forEach( (id) => {
        checkAlert[id].checked = false
      })
      return { ...state, checkAlert: checkAlert }
    },
    // 更改勾选状态
    changeCheckAlert(state, { payload: alertInfo }) {
      const { checkAlert } = state;
      if (checkAlert[alertInfo.id] !== undefined) {
        checkAlert[alertInfo.id].checked = !checkAlert[alertInfo.id].checked
        return { ...state, checkAlert: checkAlert }
      } else {
        return { ...state }
      }
    },
    // 在点击操作时进行过滤处理
    filterCheckAlert(state) {
      const { checkAlert } = state;
      let operateAlertIds = [], selectedAlertIds = [];
      let keyArr = Object.keys(checkAlert) || [];
      keyArr.forEach( (id) => {
        if (checkAlert[id].checked) {
          operateAlertIds.push(id);
          selectedAlertIds.push(checkAlert[id].info)
        }
      })
      return { ...state, operateAlertIds: operateAlertIds, selectedAlertIds: selectedAlertIds }
    },
    // ----------------------------------------------------------------------------------------------
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
    // 手动添加子告警
    addChild(state, { payload: {children, parentId, isGroup} }) {
      const { data } = state;
      if (isGroup === true) {
        const newData = data.map( (group) => {
          group.children.map( (item) => {
            if (item.id == parentId) {
              item.childrenAlert = children;
              item.isSpread = true
            } 
            return item;
          })
          return group
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.map( (item, index) => {
          if (item.id == parentId) {
            item.childrenAlert = children;
            item.isSpread = true
          }
          return item;
        })
        return { ...state, data: newData }
      }
      return { ...state }
    },
    // 收拢子告警
    toggleSpreadChild(state, { payload: { parentId, isGroup} }) {
      const { data } = state;
      if (isGroup === true) {
        const newData = data.map( (group) => {
          group.children.map( (item) => {
            if (item.id == parentId) {
              item.isSpread = !item.isSpread
            } 
            return item;
          })
          return group
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.map( (item, index) => {
          if (item.id == parentId) {
            item.isSpread = !item.isSpread
          }
          return item;
        })
        return { ...state, data: newData }
      }
      return { ...state }
    },
    // 合并告警
    mergeChildrenAlert(state, { payload: { parentId, childItems, isGroup}}) {
      const { data, checkAlert } = state;
      const childIds = childItems.map( item => item.id )
      let childsItem = [];
      if (isGroup === true) {
        const newData = data.map( (group) => {
          const arr = group.children.filter( (item) => {
            let status = true;
            if (item.id == parentId) {
              item.hasChild = true;
              item.isSpread = true;
              item.childrenAlert = childItems;
            }
            childIds.forEach( (child) => {
              if (child == item.id) {
                status = false;
              }
            })
            return status;
          })
          group.children = arr;
          return group
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.filter( (item) => {
          let status = true;
          if (item.id == parentId) {
            item.hasChild = true;
            item.isSpread = true;
            item.childrenAlert = childItems;
          }
          childIds.forEach( (child) => {
            if (child == item.id) {
              status = false;
            }
          })
          return status;
        })
        return { ...state, data: newData }
      }
      return { ...state }
    },
    // addParent再没展开过的情况下去解除告警
    addParent(state, { payload: { addItem, parentId, isGroup}}) {
      const { data, checkAlert } = state;
      if (isGroup === true) {
        const newData = data.map( (group) => {
          let status = false;
          group.children.map( (item) => {
            if (item.id == parentId) {
              status = true;
              item.hasChild = false;
              item.isSpread = false;
            } 
            return item;
          })
          if (status) {
            group.children.push(...addItem);
            addItem.forEach( (item) => { checkAlert[item.id] = { info: item, checked: false } })
          }
          return group;
        })
        return { ...state, data: newData, checkAlert: checkAlert}
      } else if (isGroup === false) {
        let status = false;
        const newData = data.map( (item, index) => {
          if (item.id == parentId) {
            status = true;
            item.hasChild = false;
            item.isSpread = false;
          }
          return item;
        })
        if (status) {
          newData.push(...addItem);
          addItem.forEach( (item) => { checkAlert[item.id] = { info: item, checked: false } })
        }
        return { ...state, data: newData, checkAlert: checkAlert }
      }
      return { ...state }
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
    }

  },
  effects: {

    //查询告警列表
    *queryAlertList({payload},{call, put, select}){

      yield put({
        type: 'toggleLoading',
        payload: true
      })

      var {
        isGroup,
        groupBy,
        begin,
        end,
        pageSize,
        orderBy,
        orderType
      } = yield select(state => {
        const alertListTable = state.alertListTable

        return {
          isGroup: alertListTable.isGroup,
          groupBy: alertListTable.groupBy,
          begin: alertListTable.begin,
          end: alertListTable.end,
          pageSize: alertListTable.pageSize,
          orderBy: alertListTable.orderBy,
          orderType: alertListTable.orderType
        }
      })
      var extraParams = {};

      if(payload !== undefined && payload.isGroup !== undefined) {
        isGroup = payload.isGroup;
        groupBy = payload.groupBy;
        orderBy = payload.orderBy;
        orderType = payload.orderType;
      }

      const tagsFilter = yield select( state => {

        return {
          ...state.alertListTable.tagsFilter,
          begin: begin,
          end: end
        }
      })

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
        ...tagsFilter,
        ...extraParams
      })

      if(listData.result){
        if(isGroup){
          
          yield put({
            type: 'updateAlertListToGroup',
            payload: {
              info: listData.data,
              isShowMore: false,
              isGroup: isGroup,
              groupBy: groupBy
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
              isGroup: false
            }
          })
          yield put({
            type: 'toggleLoading',
            payload: false
          })
          
        }

      }
    },
    // 展开子告警
    *spreadChild({payload},{call, put, select}) {
      let haveChild;
      const {data, isGroup, begin, end} = yield select( state => {
        return {
          'isGroup': state.alertListTable.isGroup,
          'data': state.alertListTable.data,
          'begin': state.alertListTable.begin,
          'end': state.alertListTable.end
        }
      } )
      // 先看下有没有子告警，没有就查询 有就隐藏
      if (isGroup === true) {
        data.forEach( (group) => {
          group.children.forEach( (item) => {
            if (item.id == payload) {
              haveChild = !(typeof item.childrenAlert === 'undefined')
            } 
          })
        })
      } else if (isGroup === false) {
        data.forEach( (item, index) => {
          if (item.id == payload) {
            haveChild = !(typeof item.childrenAlert === 'undefined')
          }
        })
      }

      if (typeof haveChild !== undefined && !haveChild) {
        const childResult = yield call(queryChild, {alertId: payload, begin: begin, end: end})
        if (childResult.result) {
          yield put( { type: 'addChild', payload: { children: childResult.data, parentId: payload, isGroup: isGroup } })
          
        } else {
          console.error('查询子告警有误')
        }
      } else if (typeof haveChild !== undefined && haveChild){
        yield put( { type: 'toggleSpreadChild', payload: { parentId: payload, isGroup: isGroup} })
      } else {
        console.error('haveChild is undefined')
      }
    },
    // 收拢子告警
    *noSpreadChild({payload},{call, put, select}) {
      const {isGroup} = yield select( state => {
        return {
          'isGroup': state.alertListTable.isGroup,
        }
      } )
      
      yield put( { type: 'toggleSpreadChild', payload: { parentId: payload, isGroup: isGroup} })
    },
    // 合并告警
    *mergeChildAlert({payload},{call, put, select}) {
      const {data, isGroup} = yield select( state => {
        return {
          'isGroup': state.alertListTable.isGroup,
          'data': state.alertListTable.data,
        }
      } )
      // push childrenAlert/ remove parent/ hasChild -> true/ isSpread -> true
      yield put({ type: 'mergeChildrenAlert', payload: { parentId: payload.pId, childItems: payload.cItems, isGroup: isGroup}})
    },
    // 解除告警
    *relieveChildAlert({payload},{call, put, select}) {
      
      const {isGroup, begin, end} = yield select( state => {
        return {
          'isGroup': state.alertListTable.isGroup,
        }
      } )
      
      yield put( { type: 'addParent', payload: { addItem: payload.childs, parentId: payload.relieveId, isGroup: isGroup} })
          
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
          payload: listData
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
      yield put({ type: 'toggleOrder', payload: payload })
      yield put({ type: 'queryAlertList' })   
    }
  },


}
