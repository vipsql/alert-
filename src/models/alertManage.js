import { queryDashbord } from '../services/alertManage'
import { isSetUserTags } from '../services/alertTags.js'
import { message } from 'antd'
import {parse} from 'qs'

const initialState = {
    isSetAlert: false, // 是否设置过告警标签
    hideAlertSetTip: true, // 设置提示false有提示
    modalVisible: false,
    currentDashbordData: undefined,
    oldDashbordDataMap: undefined,
    isNeedRepaint: true, // 是否需要重绘
    isLoading: true, //加载
    selectedTime: 'lastOneHour', // 选择的最近时间
    selectedStatus: 'NEW', // 选择的过滤状态
    isFullScreen: false, //是否全屏
    isFixed: true, //是否固定
    levels: { }
}

export default {
  namespace: 'alertManage',

  state: initialState,

  subscriptions: {
    alertManageSetup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/alertManage' || location.pathname === '/') {
          dispatch({
            type: 'alertManageSetup'
          })
        }
      })
    }
  },

  effects: {
    *alertManageSetup({payload}, {put, call, select}) {
      let { selectedTime, selectedStatus } = yield select( state => {
        return {
          'selectedTime': state.alertManage.selectedTime,
          'selectedStatus': state.alertManage.selectedStatus,
        }
      })
      const isSet = yield isSetUserTags()
      if(isSet.result && isSet.data) {
        yield put({
          type: 'queryAlertDashbord',
          payload: {
            selectedTime: selectedTime,
            selectedStatus: selectedStatus
          }
        })
        yield put({
          type: 'toggleAlertSetTip',
          payload: true
        })
        yield put({
          type: 'toggleAlertSet',
          payload: true
        })
      } else {
        yield put({
          type: 'toggleAlertSetTip',
          payload: false
        })
        yield put({
          type: 'toggleAlertSet',
          payload: false
        })
      }
    },
    *queryAlertDashbord({payload}, {call, put, select}) {

      let { selectedTime, selectedStatus, isFixed } = yield select( state => {
        return {
          'selectedTime': state.alertManage.selectedTime,
          'selectedStatus': state.alertManage.selectedStatus,
          'isFixed': state.alertManage.isFixed
        }
      })

      if (payload !== undefined && payload.selectedTime !== undefined) {
        selectedTime = payload.selectedTime
      }

      if (payload !== undefined && payload.selectedStatus !== undefined) {
        selectedStatus = payload.selectedStatus
      }

      const params = {
        timeBucket: selectedTime,
        status: selectedStatus
      }

      const treemapData = yield queryDashbord(params)

      if (treemapData.result) {
        let filterData = [];
        let index = 0;
        if (treemapData.data && treemapData.data.picList && treemapData.data.picList.length !== 0) {
          let dashbordData = treemapData.data.picList
          // 使用JSON方法进行深克隆
          dashbordData = JSON.parse(JSON.stringify(dashbordData))

          dashbordData.forEach( (item) =>{
            index ++;
            if(item.children){
              item.children.forEach((childItem) => {
                if(isFixed) {
                  childItem.fixedValue = 1 * ((item.children.length + 1) / item.children.length)
                  item.fixedValue = (item.fixedValue ? item.fixedValue : 0) + ((item.children.length + 1) / item.children.length)
                }
                // 保存真实数据修复显示tip 告警数不正确bug
                childItem.trueVal =  childItem.value;
                // 防止path重复（当标签对应的拼音一样可能会导致path重复，会导致一些格子不显示）
                childItem.path = childItem.path + "_" + index;
                // childItem.id = "label_" + index;
                index ++;
              })
              // item.fixedValue = item.children.length
            }

          })

          filterData = yield dashbordData.filter( item => item['path'] != 'status' )
        }

        yield put({
          type: 'setCurrentTreemap',
          payload: {
            currentDashbordData: filterData || [],
            isLoading: false,
            selectedTime: selectedTime,
            selectedStatus: selectedStatus,
            isNeedRepaint: payload && payload.isNeedRepaint
          }
        })

        yield put({
          type: 'setLevels',
          payload: {
            levels: {
              totalOkCnt: treemapData.data ? treemapData.data.totalOkCnt : 0, // 恢复
              totalCriticalCnt: treemapData.data ? treemapData.data.totalCriticalCnt : 0, // 紧急
              totalWarnCnt: treemapData.data ? treemapData.data.totalWarnCnt : 0, // 警告
              totalInfoCnt: treemapData.data ? treemapData.data.totalInfoCnt : 0, // 提醒
            }
          }
        })

      } else {
        yield message.error(window.__alert_appLocaleData.messages[treemapData.message], 2)
      }
    }
  },

  reducers: {
    // 显示标签设置
    toggleAlertSet(state, { payload: isSetAlert }){
      return { ...state, isSetAlert }
    },
    // 显示treemap
    setCurrentTreemap(state, { payload: {currentDashbordData, isLoading, selectedTime, selectedStatus, isNeedRepaint} }){
      const oldDashbordData = state.currentDashbordData || [];
      let oldDashbordDataMap = {};
      let newDashbordDataMap = {};
      oldDashbordData.forEach((parentNode, index) => {
          parentNode.children.forEach((childNode) => {
              oldDashbordDataMap[childNode.id] = childNode;
          })
      })
      currentDashbordData.forEach((parentNode, index) => {
          parentNode.children.forEach((childNode) => {
              newDashbordDataMap[childNode.id] = childNode;
          })
      })
      // 判断标签是否发生变化，是否需要重绘
      if(typeof isNeedRepaint === 'undefined') {
        currentDashbordData.forEach((parentNode, index) => {
            parentNode.children.forEach((childNode) => {
                if(!oldDashbordDataMap[childNode.id]) {
                  isNeedRepaint = true;
                }
            })
        })
        oldDashbordData.forEach((parentNode, index) => {
            parentNode.children.forEach((childNode) => {
                if(!newDashbordDataMap[childNode.id]) {
                  isNeedRepaint = true;
                }
            })
        })
      }

      return { ...state, oldDashbordDataMap, isNeedRepaint, currentDashbordData, isLoading, selectedTime, selectedStatus}
    },
    setSelectedTime(state, {payload: selectedTime}) {
      return { ...state, selectedTime}
    },
    setSelectedStatus(state, {payload: selectedStatus}) {
      return { ...state, selectedStatus}
    },
    // 设置告警状态
    setLevels(state, {payload}) {
      return { ...state, ...payload }
    },
    // 隐藏标签设置提示
    toggleAlertSetTip(state, { payload: hideAlertSetTip }){
      return { ...state, hideAlertSetTip }
    },
    // 设置全屏
    setFullScreen(state){
      return {...state, isFullScreen: !state.isFullScreen}
    },
    // 设置布局（固定大小和自动布局）
    setLayout(state,{payload: isFixed}){
      const cloneData = JSON.parse(JSON.stringify(state.currentDashbordData))

      if(isFixed == '0'){
          cloneData.forEach( (item) =>{
            if(item.children){
              item.children.forEach((childItem) => {
                childItem.fixedValue = 1
                // 保存真实数据修复显示tip 告警数不正确bug
                childItem.trueVal =  childItem.value
                item.fixedValue = (item.fixedValue ? item.fixedValue : 0) + 1
              })
              // item.fixedValue = item.children.length
            }

        })
      }else{
        cloneData.forEach( (item) =>{
          if(item.children){
              item.children.forEach((childItem) => {
                delete childItem.fixedValue
              })
            }
          delete item.fixedValue
        })
      }

      return {...state, currentDashbordData: cloneData, isFixed: isFixed == '0' ? true : false}

    }
  }

}
