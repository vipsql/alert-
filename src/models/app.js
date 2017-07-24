import { getUserInformation, getWebNotification } from '../services/app'
import { isSetUserTags } from '../services/alertTags.js'
import { loopWebNotification as loop } from '../utils/index.js'
import { parse } from 'qs'
import { message } from 'antd'


const initialState = {
  isFold: false, //false展开
  isShowMask: false, // 遮罩层
  notifies: [], // 声音记录
  userInfo: JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO')) || {}
}

export default {
  namespace: 'app',

  state: initialState,

  subscriptions: {
    loginSetup({ dispatch, history }) {
      history.listen((location) => {
        if (location.pathname === '/alertManage' || location.pathname === '/') {
          dispatch({
            type: 'beforeHomePage'
          })
          loop(function() {
            dispatch({type: 'getNotifies'})
          }, 30000) // 默认半分钟轮询一次
        }
      })
    },
  },

  effects: {
    *beforeHomePage({ payload }, { put, call, select }) {
      // const userInfo = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'))
      // if (!userInfo) {
        const infoResult = yield getUserInformation()
        if (infoResult.result) {
          yield put({ type: 'setUserInfo', payload: infoResult.data })
          yield localStorage.setItem('UYUN_Alert_USERINFO', JSON.stringify(infoResult.data))
        }
      //}
      yield put({ type: 'isSetTags' })
    },
    *getNotifies({ payload }, { put, call, select }) {
      const loop = yield call(getWebNotification, {
        size: 10 // 接收的告警上限
      })
      if (loop.result) {
        yield put({ type: 'setWebNotification', payload: loop.data || [] })
      } else {
        yield message.error(loop.message, 2)
      }
    },
    *isSetTags({ payload }, { put, call, select }) {
      const isSet = yield isSetUserTags()
      if (isSet.result && isSet.data) {
        yield put({
          type: 'showMask',
          payload: false
        })

      } else {
        yield put({
          type: 'showMask',
          payload: true
        })
      }
    },

  },
  reducers: {
    // 声音通知
    setWebNotification(state, { payload: notifies }) {
      return { ...state, notifies }
    },
    // 转化alertManage面板显示(通过设置isShowMask)
    showMask(state, { payload: isShowMask }) {
      return { ...state, isShowMask }
    },
    setUserInfo(state, { payload: userInfo }) {
      return { ...state, userInfo }
    },
    // 转换导航栏的展开
    handleFoldMenu(state) {
      return { ...state, isFold: !state.isFold }
    },
    clear(state) {
      return initialState
    }

  }
}
