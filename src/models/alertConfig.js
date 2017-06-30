import { queryConfigAplication, changeAppStatus, deleteApp, typeQuery, add, update, view, getTrapUrl} from '../services/alertConfig'
import {parse} from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

const initalState ={

  isLoading: false,
  applicationType: undefined, // 接入还是接出
  UUID: undefined, // UUID
  apikey: undefined,

  applicationTypeData: [], // 配置种类

  currentOperateAppType: {}, //配置的应用详情
  currentEditApp: {}, // 编辑的应用
  currentDisplayName: undefined, // 增加时点击生成UUID重新渲染需要保存displayname

  isShowTypeModal: false, // 配置的modal
  isShowDeteleModal: false, // 删除的modal
  currentDeleteApp: {}, // 删除操作的app

  columns: [{
    key: 'displayName',
  }, {
    key: 'name',
  }, {
    key: 'createDate',
    order: true
  }, {
    key: 'status',
    order: true
  }, {
    key: 'operation',
  }],

  applicationData: [],

  orderBy: undefined, // 排序字段
  orderType: undefined, // 1升序
}

export default {
  namespace: 'alertConfig',

  state: initalState,

  subscriptions: {
    alertAplicationSetup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/alertConfig/alertApplication') {
          dispatch({
            type: 'queryAplication',
            payload: {
              type: 0
            }
          })
        }
      })
    },
    addApplicationSetup({dispatch, history}) {
      history.listen((location) => {
        if (pathToRegexp('/alertConfig/alertApplication/applicationView/add/:typeId').test(location.pathname)) {
          const match = pathToRegexp('/alertConfig/alertApplication/applicationView/add/:typeId').exec(location.pathname);
          const appTypeId = match[1];
          dispatch({
            type: 'addApplicationView',
            payload: appTypeId
          })
        }
      })
    },
    editApplicationSetup({dispatch, history}) {
      history.listen((location) => {
        if (pathToRegexp('/alertConfig/alertApplication/applicationView/edit/:appId').test(location.pathname)) {
          const match = pathToRegexp('/alertConfig/alertApplication/applicationView/edit/:appId').exec(location.pathname);
          const appId = match[1];
          dispatch({
            type: 'editApplicationView',
            payload: appId
          })
        }
      })
    }
  },

  effects: {
    // 通过modal进入详情页
    *addApplicationView({payload}, {select, put, call}) {
      const app = yield select(state => state.app)
      const local = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'))
      if (payload !== undefined) {
        yield put({
          type: 'setApiKeys',
          payload: app.userInfo.apiKeys[0] || local.apiKeys[0] || undefined
        })
        yield put({ type: 'initalAddAppView', payload: {isShowTypeModal: false, appTypeId: payload, UUID: undefined}}) // isShowTypeModal -> false, currentOperateAppType -> Object
        const { currentOperateAppType } = yield select( state => {
          return {
            'currentOperateAppType': state.alertConfig.currentOperateAppType,
          }
        })
        // 如果是SNMP Trap
        switch(currentOperateAppType.name) {
          case 'SNMPTrap':
              const trapUrl = yield call(getTrapUrl)
              if (trapUrl.result) {
                yield put({ type: 'snmpTrapRules/setAppRules', payload: {trapUrl: trapUrl.data.url, appRules: []}})
              } else {
                yield message.error(window.__alert_appLocaleData.messages[trapUrl.message], 3)
              }
            break;
          default:
            break;
        }
      } else {
        console.error('appTypeId is null')
      }
    },
    // 通过编辑进入详情页
    *editApplicationView({payload}, {select, put, call}) {
      const app = yield select(state => state.app)
      const local = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'))
      if (payload !== undefined) {
        const viewResult = yield call(view, payload)
        if (viewResult.result) {
          yield put({
            type: 'setCurrent',
            payload: viewResult.data || {}
          })
          yield put({
            type: 'setApiKeys',
            payload: app.userInfo.apiKeys[0] || local.apiKeys[0] || undefined
          })
          if (viewResult.data.applyType !== undefined) {
            switch(viewResult.data.applyType.name) {
              case 'SNMPTrap':
                  const trapUrl = yield call(getTrapUrl)
                  if (trapUrl.result) {
                    yield put({ type: 'snmpTrapRules/setAppRules', payload: {trapUrl: trapUrl.data.url, appRules: viewResult.data.appRules || []}})
                  } else {
                    yield message.error(window.__alert_appLocaleData.messages[trapUrl.message], 3)
                  }
                break;
              default:
                break;
            }
          }
        } else {
          yield message.error(window.__alert_appLocaleData.messages[viewResult.message], 3)
        }
      } else {
        console.error('appId is null')
      }
    },
    // 新增应用
    *addApplication({payload}, {select, put, call}) {
      const { UUID, currentOperateAppType, appRules } = yield select( state => {
        return {
          'UUID': state.alertConfig.UUID,
          'currentOperateAppType': state.alertConfig.currentOperateAppType,
          'appRules': state.snmpTrapRules.appRules
        }
      })

      if (payload !== undefined && payload.displayName !== undefined) {
        if (UUID === undefined) {
          yield message.error(window.__alert_appLocaleData.messages['alertApplication.appKey.placeholder'], 3)
        }
        const params = {
          status: 1, // 默认启用
          integration: '',
          displayName: payload.displayName,
          applyType:{
            ...currentOperateAppType
          },
          type: currentOperateAppType.type,
          appKey: UUID
        }
        // 如果是SNMP Trap
        switch(currentOperateAppType.name) {
          case 'SNMPTrap':
              yield params.appRules = appRules;
            break;
          default:
            break;
        }
        const addResult = yield call(add, params)
        if (addResult.result) {
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3)
          yield put(routerRedux.goBack());
        } else {
          yield message.error(window.__alert_appLocaleData.messages[addResult.message], 3)
        }
      } else {
        console.error('displayName is null')
      }
    },
    // 编辑
    *editApplication({payload}, {select, put, call}) {
      const { UUID, currentEditApp, appRules } = yield select( state => {
        return {
          'UUID': state.alertConfig.UUID,
          'currentEditApp': state.alertConfig.currentEditApp,
          'appRules': state.snmpTrapRules.appRules
        }
      })

      if (payload !== undefined && payload.displayName !== undefined) {
        if (UUID === undefined) {
          yield message.error(window.__alert_appLocaleData.messages['alertApplication.appKey.placeholder'], 3)
        }
        const params = {
          id: currentEditApp.id,
          status: currentEditApp.status,
          integration: currentEditApp.integration,
          displayName: payload.displayName,
          applyType:{
            ...currentEditApp['applyType']
          },
          type: currentEditApp.type,
          appKey: UUID
        }
        // 如果是SNMP Trap
        switch(currentEditApp.applyType.name) {
          case 'SNMPTrap':
              yield params.appRules = appRules;
            break;
          default:
            break;
        }
        const editResult = yield call(update, params)
        if (editResult.result) {
          yield message.success(window.__alert_appLocaleData.messages['constants.success'], 3)
          yield put(routerRedux.goBack());
        } else {
          yield message.error(window.__alert_appLocaleData.messages[editResult.message], 3)
        }
      } else {
        console.error('displayName is null')
      }
    },
    // 查询
    *queryAplication({payload}, {select, put, call}) {

      yield put({ type: 'toggleLoading', payload: true })
      
      var { type, orderBy, orderType } = yield select( state => {
        return {
          'type': state.alertConfig.applicationType,
          'orderBy': state.alertConfig.orderBy,
          'orderType': state.alertConfig.orderType
        }
      })

      if (payload !== undefined && payload.type !== undefined) {
        type = payload.type;
      }

      if (payload !== undefined && payload.orderType !== undefined) {
        orderType = payload.orderType;
        orderBy = payload.orderBy;
      }

      const params = {
        type: type,
        sortType: orderType,
        orderBy: orderBy
      }

      const appResult = yield call(queryConfigAplication, params)
      if (appResult.result) {
        yield put({ type: 'setApplicationData', payload: {
          applicationData: appResult.data || [],
          applicationType: type,
          orderBy: orderBy,
          orderType: orderType
        }})
      } else {
        yield message.error(window.__alert_appLocaleData.messages[appResult.message], 2)
      }

      yield put({ type: 'toggleLoading', payload: false })
    },
    // 查询配置种类
    *queryAplicationType({payload}, {select, put, call}) {
      if (payload !== undefined) {
        yield put({ type: 'toggleTypeModal', payload: true })
        const typeResult = yield call(typeQuery, payload)
        if (typeResult.result) {
          yield put({
            type: 'openTypeModal',
            payload: {
              applicationTypeData: typeResult.data,
            }
          })
        } else {
          yield message.error(window.__alert_appLocaleData.messages[typeResult.message], 2)
        }
      } else {
        console.error('application type is null')
      }
    },
    // 更改启用状态
    *changeStatus({payload}, {select, put, call}) {
      if (payload !== undefined && payload.id !== undefined && payload.status !== undefined) {
        const statusResult = yield call(changeAppStatus, payload)
        if (statusResult.result) {
          yield put({ 
            type: 'changeAppStatus', 
            payload: {
              id: payload.id,
              status: payload.status
            }
          })
        } else {
          yield message.error(window.__alert_appLocaleData.messages[statusResult.message], 2)
        }
      } else {
        console.error('edit infomation is null')
      }
    },
    // 删除时的操作
    *deleteApp({payload}, {select, put, call}) {
      const { currentDeleteApp } = yield select( state => {
        return {
          'currentDeleteApp': state.alertConfig.currentDeleteApp,
        }
      })
      if (Object.keys(currentDeleteApp).length !== 0 && currentDeleteApp.id !== undefined) {
        const deleteResult = yield call(deleteApp, currentDeleteApp.id)
        if (deleteResult.result) {
          yield put({ 
            type: 'deleteApplication', 
            payload: currentDeleteApp.id
          })
        } else {
          yield message.error(window.__alert_appLocaleData.messages[deleteResult.message], 2)
        }
      } else {
        console.error('application is null')
      } 
    },
    //orderList排序
    *orderList({payload}, {select, put, call}) {
      yield put({ type: 'queryAplication', payload: {orderBy: payload.orderBy, orderType: payload.orderType } })
    },
    //orderByTittle
    *orderByTittle({payload}, {select, put, call}) {
      const { orderType } = yield select( state => {
        return {
          'orderType': state.alertConfig.orderType,
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
        yield put({ type: 'queryAplication' })
      } else {
        console.error('orderBy error')
      }
    }
  },

  reducers: {
    setApiKeys(state, { payload: apikey}) {
      return { ...state, apikey }
    },
    // 点开新增详情页面
    initalAddAppView(state, { payload: {isShowTypeModal, appTypeId, UUID}}) {
      const { applicationTypeData } = state;
      let newObj = {};
      applicationTypeData.forEach( (typeItem) => {
        typeItem.children.forEach( (item) => {
          if (item.id == appTypeId) {
            newObj = item;
          }
        })
      })
      return { ...state, isShowTypeModal, UUID, currentOperateAppType: newObj, currentDisplayName: undefined}
    },
    // 回显
    setCurrent(state, { payload }) {
      return { ...state, currentEditApp: payload, UUID: payload.appKey }
    },
    // 打开配置modal
    openTypeModal(state, { payload: { applicationTypeData}}) {
      let typeObj = {};
      let newArr = [];
      let keys = [];
      applicationTypeData.forEach( (typeItem) => {
        if (typeObj[typeItem.appType] !== undefined) {
          typeObj[typeItem.appType].push(typeItem)
        } else {
          typeObj[typeItem.appType] = [typeItem]
        }
      })
      keys = Object.keys(typeObj);
      keys.forEach( (key) => {
        newArr.push({
          appType: key,
          children: typeObj[key]
        })
      })
      return { ...state, applicationTypeData: newArr }
    },
    // 关闭modal
    toggleTypeModal(state, {payload: isShowTypeModal}) {
      return { ...state, isShowTypeModal }
    },
    // 关闭modal
    toggleDeleteModal(state, {payload: {applicationItem, status}}) {
      return { ...state, currentDeleteApp: applicationItem, isShowDeteleModal: status }
    },
    // 加载状态
    toggleLoading(state, {payload: isLoading}) {
      return { ...state, isLoading }
    },
    // 排序
    toggleOrder(state, {payload}) {
      return { ...state, ...payload }
    },
    // 存贮当前的data
    setApplicationData(state, {payload: { applicationData, applicationType, orderBy, orderType}}) {
      return { ...state, applicationData, applicationType, orderBy, orderType }
    },
    // 改变状态
    changeAppStatus(state, {payload: { id, status }}) {
      const { applicationData } = state;
      const newData = applicationData.map( (item) => {
        if (item.id == id) {
          item.status = + status 
        }
        return item;
      })
      return { ...state, applicationData: newData }
    },
    // 删除
    deleteApplication(state, { payload }) {
      const { applicationData } = state;
      const newData = applicationData.filter( (item) => {
        let status = true;
        if (item.id == payload) {
          status = false;
        }
        return status;
      })
      return { ...state, applicationData: newData, isShowDeteleModal: false}
    },
    setUUID(state, { payload: {UUID, currentDisplayName}}) {
      return { ...state, UUID: UUID, currentDisplayName: currentDisplayName}
    }
  },


}
