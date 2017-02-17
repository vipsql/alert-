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
          app.model(require('./models/alertManage'))
          cb(null, {component: require('./routes/alertManage')})
        })
      },
      childRoutes: [
        {
          path: 'alertManage',
          name: 'alertManage',

          getComponent (nextState, cb) {
            require.ensure([], require => {
              app.model(require('./models/alertManage'))
              cb(null, require('./routes/alertManage'))
            })
          }
        },
        {
          path: 'alertManage/:alertClassify/:alertList',
          name: 'alertList',
          getComponent(nextState, cb) {
            require.ensure([], require => {
              app.model(require('./models/alertOperation'))
              app.model(require('./models/tagsListFilter'))
              app.model(require('./models/alertDetail'))
              app.model(require('./models/alertList'))
              cb(null, require('./routes/alertList'))
            })
          }

        },
        {
          path: 'alertQuery',
          name: 'alertQuery',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              app.model(require('./models/alertQuery'))
              cb(null, require('./routes/alertQuery'))
            })
          }
        }, {
          path: 'alertConfig',
          name: 'alertConfig',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              app.model(require('./models/alertConfig'))
              cb(null, require('./routes/alertConfig'))
            })
          }
        }, {
          path: 'watchManage',
          name: 'watchManage',
          getComponent (nextState, cb) {
            require.ensure([], require => {
              app.model(require('./models/watchManage'))
              cb(null, require('./routes/watchManage'))
            })
          }
        }
      ]
    }
  ]

  return <Router history={history} routes={routes} />
}
