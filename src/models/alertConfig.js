import { queryConfigAplication, changeAppStatus, deleteApp, typeQuery, add, update, view} from '../services/alertConfig'
import {parse} from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';

const initalState ={

  isLoading: false,
  applicationType: undefined, // 接入还是接出
  UUID: undefined, // UUID

  applicationTypeData: [
    {
      appType: '监控类',
      children: [
        {
          "id": "58c6817f5b71a79b448ccee8",
          "name": "Moniter",
          "type": "0",
          "appType": "监控类"
        },
        {
          "id": "58c6817f5b71a73b448ccee8",
          "name": "Rest",
          "type": "0",
          "appType": "监控类"
        }
      ]
    },
    {
      appType: '自动化类',
      children: [
        {
          "id": "58c681cd5b71a73b048cceea",
          "name": "ChatOps",
          "type": "1",
          "appType": "自动化类"
        },
        {
          "id": "58c681cd5b71a73b448cceea",
          "name": "ITSM",
          "type": "1",
          "appType": "自动化类"
        }
      ]
    }
  ], // 配置种类
  currentOperateAppType: {}, //配置的应用详情
  currentEditApp: {}, // 编辑的应用

  isShowTypeModal: false, // 配置的modal
  isShowDeteleModal: false, // 删除的modal
  currentDeleteApp: {}, // 删除操作的app

  columns: [{
    key: 'displayName',
    title: '显示名'
  }, {
    key: 'name',
    title: '应用名称'
  }, {
    key: 'createDate',
    title: '添加时间',
    order: true
  }, {
    key: 'status',
    title: '是否开启',
    order: true
  }, {
    key: 'operation',
    title: '操作',
  }],

  applicationData: [
    {
      "id": "58c7b19f5b71a7397c7fc1e9",
      "tenant": "82f4dd1075454c0090969cdbdea28b8e",
      "status": 1,
      "integration": "shell",
      "applyType": {
        "id": "58c6817f5b71a73b448ccee8",
        "name": "rest",
        "type": "0",
        "appType": "监控类"
      },
      "displayName": "基础资源监控报警",
      "appKey": "aaaaaa",
      "type": 0,
      "builtIn": 1,
      "createDate": 1489482143206
    },
    {
      "id": "58c7b1b35b71a7397c7fc1ea",
      "tenant": "82f4dd1075454c0090969cdbdea28b8e",
      "status": 0,
      "integration": "shelsssssl",
      "applyType": {
        "id": "58c6817f5b71a73b448ccee8",
        "name": "rest",
        "type": "0",
        "appType": "监控类"
      },
      "displayName": "rest测试",
      "appKey": "khsadhasjhkjhfas",
      "type": 0,
      "builtIn": 1,
      "createDate": 1489482163782
    },
  ],

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
          console.log(appId)
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
      if (payload !== undefined) {
        yield put({ type: 'initalAddAppView', payload: {isShowTypeModal: false, appTypeId: payload, UUID: undefined}}) // isShowTypeModal -> false, currentOperateAppType -> Object
      } else {
        console.error('appTypeId is null')
      }
    },
    // 通过编辑进入详情页
    *editApplicationView({payload}, {select, put, call}) {
      if (payload !== undefined) {
        const viewResult = yield call(update, payload)
        if (viewResult.result) {
          yield put({
            type: 'setCurrent',
            payload: viewResult.data || {}
          })
        } else {
          yield message.error(`viewResult.message`, 3)
        }
      } else {
        console.error('appId is null')
      }
    },
    // 新增应用
    *addApplication({payload}, {select, put, call}) {
      const { UUID, currentOperateAppType } = yield select( state => {
        return {
          'UUID': state.alertConfig.UUID,
          'currentOperateAppType': state.alertConfig.currentOperateAppType
        }
      })

      if (payload !== undefined && payload.displayName !== undefined) {
        if (UUID === undefined) {
          yield message.error(`请先生成AppKey`, 3)
        }
        const addResult = yield call(add, {
          status: 1, // 默认启用
          integration: '',
          displayName: payload.displayName,
          applyType:{
            ...currentOperateAppType
          },
          type: currentOperateAppType.type,
          appKey: UUID
        })
        if (addResult.result) {
          yield message.success('应用添加成功', 3)
          yield put(routerRedux.goBack());
        } else {
          yield message.error(`addResult.message`, 3)
        }
      } else {
        console.error('displayName is null')
      }
    },
    // 编辑
    *editApplication({payload}, {select, put, call}) {
      const { UUID, currentEditApp } = yield select( state => {
        return {
          'UUID': state.alertConfig.UUID,
          'currentEditApp': state.alertConfig.currentEditApp
        }
      })

      if (payload !== undefined && payload.displayName !== undefined) {
        if (UUID === undefined) {
          yield message.error(`请先生成AppKey`, 3)
        }
        const editResult = yield call(update, {
          id: currentEditApp.id,
          status: currentEditApp.status,
          integration: currentEditApp.integration,
          displayName: payload.displayName,
          applyType:{
            ...currentEditApp['applyType']
          },
          type: currentEditApp.type,
          appKey: UUID
        })
        if (editResult.result) {
          yield message.success('应用编辑成功', 3)
          yield put(routerRedux.goBack());
        } else {
          yield message.error(`editResult.message`, 3)
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
        type,
        orderType,
        orderBy
      }

      // if (payload !== undefined) {
      //   const appResult = yield call(queryConfigAplication, params)
      //   if (appResult.result) {
      //     yield put({ type: 'setApplicationData', payload: {
      //       applicationData: appResult.data || [],
      //       applicationType: type,
      //       orderBy: orderBy,
      //       orderType: orderType
      //     }})
      //   } else {
      //     yield message.error(`${appResult.message}`, 2)
      //   }
      // } else {
      //   console.error('config type can not be undefined')
      // }

      yield put({ type: 'toggleLoading', payload: false })
    },
    // 查询配置种类
    *queryAplicationType({payload}, {select, put, call}) {
      if (payload !== undefined) {
        yield put({ type: 'toggleTypeModal', payload: true })
        // const typeResult = yield call(typeQuery, payload)
        // if (typeResult.result) {
        //   yield put({
        //     type: 'openTypeModal',
        //     payload: {
        //       modalStatus: true,
        //       applicationTypeData: typeResult.data,
        //     }
        //   })
        // } else {
        //   yield message.error(`${typeResult.message}`, 2)
        // }
      } else {
        console.error('配置类型不能为空')
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
          yield message.error(`${statusResult.message}`, 2)
        }
      } else {
        console.error('更改状态的相关信息为空')
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
          yield message.error(`${deleteResult.message}`, 2)
        }
      } else {
        console.error('应用为空')
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
        console.error('orderBy有误')
      }
    }
  },

  reducers: {
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
      return { ...state, isShowTypeModal, UUID, currentOperateAppType: newObj}
    },
    // 回显
    setCurrent(state, { payload }) {
      return { ...state, currentEditApp: payload, UUID: payload.appKey }
    },
    // 打开配置modal
    openTypeModal(state, { payload: { applicationTypeData, modalStatus}}) {
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
      return { ...state, applicationTypeData: newArr, isShowTypeModal: modalStatus }
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
      return { ...state, applicationData: newData }
    },
    setUUID(state, { payload }) {
      return { ...state, UUID: payload }
    }
  },


}
