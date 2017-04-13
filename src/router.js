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
          getComponent(nextState, cb) {
            require.ensure([], require => {
              // app.model(require('./models/alertManage'))
              cb(null, require('./routes/alertManage'))
            }, 'alertManage')
          }
        }, {
          path: 'alertManage/:alertClassify/:alertList',
          name: 'alertList',
          getComponent(nextState, cb) {
            require.ensure([], require => {

              cb(null, require('./routes/alertList'))
            }, 'alertList')
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
<<<<<<< HEAD
        }, { // 临时添加路由，规则编辑页面
          path: 'alertConfig/alertApplication/ruleEditor',
          name: 'ruleEditor',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/ruleEditor'))
            }, 'ruleEditor')
          }
        }, {
          path: 'alertConfig/:alertApplication',
=======
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
        {
          path: 'alertConfig/alertApplication',
>>>>>>> fa45d9fe69fdce6a8774c5ed93776f5903f37ad5
          name: 'alertApplication',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertApplication'))
            }, 'alertApplication')
          }
<<<<<<< HEAD
        }, {
          path: 'alertConfig/:alertApplication/:applicationView',
=======
        },
        {
          path: 'alertConfig/alertApplication/applicationView',
>>>>>>> fa45d9fe69fdce6a8774c5ed93776f5903f37ad5
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
