import { queryTags, queryVisual, queryVisualRes, queryResInfo, queryAlertList } from '../services/visualAnalyze'

import { queryConfigAplication, changeAppStatus, deleteApp, typeQuery, add, update, view} from '../services/alertConfig'
import {parse} from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

const initalState = {
   groupList: [], 
   tags: [],
  //  isFirst: false, //是否从其他页面进入
   resList: [],
   isShowFouth: false,
   incidentGroup: true, 
   tagsLevel: 1,
   tasgFitler: '',
   resInfo: [],
   alertList: []

}

// 保存标签分组选择
const setGroups = (gr2, gr3) =>{
  gr2 && localStorage.setItem("__alert_visualAnalyze_gr2", gr2)
  gr3 && localStorage.setItem("__alert_visualAnalyze_gr3", gr3)
}


export default {
  namespace: 'visualAnalyze',

  state: initalState,

  subscriptions: {
    init({ dispatch, history }) {
      history.listen((location, state) => {
        if (pathToRegexp('/alertManage/:alertClassify/:alertList').test(location.pathname)) {
          dispatch({
            type: 'queryVisualList',
            payload: {isFirst: true}
          });
        }
      });
    },
  },

  effects: {
    *queryVisualList({payload}, {select, put, call}) {
      
      // {"key":"source", "value": "古荡派出所"}
      let level
      let tags
      let gr2 //分组1
      let gr3 //分组2
      
      // const isFirst = yield select(state => {
      //   return state.visualAnalyze.isFirst
      // })
      const {isFirst, showIncidentGroup} = payload
      
      const visualSelect = JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1"))
      
      // isFirst表示从告警管理页面跳过来 否则为select切换选择
      if(isFirst){
        // 初始化状态
        yield put({
          type: 'init',
          payload: initalState
        })
        const tagsData = yield call(queryTags, {
            key: visualSelect.key,
            value: visualSelect.value
        })
        
        if(tagsData.result){
          
          const data = tagsData.data 
          level = data.level
          tags = data.keys
          gr2 = tags[0]
          gr3 = tags[1]
          // 默认选择标签
          setGroups(gr2, gr3) 
          yield put({
            type: 'updateSelect',
            payload: {
              tags,
              level
            }
          })
        }

      }else{
        const {l,t} = yield select(state => {
          const visualAnalyze = state.visualAnalyze

          return {
            l: visualAnalyze.tagsLevel,
            t: visualAnalyze.tags
          }
        })
        level = l
        tags = t
      }
      
      let groupList = []
      
      const  isShowIncidentGroup = yield select(state => {
        return state.visualAnalyze.incidentGroup
      })
      
      
      // 如果标签层级小于4 
      if(level < 4){
        let val 
        const gr1 = JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1"))
        const gr2key = localStorage.getItem('__alert_visualAnalyze_gr2') ? localStorage.getItem('__alert_visualAnalyze_gr2') :tags[0]
        const gr3key = localStorage.getItem('__alert_visualAnalyze_gr3') ? localStorage.getItem('__alert_visualAnalyze_gr3') :tags[1]
        switch(level){
          case 1:
            val = [gr1]
            break;
          case 2:
              val = [gr1,{key: gr2key, value: ''}]
              break;
          case 3:
              val = [gr1,{key: gr2key, value: ''},{key: gr3key, value: ''}]
              break;
        }
        const res = yield call(queryVisualRes,{ tags: val})
        const resList = res.data
        if(res.result && resList.length > 0){
          yield put({
            type: 'updateResListDirectly',
            payload: {
              tagsLevel: level,
              isShowFouth: false,
              resList
            }
          })
        }

      }else{
        let groupListData = yield call(queryVisual, {
          "incidentGroup": showIncidentGroup !== undefined ? showIncidentGroup : isShowIncidentGroup,
            tags: [
              visualSelect,
              {key: localStorage.getItem('__alert_visualAnalyze_gr2'), value: ""},
              {key: localStorage.getItem('__alert_visualAnalyze_gr3'), value: ""}
            ]
        })
        if(groupListData.result){
          // 一级分组列表
          groupList = groupListData.data.map( item => {
             item.isExpand = true
             return item
          })
        }

         // 更新分组数据
        yield put({
          type: 'updateGroupList',
          payload: {
            groupList
          }
        })
       
      }
      
      
    },
    *queryVisualRes({}, {select, put, call}) {
      const gr4key = localStorage.getItem('__alert_visualAnalyze_gr4')
      const tags = yield select(state => {
          const visualAnalyze = state.visualAnalyze

          return visualAnalyze.tags
        })
      const gr3Val = localStorage.getItem('__alert_visualAnalyze_gr3Val')
      const res = yield call(queryVisualRes, {
          tags: [
            JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1")),
            {key: localStorage.getItem("__alert_visualAnalyze_gr2"), value: localStorage.getItem('__alert_visualAnalyze_gr2Val')},
            {key: localStorage.getItem("__alert_visualAnalyze_gr3"), value: gr3Val},
            {key: gr4key ? gr4key : tags[0], value: ''}
          ]
      })
      
      const resList = res.data
      if(res.result && resList.length > 0){
        yield put({
          type: 'updateResList',
          payload: {
            isShowFouth: true,
            tasgFitler: gr3Val,
            resList
          }
        })
      }


    },
    *queryResInfo({payload:{res}}, {select, put, call}){
      
       const resInfo = yield call(queryResInfo, {
          resName: res
      })
      if(resInfo.result){
        yield put({
          type: 'updateResInfo',
          payload: resInfo.data
        })
      }
    },
    *showAlertList({payload}, {select, put, call}){
      
      const alertList = yield call(queryAlertList, {
        resId: payload
      })
    //  const sa = [
    //         {id:'ssss',name:'ssssss',severity: '1'},
    //         {id:'ssss2',name:'ssssss2',severity: '0'}
    //       ]
      if(alertList.result){
        yield put({
          type: 'updateAlertList',
          payload: alertList.data
        })
      }
      
    }
    
  },

  reducers: {
    init(state, {payload: initalState}) {
      return {
        ...state,
        ...initalState
      }
    },
    
    expandList(state, { payload: {index, isExpand}}) {
      let newGroupList = state.groupList.slice(0)
      newGroupList[index]['isExpand'] = isExpand
      return { ...state, newGroupList }
    },
    updateAlertList(state,{payload: alertList }){
      return{
        ...state,
        alertList
      }
    },
    updateIncidentGroup(state,{payload: isChecked}){

        return {
          ...state,
          incidentGroup: isChecked
        }
    },
    updateGroupList(state, {payload: { groupList}}){
      return {
        ...state,
        groupList
      }
    },
    updateSelect(state,{payload: {tags,level}}){
      return {
        ...state,
        tags,
        tagsLevel: level
      }
    },
    updateResInfo(state, {payload}){
      return {
        ...state,
        resInfo: payload
      }
    },
    // 显示tags列表
    redirectTagsList(state){
      return {
        ...state,
        isShowFouth: false
      }
    },
    // 显示资源列表(有4层)
    updateResList(state, {payload: {isShowFouth,tasgFitler, resList}}){
      
      return {
        ...state,
        isShowFouth,
        tasgFitler,
        resList
      }
    },
     // 显示资源列表(少于4层)
    updateResListDirectly(state, {payload: {tagsLevel,isShowFouth, resList}}){
      
      return {
        ...state,
        tagsLevel,
        isShowFouth,
        resList
      }
    }
  } 
}