import {parse} from 'qs'
import { getField, getSource } from '../services/alertConfig'
import { message } from 'antd';
import { getUUID } from '../utils'

const initalState = {
  isShowTrapModal: false,
  appRules: [], // 规则
  filterSource: [], // fiter选项
  operateType: undefined, // 操作类型
  operateAppRules: {
      // "id": "12db4357920c4819bae6552aa83e61eb",
      // "tenant": "a10adc3949ba59abbe56e057f20f88aa",
      // "name": "新规则",
      // "description": "新规则描述",
      // "filterFields": [{
      //   "key": "Source Port",
      //   "value": "1.0.0.2.5.56",
      //   "ruleMatch": 3
      // },
      // {
      //   "key": "Source Port",
      //   "value": "1.0.0.8.9.5.12.6",
      //   "ruleMatch": 2
      // }],
      // "matchFields": {
      //   "enity_name": "1.0.0.3.5.6.3",
      //   "name": "1.2.3.5.89.7"
      // },
      // "groupFields": {
      //   "description": "$enity_name"
      // },
      // "properties": [{
      //   "code": "abc",
      //   "name": "ABC",
      //   "oid": "1.0.0.2.3"
      // }],
      // "mergeKey": "$enity_name"
  }, // 操作的对象
  __matchProps: [], //['description', 'source', 'tags'], // 查询得到的映射字段
  __groupFieldProps: [], //['source', 'tags'], // 字段组合_字段（映射剩下的那些）
  __groupComposeProps: [], //['enity_name', 'name'], // 字段组合_组合（已选择映射字段）
  __mergeProps: [], //['enity_name', 'name', 'description', 'source', 'tags', 'abc'], // 合并字段（映射字段 + 新字段）

}

export default {
  namespace: 'snmpTrapRules',

  state: initalState,

  effects: {
    // 新增规则 --> 点击新增
    *addRule({payload}, {select, put, call}) {
      const fields = yield call(getField);
      const source = yield call(getSource)
      if (fields.result) {
        yield put({
          type: 'addOperate',
          payload: {
            fields: fields.data || [],
            source: source.result ? source.data : [],
            operateType: 'add'
          }
        })
      } else {
        yield message.error(window.__alert_appLocaleData.messages[fields.message], 3);
      }
      yield put({
        type: 'toggleTrapModal',
        payload: true
      })
    },
    // 编辑规则 --> 点击编辑
    *editRule({payload}, {select, put, call}) {
      const fields = yield call(getField);
      const source = yield call(getSource)
      if (fields.result) {
        yield put({
          type: 'editOperate',
          payload: {
            id: payload,
            fields: fields.data || [],
            source: source.result ? source.data : [],
            operateType: 'edit'
          }
        })
      } else {
        yield message.error(window.__alert_appLocaleData.messages[fields.message], 3);
      }
      yield put({
        type: 'toggleTrapModal',
        payload: true
      })
    },
    // 删除规则 --> 点击删除
    *deleteRule({payload}, {select, put, call}) {
      if (payload !== undefined) {
        yield put({
          type: 'deleteOperate',
          payload: {
            id: payload
          }
        })
      }
    },
    // 保存规则 --> 点击保存
    *saveRule({payload: appRule }, {select, put, call}) {
      const { operateType, operateAppRules } = yield select( state => {
        return {
          'operateType': state.snmpTrapRules.operateType,
          'operateAppRules': state.snmpTrapRules.operateAppRules
        }
      })
      if (operateType === 'add') {
        appRule.id = yield getUUID(32);
        yield put({
          type: 'saveOperateByadd',
          payload: appRule
        })
      } else if (operateType === 'edit') {
        yield put({
          type: 'saveOperateByedit',
          payload: {
            id: operateAppRules.id,
            appRule: appRule
          }
        })
      }
      yield put({
        type: 'toggleTrapModal',
        payload: false
      })
    },
    // 取消保存 --> 点击取消
    *cancelSave({payload}, {select, put, call}) {

    }

  },

  reducers: {
    // 转换modal状态
    toggleTrapModal(state, {payload: isShowTrapModal}) {
      return { ...state, isShowTrapModal }
    },
    // 配置页面的规则列表
    setAppRules(state, {payload: appRules}) {
      return { ...state, appRules }
    },
    // 新增打开modal时预处理数据
    addOperate(state, {payload: {fields, source, operateType}}) {
      return {
        ...state,
        filterSource: source,
        __matchProps: fields,
        __groupFieldProps: fields,
        __groupComposeProps: [],
        __mergeProps: fields,
        operateAppRules: initalState.operateAppRules,
        operateType
      }
    },
    // 编辑打开modal时预处理数据
    editOperate(state, {payload: {id, fields, source, operateType}}) {
      const { appRules } = state;
      let operateAppRules = {};
      let selectedMatchFields = [];
      let selectedGroupFields = [];
      let __matchProps = [];
      let __groupFieldProps = [];
      let __groupComposeProps = [];
      let __mergeProps = [].concat(fields);
      appRules.forEach( (rule, index) => {
        if (rule.id == id) { 
          operateAppRules = rule;
          selectedMatchFields = Object.keys(operateAppRules.matchFields);
          selectedGroupFields = Object.keys(operateAppRules.groupFields);
          Object.keys(rule.matchFields).length !== 0 && Object.keys(rule.matchFields).forEach( (field, index) => {
            __groupComposeProps.push(field);
          })
          Object.keys(rule.properties).length !== 0 && Object.keys(rule.properties).forEach( (item, index) => {
            __mergeProps.push(item.code);
          })
        }
      })
      __groupFieldProps = fields.filter( (field, index) => {
        let status = true;
        __groupComposeProps.forEach( (select, index) => {
          if ( field == select ) { status = false; }
        })
        if (selectedGroupFields.length > 0) {
          selectedGroupFields.forEach( (key) => {
            if (key === field) { status = false; }
          })
        }
        return status
      })
      __matchProps = fields.filter( (field) => {
        let status = true;
        if (selectedMatchFields.length > 0) {
          selectedMatchFields.forEach( (key) => {
            if (key === field) { status = false; }
          })
        }
        return status
      })
      return {
        ...state,
        filterSource: source,
        __matchProps,
        __groupFieldProps,
        __groupComposeProps,
        __mergeProps,
        operateAppRules,
        operateType
      }
    },
    // 删除规则
    deleteOperate(state, {payload: { id }}) {
      const { appRules } = state;
      const newRules = appRules.filter( rule => rule.id !== id )
      return { ...state, appRules: newRules }
    },
    // 保存规则
    saveOperateByadd(state, {payload}) {
      const { appRules } = state;
      appRules.push(payload)
      return { ...state, appRules }
    },
    saveOperateByedit(state, {payload: { id, appRule }}) {
      const { appRules } = state;
      const newRules = appRules.map( (rule, index) => {
        if (rule.id === id) {
          return {
            id: rule.id,
            ...appRule
          }
        } else {
          return rule;
        }
      })
      return { ...state, appRules: newRules }
    }
  },

}