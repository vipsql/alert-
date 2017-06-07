import {parse} from 'qs'
import { getField, getSource, getCMDBSource, getOID } from '../services/alertConfig'
import { message } from 'antd';
import { getUUID } from '../utils'

const initalState = {
  isShowTrapDeleteModal: false,
  operateDeleteRule: {},
  isShowTrapModal: false,
  trapUrl: 'alert.uyun.cn',
  appRules: [], // 规则
  filterSource: [], // fiter选项
  OIDList: [], // 精确匹配时的oid类
  operateType: undefined, // 操作类型
  operateAppRules: {}, // 操作的对象
  __matchProps: [], // 全量，不可重复
  __groupFieldProps: [], // 全量，不可重复
  __groupComposeProps: [], // 已映射字段 + 新字段名
  __mergeProps: [], // 如果选择entityName或者name + 新字段名
  __identifyProps: [], // 如果选择entityName或者entityAddr + 新字段名

}

export default {
  namespace: 'snmpTrapRules',

  state: initalState,

  effects: {
    // 新增规则 --> 点击新增
    *addRule({payload}, {select, put, call}) {
      const fields = yield call(getField);
      const source = yield call(getSource)
      const OID = yield call(getOID)
      if (!fields.result) {
        yield message.error(window.__alert_appLocaleData.messages[fields.message], 3);
      }
      if (!source.result) {
        yield message.error(window.__alert_appLocaleData.messages[source.message], 3);
      }
      if (!OID.result) {
        yield message.error(window.__alert_appLocaleData.messages[OID.message], 3);
      }
      yield put({
        type: 'addOperate',
        payload: {
          fields: fields.result ? fields.data : [],
          source: source.result ? source.data : [],
          OIDList: OID.result ? OID.data : [],
          operateType: 'add'
        }
      })
      yield put({
        type: 'toggleTrapModal',
        payload: true
      })
    },
    // 编辑规则 --> 点击编辑
    *editRule({payload}, {select, put, call}) {
      const fields = yield call(getField);
      const source = yield call(getSource)
      const OID = yield call(getOID)
      if (!fields.result) {
        yield message.error(window.__alert_appLocaleData.messages[fields.message], 3);
      }
      if (!source.result) {
        yield message.error(window.__alert_appLocaleData.messages[source.message], 3);
      }
      if (!OID.result) {
        yield message.error(window.__alert_appLocaleData.messages[OID.message], 3);
      }
      yield put({
        type: 'editOperate',
        payload: {
          id: payload,
          fields: fields.result ? fields.data : [],
          source: source.result ? source.data : [],
          OIDList: OID.result ? OID.data : [],
          operateType: 'edit'
        }
      })
      yield put({
        type: 'toggleTrapModal',
        payload: true
      })
    },
    // 删除规则 --> 点击删除
    *deleteRule({payload}, {select, put, call}) {
      const { operateDeleteRule } = yield select( state => {
        return {
          'operateDeleteRule': state.snmpTrapRules.operateDeleteRule,
        }
      })
      if (operateDeleteRule.id !== undefined) {
        yield put({
          type: 'deleteOperate',
          payload: {
            id: operateDeleteRule.id
          }
        })
      }
      yield put({
        type: 'toggleTrapDeleteModal',
        payload: {
            status: false,
        }
      })

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
    // 转换关闭弹窗状态，以及注入删除对象
    toggleTrapDeleteModal(state, {payload: {status, rule ={} }}) {
      return { ...state, isShowTrapDeleteModal: status, operateDeleteRule: rule }
    },
    // 转换modal状态
    toggleTrapModal(state, {payload: isShowTrapModal}) {
      return { ...state, isShowTrapModal }
    },
    // 配置页面的规则列表
    setAppRules(state, {payload: {appRules, trapUrl}}) {
      return { ...state, appRules, trapUrl }
    },
    // 新增打开modal时预处理数据
    addOperate(state, {payload: {fields, source, OIDList, operateType}}) {
      return {
        ...state,
        filterSource: source,
        __matchProps: fields,
        __groupFieldProps: fields,
        __groupComposeProps: [],
        __mergeProps: [],
        __identifyProps: [],
        operateAppRules: initalState.operateAppRules,
        operateType,
        OIDList
      }
    },
    // 编辑打开modal时预处理数据
    editOperate(state, {payload: {id, fields, source, OIDList, operateType}}) {
      const { appRules } = state;
      let operateAppRules = {};
      let selectedMatchFields = [];
      let selectedGroupFields = [];
      let codeProperties = [];
      let __matchProps = [].concat(fields);
      let __groupFieldProps = [].concat(fields);
      let __groupComposeProps = [];
      let __mergeProps = [];
      let __identifyProps = [];
      appRules.forEach( (rule, index) => {
        if (rule.id == id) {
          operateAppRules = rule;
          if (rule.dataSource === 2) {
            __matchProps.push('severity');
            __groupFieldProps.push('severity');
          }
          selectedMatchFields = Object.keys(operateAppRules.matchFields);
          selectedGroupFields = Object.keys(operateAppRules.groupFields);
          codeProperties = operateAppRules.properties;
        }
      })
      selectedMatchFields.length > 0 && selectedMatchFields.forEach( (field, index) => {
         if (field === 'name' || field === 'entityName') {
           __mergeProps.push(field)
         }
         if (field === 'entityAddr' || field === 'entityName') {
           __identifyProps.push(field)
         }
         __groupComposeProps.push(field);
         if (__matchProps.includes(field)) {
           __matchProps = __matchProps.filter( match => match !== field )
         }
      })
      selectedGroupFields.length > 0 && selectedGroupFields.forEach( (field, index) => {
         if ((field === 'name' || field === 'entityName') && !__mergeProps.includes(field)) {
           __mergeProps.push(field);
         }
         if ((field === 'entityAddr' || field === 'entityName') && !__identifyProps.includes(field)) {
           __identifyProps.push(field);
         }
         if (__groupFieldProps.includes(field)) {
           __groupFieldProps = __groupFieldProps.filter( match => match !== field )
         }
      })
      codeProperties.length > 0 && codeProperties.forEach( (property, index) => {
         __groupComposeProps.push(property.code);
         __mergeProps.push(property.code);
         __identifyProps.push(property.code);
      })

      return {
        ...state,
        filterSource: source,
        __matchProps,
        __groupFieldProps,
        __groupComposeProps,
        __mergeProps,
        __identifyProps,
        operateAppRules,
        operateType,
        OIDList
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