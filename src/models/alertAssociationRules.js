import {parse} from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import {
  queryRulesList,
  changeRuleStatus,
  deleteRule,
  viewRule,
  createRule,
  getUsers,
  getWos,
  getField,
  queryAttributes,
  getshowITSMParam,
} from '../services/alertAssociationRules';
import {
  querySource
} from '../services/alertQuery';
import {
  getChatOpsOptions
} from '../services/alertOperation';
import { groupSort } from '../utils'

const initalState = {
  isLoading: false,
  columns: [
    {
      key: 'name'
    },
    {
      key: 'description'
    },
    {
      key: 'owner'
    },
    {
      key: 'flag',
      order: true
    },
    {
      key: 'operation'
    }
  ],
  associationRulesTotal: 0,
  associationRules: [], // 配置规则列表
  currentEditRule: {}, // 当前编辑的规则
  currentDeleteRule: {},
  isShowDeleteModal: false,
  orderBy: undefined, // 排序字段
  orderType: undefined, // 1 --> 升序
  users: [], // 用户列表
  source: [], // 来源列表
  attributes: [], // 维度列表
  field: [], // 映射字段
  rooms: [], // chatOps 群组
  wos: [], // 工单类型
  ITSMParam: '', // 映射配置
}

export default {
  namespace: 'alertAssociationRules',

  state: initalState,

  subscriptions: {
    associationRulesSetup({dispatch, history}) {
      history.listen( (location) => {
        if (location.pathname === '/alertConfig/alertAssociationRules') {
          dispatch({
            type: 'queryAssociationRules',
          })
        }
      })
    },
    editAssociationRulesSetup({dispatch, history}) {
      history.listen((location) => {
        if (pathToRegexp('/alertConfig/alertAssociationRules/ruleEditor/edit/:ruleId').test(location.pathname)) {
          const match = pathToRegexp('/alertConfig/alertAssociationRules/ruleEditor/edit/:ruleId').exec(location.pathname);
          const ruleId = match[1];
          dispatch({
            type: 'queryAssociationRuleView',
            payload: ruleId
          });
        }
      })
    }
  },

  effects: {
    *queryAssociationRules({payload}, {select, put, call}) {
      yield put({ type: 'toggleLoading', payload: true })

      var { orderBy, orderType } = yield select( state => {
        return {
          'orderBy': state.alertAssociationRules.orderBy,
          'orderType': state.alertAssociationRules.orderType
        }
      })

      if (payload !== undefined && payload.orderType !== undefined) {
        orderType = payload.orderType;
        orderBy = payload.orderBy;
      }

      const params = {
        orderType: orderType,
        orderBy: orderBy
      }

      const ruleResult = yield call(queryRulesList, params);
      yield put({type: 'clear'});
      if (ruleResult.result) {
        const groupList = yield groupSort()(ruleResult.data, 'type')
        yield put({ type: 'setRulesListData', payload: {
          associationRules: groupList,
          associationRulesTotal: ruleResult.data.length,
          orderBy: orderBy,
          orderType: orderType
        }})
      } else {
        yield message.error(window.__alert_appLocaleData.messages[ruleResult.message], 2)
      }

      yield put({ type: 'toggleLoading', payload: false })

    },
    // 编辑查询
    *queryAssociationRuleView({payload}, {select, put, call}) {
      if (payload !== undefined) {
        const viewResult = yield call(viewRule, payload)
        if (viewResult.result) {
          yield put({
            type: 'setCurrent',
            payload: viewResult.data || {}
          })
        } else {
          yield message.error(window.__alert_appLocaleData.messages[viewResult.message], 3)
        }
      } else {
        console.error('ruleId is null')
      }
    },
    // 更改状态
    *changeStatus({payload}, {select, put, call}) {
      if (payload !== undefined && payload.ruleId !== undefined && payload.status !== undefined) {
        const ruleResult = yield call(changeRuleStatus, payload.ruleId)
        if (ruleResult.result) {
          yield put({
            type: 'changeRuleStatus',
            payload: {
              id: payload.ruleId,
              status: payload.status
            }
          })
        } else {
          yield message.error(window.__alert_appLocaleData.messages[ruleResult.message], 2)
        }
      } else {
        console.error('changeStatus infomation is null')
      }
    },
    // 删除规则
    *deleteRule({payload}, {select, put, call}) {
      const currentDeleteRule = yield select((state) => state.alertAssociationRules.currentDeleteRule);
      if (currentDeleteRule.id !== undefined) {
        const deleteResult = yield call(deleteRule, currentDeleteRule.id)
        if (deleteResult.result) {
          yield put({
            type: 'deleteRuleOperate',
            payload: currentDeleteRule.id
          })
        } else {
          yield message.error(window.__alert_appLocaleData.messages[deleteResult.message], 2)
        }
      } else {
        console.error('deleteId is null')
      }
    },
    //orderList排序
    *orderList({payload}, {select, put, call}) {
      yield put({
        type: 'queryAssociationRules',
        payload: {
          orderBy: payload.orderBy,
          orderType: payload.orderType
        }
      })
    },
    //orderByTittle
    *orderByTittle({payload}, {select, put, call}) {
      const { orderType } = yield select( state => {
        return {
          'orderType': state.alertAssociationRules.orderType,
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
        yield put({ type: 'queryAssociationRules' })
      } else {
        console.error('orderBy error')
      }
    },

    // 获取 chatops 群组
    *getRooms({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(getChatOpsOptions ,params);
      // const result = {
      //   result: true,
      //   data: []
      // }
      if (result.result) {
        // debugger
        // message.success('保存成功');
        yield put({
          type: 'updateRooms',
          payload: {
            data: result.data || []
          }
        });
      }
    },

    // 获取 工单类型
    *getWos({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(getWos ,params);
      if (result.result) {
        yield put({
          type: 'updateWos',
          payload: {
            data: result.data
          }
        });
      } else {
        message.error(window.__alert_appLocaleData.messages[result.message], 3);
      }
    },

    // 获取 工单映射配置
    *getshowITSMParam({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(getshowITSMParam ,params);
      if (result.result) {
        yield put({
          type: 'updateITSMParam',
          payload: {
            data: result.data.json
          }
        });
      } else {
        message.error(window.__alert_appLocaleData.messages[result.message], 3);
      }
    },

    // 获取用户
    *getUsers({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(getUsers ,params);
      if (result.result) {
        // message.success('保存成功');
        yield put({
          type: 'updateUsers',
          payload: {
            data: result.data
          }
        });
      } else {
        message.error(window.__alert_appLocaleData.messages[result.message], 3);
      }
    },

    // 获取映射字段
    *getField({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(getField ,params);
      if (result.result) {
        // debugger
        yield put({
          type: 'updateField',
          payload: {
            data: result.data
          }
        });
      } else {
        message.error(window.__alert_appLocaleData.messages[result.message], 3);
      }
    },

    // 获取维度
    *queryAttributes({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(queryAttributes ,params);
      if (result.result) {
        yield put({
          type: 'updateAttributes',
          payload: {
            data: result.data
          }
        });
      } else {
        message.error(window.__alert_appLocaleData.messages[result.message], 3);
      }
    },

    // 获取来源
    *querySource({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(querySource ,params);
      if (result.result) {
        yield put({
          type: 'updateSource',
          payload: {
            data: result.data
          }
        });
      } else {
        message.error(window.__alert_appLocaleData.messages[result.message], 3);
      }
    },

    // 保存规划
    *createRule({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(createRule ,params);
      if (result.result) {
        // message.success('保存成功');
        yield put(routerRedux.goBack());
        // yield put({type: 'clear'});
      } else {
        message.error(window.__alert_appLocaleData.messages[result.message], 3);
      }
    },
  },

  reducers: {
    // 加载状态
    toggleLoading(state, {payload: isLoading}) {
      return { ...state, isLoading }
    },
    // 排序
    toggleOrder(state, {payload}) {
      return { ...state, ...payload }
    },
    // 列表数据
    setRulesListData(state, {payload}) {
      return { ...state, ...payload }
    },
    // 转换展开状态
    spreadGroup(state, { payload }) {
      const { associationRules } = state;
      const newData = associationRules.map( (group) => {
        if (group.classify == payload) {
          group.isGroupSpread = !group.isGroupSpread;
        }
        return group
      })
      return { ...state, associationRules: newData }
    },
    // 收拢
    noSpreadGroup(state, { payload }) {
      const { associationRules } = state;
      const newData = associationRules.map( (group) => {
        if (group.classify == payload) {
          group.isGroupSpread = false;
        }
        return group
      })
      return { ...state, associationRules: newData }
    },


    // 更新用户列表
    updateUsers(state, { payload }) {
      const { users } = state;
      return { ...state, users: payload.data }
    },

    // 更改状态
    changeRuleStatus(state, { payload: {id, status} }) {
      const { associationRules } = state;
      const newData = associationRules.map( (item) => {
        item.children.length > 0 && item.children.map( (childrenItem) => {
          if (childrenItem.id == id) {
            childrenItem.flag = status
          }
        })
        return item;
      })
      return { ...state, associationRules: newData }
    },
    // 删除
    deleteRuleOperate(state, { payload }) {
      const { associationRules } = state;
      const newData = associationRules.map( (item) => {
        let temp = item.children.filter( (childrenItem) => {
          return childrenItem.id !== payload
        })
        item.children = temp
        return item;
      })
      return { ...state, associationRules: newData, isShowDeleteModal: false, currentDeleteRule: {} }
    },
    setCurrent(state, { payload }) {
      return { ...state, currentEditRule: payload }
    },
    updateSource(state, {payload}) {
      return { ...state, source: payload.data }
    },
    updateAttributes(state, {payload}) {
      return { ...state, attributes: payload.data }
    },
    updateField(state, {payload}) {
      return { ...state, field: payload.data }
    },
    updateRooms(state, {payload}) {
      // debugger
      return { ...state, rooms: payload.data }
    },
    updateWos(state, {payload}) {
      return { ...state, wos: payload.data }
    },
    updateITSMParam(state, {payload}) {
      // debugger
      return { ...state, ITSMParam: payload.data }
    },
    clear(state, {payload}) {
      return { ...state, currentEditRule: {}, ITSMParam: '' }
    },
    toggleDeleteModal(state, {payload: {currentDeleteRule, isShowDeleteModal}}) {
      return { ...state, currentDeleteRule, isShowDeleteModal }
    }
  },
}
