import React from 'react'
import {Router} from 'dva/router'
import App from './routes/app'

export default function ({history, app}) {
  const routes = [
    {
      path: '/',
      component: App,
      getIndexRoute (nextState, cb) {
        require.ensure([], require => {
          cb(null, {component: require('./routes/alertManage')})
        },'alertManage')
      },
      childRoutes: [
        {
          path: 'alertManage',
          name: 'alertManage',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              // app.model(require('./models/alertManage'))
              cb(null, require('./routes/alertManage'))
            },'alertManage')
          }
        },
        {
          path: 'alertManage/:alertClassify/:alertList',
          name: 'alertList',
          getComponent(nextState, cb) {
            require.ensure([], require => {

              cb(null, require('./routes/alertList'))
            },'alertList')
          }

        },
        {
          path: 'alertQuery',
          name: 'alertQuery',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertQuery'))
            },'alertQuery')
          }
        }, 
        {
          path: 'alertConfig',
          name: 'alertConfig',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertConfig'))
            },'alertConfig')
          }
        },
        {
          path: 'alertConfig/:alertApplication',
          name: 'alertApplication',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              cb(null, require('./routes/alertApplication'))
            }, 'alertApplication')
          }
        }, 
        {
          path: 'watchManage',
          name: 'watchManage',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              app.model(require('./models/watchManage'))
              cb(null, require('./routes/watchManage'))
            },'alertConfig')
          }
        }
      ]
    }
  ]

  return <Router history={history} routes={routes} />
}
