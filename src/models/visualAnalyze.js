import { queryTags, queryVisual, queryVisualRes, queryResInfo } from '../services/visualAnalyze'

import { queryConfigAplication, changeAppStatus, deleteApp, typeQuery, add, update, view} from '../services/alertConfig'
import {parse} from 'qs'
import { message } from 'antd'
import pathToRegexp from 'path-to-regexp';
import { routerRedux } from 'dva/router';

const initalState = {
   groupList: [
        {
            "tagValue":"文一路古翠路口2222",
            "severity":3,
            "values":[
                {
                    "value":"站点1",
                    "severity":2
                },
                {
                    "value":"站点2",
                    "severity":3
                }
            ]
        },
        {
            "tagValue":"文二路古翠路口",
            "severity":1,
            "values":[
                {
                    "value":"站点1",
                    "severity":2
                },
                {
                    "value":"站点2",
                    "severity":3
                }
            ]
        }
    ], 
   tags: [
     '层级',
     '站点',
     '供网店'
   ],
   isFirst: true, //是否首次进入
   resList: [
        {
            "tagValue":"Web-DB-01",
            "resources":[
                {
                    "resId":"e10adc3949ba59abbe56e057f20f88dd",
                    "resName":"CAD-APP-01",
            "severity":3
                },
                {
                    "resId":"f10adc3949ba59abbe56e057f20f88dd",
                    "resName":"GPS-01",
            "severity":2
                }
            ]
        },
        {
            "tagValue":"Web-DB-01",
            "resources":[
                {
                    "resId":"e10adc3949ba59abbe56e057f20f88dd",
                    "resName":"CAD-APP-01",
            "severity":3
                },
                {
                    "resId":"f10adc3949ba59abbe56e057f20f88dd",
                    "resName":"GPS-01",
            "severity":2
                }
            ]
        }
    ],
   isShowFouth: false,
   incidentGroup: true, 
   tagsLevel: 4
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
      let gr1 //分组1
      let gr2 //分组2
      
      const isFirst = yield select(state => {
        return state.visualAnalyze.isFirst
      })

      if(isFirst){
        const visualSelect = JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1"))
        tags = yield call(queryTags, {
            key: visualSelect.key,
            value: visualSelect.value
        })
        level = tags.level
        gr1 = tags.keys[0]
        gr2 = tags.keys[1]
        // 默认选择标签
        setGroups(tags.keys[0], tags.keys[1]) 
      }else{
        level = yield select(state => {
          const visualAnalyze = state.visualAnalyze

          return {
            level: visualAnalyze.level,
            tags: visualAnalyze.tags
          }
        })
      }

      // 如果标签层级小于4 
      if(level < 4){

      }else{
        let groupList = yield call(queryVisual, {
          "isIncidentGroup": true,
            tags: [
              visualSelect,
              {key: gr1,value: ""},
              {key: gr2,value: ""}
            ]
        })
        // 一级分组列表
        groupList = groupList.map( item => {
          item.isExpand = true
        })
       
      }
      

      // 更新分组数据
      yield put({
        type: 'updateGroupList',
        payload: {
          tags: tags.keys,
          level: tags.level,
          groupList
        }
      })
      

      

    },
    *queryVisualRes({payload: {gr2Val, gr3Val}}, {select, put, call}) {
      
      const result = yield call(queryVisualRes, {
          tags: [
            JSON.parse(localStorage.getItem("__alert_visualAnalyze_gr1")),
            {key: localStorage.getItem("__alert_visualAnalyze_gr2"), value: gr2Val},
            {key: localStorage.getItem("__alert_visualAnalyze_gr3"), value: gr3Val}
          ]
      })


    }
    
  },

  reducers: {
    expandList(state, { payload: {index, isExpand}}) {
      let newGroupList = state.groupList.slice(0)
      newGroupList[index]['isExpand'] = isExpand
      return { ...state, newGroupList }
    },
    updateGroupList(state, {payload: {tags, level, groupList}}){
      return {
        ...state,
        tags,
        level,
        groupList
      }
    },
    updateResList(state, {payload: {isShowFouth, resList}}){
      return {
        ...state,
        isShowFouth,
        resList
      }
    }
  } 
}
