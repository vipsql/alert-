import { queryDashbord } from '../services/alertManage'
import { isSetUserTags } from '../services/alertTags.js'
import { message } from 'antd'
import {parse} from 'qs'

const initialState = {
    isSetAlert: false, // 是否设置过告警标签
    hideAlertSetTip: true, // 设置提示false有提示
    modalVisible: false,
    currentDashbordData: undefined,
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

      const isSet = yield isSetUserTags()
      if(isSet.result && isSet.data) {
        yield put({
          type: 'queryAlertDashbord',
          payload: {
            selectedTime: 'lastOneHour',
            selectedStatus: 'NEW'
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
        if (treemapData.data && treemapData.data.picList && treemapData.data.picList.length !== 0) {
          let dashbordData = treemapData.data.picList
          if(isFixed){
              // 使用JSON方法进行深克隆
              dashbordData = JSON.parse(JSON.stringify(dashbordData))
             
              dashbordData.forEach( (item) =>{
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
            
          }
          filterData = yield dashbordData.filter( item => item['path'] != 'status' )
        }

        yield put({
          type: 'setCurrentTreemap',
          payload: {
            currentDashbordData: filterData || [],
            isLoading: false,
            selectedTime: selectedTime,
            selectedStatus: selectedStatus
          }
        })

        yield put({
          type: 'setLevels',
          payload: {
            levels: {
              totalOkCnt: treemapData.data.totalOkCnt, // 恢复
              totalCriticalCnt: treemapData.data.totalCriticalCnt, // 紧急
              totalWarnCnt: treemapData.data.totalWarnCnt, // 警告
              totalInfoCnt: treemapData.data.totalInfoCnt // 提醒
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
    setCurrentTreemap(state, { payload: {currentDashbordData, isLoading, selectedTime, selectedStatus} }){
      return { ...state, currentDashbordData, isLoading, selectedTime, selectedStatus}
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
