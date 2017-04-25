import {parse} from 'qs'
import { getField, getSource, getCMDBSource, getOID } from '../services/alertConfig'
import { message } from 'antd';
import { getUUID } from '../utils'

const initalState = {
  isShowTrapModal: false,
  appRules: [], // 规则
  filterSource: [], // fiter选项
  CMDBClass: [], // 绑定CMDB类
  OIDList: [], // 精确匹配时的oid类
  operateType: undefined, // 操作类型
  operateAppRules: {}, // 操作的对象
  __matchProps: [], //['description', 'source', 'tags'], // 查询得到的映射字段
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
      const CMDBSource = yield call(getCMDBSource)
      const OID = yield call(getOID)
      if (!fields.result) {
        yield message.error(window.__alert_appLocaleData.messages[fields.message], 3);
      }
      if (!source.result) {
        yield message.error(window.__alert_appLocaleData.messages[source.message], 3);
      }
      if (!CMDBSource.result) {
        yield message.error(window.__alert_appLocaleData.messages[CMDBSource.message], 3);
      }
      if (!OID.result) {
        yield message.error(window.__alert_appLocaleData.messages[OID.message], 3);
      }
      yield put({
        type: 'addOperate',
        payload: {
          fields: fields.result ? fields.data : [],
          source: source.result ? source.data : [],
          CMDBClass: CMDBSource.result ? CMDBSource.data : [],
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
      const CMDBSource = yield call(getCMDBSource)
      const OID = yield call(getOID)
      if (!fields.result) {
        yield message.error(window.__alert_appLocaleData.messages[fields.message], 3);
      }
      if (!source.result) {
        yield message.error(window.__alert_appLocaleData.messages[source.message], 3);
      }
      if (!CMDBSource.result) {
        yield message.error(window.__alert_appLocaleData.messages[CMDBSource.message], 3);
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
          CMDBClass: CMDBSource.result ? CMDBSource.data : [],
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
    addOperate(state, {payload: {fields, source, CMDBClass, OIDList, operateType}}) {
      return {
        ...state,
        filterSource: source,
        __matchProps: fields,
        __groupComposeProps: [],
        __mergeProps: [],
        operateAppRules: initalState.operateAppRules,
        operateType,
        CMDBClass,
        OIDList
      }
    },
    // 编辑打开modal时预处理数据
    editOperate(state, {payload: {id, fields, source, CMDBClass, OIDList, operateType}}) {
      const { appRules } = state;
      let operateAppRules = {};
      let selectedMatchFields = [];
      let selectedGroupFields = [];
      let __matchProps = [].concat(fields);
      let __groupComposeProps = [];
      let __mergeProps = [];
      appRules.forEach( (rule, index) => {
        if (rule.id == id) {
          operateAppRules = rule;
          selectedMatchFields = Object.keys(operateAppRules.matchFields);
          selectedGroupFields = Object.keys(operateAppRules.groupFields);
        }
      })
      selectedMatchFields.length > 0 && selectedMatchFields.forEach( (field, index) => {
         __groupComposeProps.push(field);
         if (__matchProps.includes(field)) {
           __matchProps = __matchProps.filter( match => match !== field )
         }
      })
      selectedGroupFields.length > 0 && selectedGroupFields.forEach( (field, index) => {
         if (__matchProps.includes(field)) {
           __matchProps = __matchProps.filter( match => match !== field )
         }
      })

      return {
        ...state,
        filterSource: source,
        __matchProps,
        __groupComposeProps,
        __mergeProps,
        operateAppRules,
        operateType,
        CMDBClass,
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