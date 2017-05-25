import React from 'react'
import {Router} from 'dva/router'
import App from './routes/app'

export default function({history, app}) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute(nextState, cb) {
        require.ensure([], require => {
          cb(null, {component: require('./routes/alertManage')})
        }, 'alertManage')
      },
      childRoutes: [
        {
          path: 'alertManage',
          name: 'alertManage',
          getComponent (nextState, cb) {
            cb(null, require('./routes/alertManage'))
            require.ensure([], require => {
              let isLoadModal = false
              app._models.forEach(function(ele) {
                if(ele.namespace == 'alertManage'){
                  isLoadModal = true
                }

              });
              if(!isLoadModal){
               app.model(require('./models/alertManage'))
              }
            },'alertManage')
          }
        }, {
          path: 'alertManage/:alertClassify/:alertList',
          name: 'alertList',
          getComponent(nextState, cb) {
            require.ensure([], require => {

              cb(null, require('./routes/alertList'))
            }, 'alertList')
          },
          onLeave(){
            // 删除可视化分组的本地存储
            localStorage.removeItem('__alert_visualAnalyze_gr4') 
            try{
                // 每次离开记录从热图那边的轨迹
                let gr1 = JSON.parse(localStorage.getItem('__alert_visualAnalyze_gr1')) 
                // 用户路径记录
                let userRecordKey 
                const gr1keys = gr1.map((item) => {
                  return item.key
                })
                userRecordKey = gr1keys.join()
                const userRecordVal = {
                  gr2key: localStorage.getItem('__alert_visualAnalyze_gr2'),
                  gr3key: localStorage.getItem('__alert_visualAnalyze_gr3')
                }
                localStorage.setItem(userRecordKey, JSON.stringify(userRecordVal))
                
              }catch(e){
                throw new Error(e)
            }
          }

        }, {
          path: 'alertQuery',
          name: 'alertQuery',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertQuery'))
            }, 'alertQuery')
          }
        }, {
          path: 'alertConfig',
          name: 'alertConfig',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertConfig'))
            }, 'alertConfig')
          }
        },
        {
          path: 'alertConfig/alertAssociationRules',
          name: 'alertAssociationRules',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertAssociationRules'))
            }, 'alertAssociationRules')
          }
        },
        { // 临时添加路由，规则编辑页面
          path: 'alertConfig/alertAssociationRules/ruleEditor',
          name: 'ruleEditor',
          childRoutes: [
            {
              path: 'add',
              name: 'addRuleEditor',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  cb(null, require('./routes/ruleEditor'))
                }, 'ruleEditor')
              }
            },
            {
              path: 'edit/:ruleId',
              name: 'editRuleEditor',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  cb(null, require('./routes/ruleEditor'))
                }, 'ruleEditor')
              }
            },
          ]
        },
        {
          path: 'alertConfig/alertApplication',
          name: 'alertApplication',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertApplication'))
            }, 'alertApplication')
          }
        },
        {
          path: 'alertConfig/alertApplication/applicationView',
          name: 'applicationView',
          childRoutes: [
            {
              path: 'add/:typeId',
              name: 'addApplicationView',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  cb(null, require('./components/applicationView/add'))
                }, 'addApplicationView')
              }
            }, {
              path: 'edit/:appId',
              name: 'editApplicationView',
              getComponent(nextState, cb) {
                require.ensure([], require => {
                  cb(null, require('./components/applicationView/edit'))
                }, 'editApplicationView')
              }
            }
          ]
        }, {
          path: 'watchManage',
          name: 'watchManage',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/watchManage'))
            }, 'alertConfig')
          }
        }
      ]
    }
  ]

  return <Router history={history} routes={routes}/>
}
