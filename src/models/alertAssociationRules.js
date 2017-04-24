import {parse} from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';
import { queryRulesList, createRule, getUsers } from '../services/alertAssociationRules';
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
      key: 'createPerson'
    },
    {
      key: 'status',
      order: true
    },
    {
      key: 'operation'
    }
  ],
  associationRulesTotal: 0,
  associationRules: [
    {
      ruleType: 0,
      id: '11',
      ruleName: '新告警通知',
      description: '这是一个描述',
      createPerson: '创建人',
      status: 0
    },
    {
      ruleType: 1,
      id: '21',
      ruleName: '新告警通知',
      description: '这是一个描述',
      createPerson: '创建人',
      status: 0
    },
    {
      ruleType: 2,
      id: '31',
      ruleName: '新告警通知',
      description: '这是一个描述',
      createPerson: '创建人',
      status: 0
    }
  ], // 配置规则列表
  orderBy: undefined, // 排序字段
  orderType: undefined, // 1 --> 升序
  users: [], // 用户列表
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

      const ruleResult = yield call(queryRulesList, params)
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
        message.error(result.message);
      }
    },

    // 保存规划
    *createRule({payload}, {select, put, call}) {
      const params = {
        ...payload
      };
      const result = yield call(createRule ,params);
      if (result.result) {
        message.success('保存成功');
      } else {
        message.error(result.message);
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
    }
  },
}
