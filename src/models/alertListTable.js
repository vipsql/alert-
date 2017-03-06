import { queryAlertList, queryChild, queryAlertListTime } from '../services/alertList'
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
      const { data } = state;
      const childIds = childItems.map( item => item.id )
      let childsItem = [];
      if (isGroup === true) {
        const newData = data.map( (group) => {
          group.children.filter( (item) => {
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
      const { data } = state;
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
          console.log(status)
          if (status) {
            group.children.push(...addItem);
          }
          return group;
        })
        return { ...state, data: newData }
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
        console.log(status)
        if (status) {
          newData.push(...addItem);
        }
        return { ...state, data: newData }
      }
      return { ...state }
    },
    // relieveChildrenAlert在展开过的情况下做操作
    relieveChildrenAlert(state, {payload: {parentId, isGroup}}) {
      const { data } = state;
      if (isGroup === true) {
        const newData = data.map( (group) => {
          let items = [];
          group.children.map( (item) => {
            if (item.id == parentId) {
              items = item.childrenAlert;
              delete item.childrenAlert;
              item.hasChild = false;
              item.isSpread = false;
            } 
            return item;
          })
          console.log(items)
          if (items.length !== 0) {
            group.children.push(...items);
          }
          return group;
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        let items = [];
        const newData = data.map( (item, index) => {
          if (item.id == parentId) {
            items = item.childrenAlert;
            delete item.childrenAlert;
            item.hasChild = false;
            item.isSpread = false;
          }
          return item;
        })
        console.log(items)
        if (items.length !== 0) {
          newData.push(...items);
        }
        return { ...state, data: newData }
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
    }

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
      // if( payload !== undefined && payload.isGroup !== undefined){
      //   groupBy = payload.groupBy
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
          // 这里触发时currentPage始终为1，如果从common取在分组转分页时会有问题
          return {
            pageSize: alertListTableCommon.pageSize,
            currentPage: 1,
            orderBy: alertListTableCommon.orderBy,
            orderType: alertListTableCommon.orderType
          }
        }
      })

      const listData = yield call(queryAlertList, {
        ...tagsFilter,
        ...extraParams
      })
      // 因为现在是同步，搁到一块，减少过度渲染
      const listTimedata = yield call(queryAlertListTime, {
        ...tagsFilter,
        ...extraParams
      })

      if(listData.result && listTimedata.result){
        if(isGroup){
          // 这个必须先触发，因为在ListTable中item.id匹配不到会使checkAlert[item.id]=undefined
          yield put({
            type: 'alertListTableCommon/initCheckAlertToGroup',
            payload: listData.data
          })
          yield put({
            type: 'updateAlertListData',
            payload: listData.data
          })
          yield put({
            type: 'alertListTimeTable/updateAlertListTimeData',
            payload: listTimedata.data,
          })
          yield put({
            type: 'alertListTableCommon/updateShowMore',
            payload: false
          })

        }else{
          // 这个必须先触发，因为在ListTable中item.id匹配不到会使checkAlert[item.id]=undefined
          yield put({
            type: 'alertListTableCommon/initCheckAlert',
            payload: listData.data.datas
          })
          yield put({
            type: 'updateAlertListData',
            payload: listData.data.datas
          })
          yield put({
            type: 'alertListTimeTable/updateAlertListTimeData',
            payload: listTimedata.data.datas
          })
          yield put({
            type: 'alertListTableCommon/updateShowMore',
            payload: listData.data.hasNext
          })
        }

      }
    },
    // 展开子告警
    *spreadChild({payload},{call, put, select}) {
      let haveChild;
      const {data, isGroup} = yield select( state => {
        return {
          'isGroup': state.alertListTableCommon.isGroup,
          'data': state.alertListTable.data
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
        const childResult = yield call(queryChild, payload)
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
          'isGroup': state.alertListTableCommon.isGroup,
        }
      } )
      
      yield put( { type: 'toggleSpreadChild', payload: { parentId: payload, isGroup: isGroup} })
    },
    // 合并告警
    *mergeChildAlert({payload},{call, put, select}) {
      const {data, isGroup} = yield select( state => {
        return {
          'isGroup': state.alertListTableCommon.isGroup,
          'data': state.alertListTable.data
        }
      } )
      // push childrenAlert/ remove parent/ hasChild -> true/ isSpread -> true
      yield put({ type: 'mergeChildrenAlert', payload: { parentId: payload.pId, childItems: payload.cItems, isGroup: isGroup}})
    },
    // 解除告警
    *relieveChildAlert({payload},{call, put, select}) {
      console.log(payload)
      let haveChild;
      const {data, isGroup} = yield select( state => {
        return {
          'isGroup': state.alertListTableCommon.isGroup,
          'data': state.alertListTable.data
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
        const childResult = yield call(queryChild, payload)
        if (childResult.result) {
          yield put( { type: 'addParent', payload: { addItem: childResult.data || [], parentId: payload, isGroup: isGroup } })
          
        } else {
          console.error('查询子告警有误')
        }
      } else if (typeof haveChild !== undefined && haveChild){
        yield put( { type: 'relieveChildrenAlert', payload: { parentId: payload, isGroup: isGroup} })
      } else {
        console.error('haveChild is undefined')
      }
    },
    // 展开组
    *spreadGroup({payload},{call, put, select}) {
      console.log(payload);
      yield put({ type: 'toggleGroupSpread', payload: payload })
    },
    // 合拢组
    *noSpreadGroup({payload},{call, put, select}) {
      console.log(payload);
      yield put({ type: 'addGroupSpread', payload: payload })
    }
  },


}
