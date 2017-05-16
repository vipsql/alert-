import { login, getUserInformation } from '../services/app'
import { isSetUserTags } from '../services/alertTags.js'
//import pathToRegexp from 'path-to-regexp';
import {parse} from 'qs'
import { message } from 'antd'


const initialState = {
  isLogin: false, // 是否登录
  userName: 'admin', // 前端先写死，后期改用localstorge来存储
  userId: 'admin', // localStorage.getItem('userId') || '',
  isFold: false, //false展开
  isShowMask: false // 遮罩层
}

export default {
  namespace: 'app',

  state: initialState,

  subscriptions: {
    loginSetup({dispatch, history}) {
      history.listen((location) => {
        if (location.pathname === '/login') {
          dispatch({
            type: 'login'
          })
        }
        if (location.pathname === '/alertManage' || location.pathname === '/') {
          dispatch({
            type: 'isSetTags'
          })
        }
      })
    },
  },

  effects: {
    *login({ payload }, { select, call, put }) {
      const app = yield select( state => state.app)

      if(!app.isLogin) {
        const userInfo = yield login(app.userName)

        if (userInfo.data !== undefined && userInfo.data.userId !== undefined) {
          yield put({
            type: 'setUser',
            payload: {
              isLogin: true,
              userId: userInfo.data
            }
          })
          yield localStorage.setItem('userId', userInfo.data.userId);
        } else {
          console.error('用户Id未获取');
        }
      }
    },
    *isSetTags({payload}, {put, call, select}) {

      const { userId } = yield select( state => {
        return {
          'userId': state.app.userId,
        }
      })

      const isSet = yield isSetUserTags(userId)
      if(isSet.result && isSet.data) {
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
    // *getUserInfo({payload}, {put, call, select}) {
    //   const userInfo = JSON.parse(localStorage.getItem('UYUN_Alert_USERINFO'))
    //   if (userInfo === null) {
    //     const infoResult = yield getUserInformation()
    //     if (infoResult.result) {
    //       yield localStorage.setItem('UYUN_Alert_USERINFO', JSON.stringify(infoResult.data))
    //     } else {
    //       yield message.error(window.__alert_appLocaleData.messages[infoResult.message], 2)
    //     }
    //   }
    // }

  },
  reducers: {
    // 转化alertManage面板显示(通过设置isShowMask)
    showMask(state, {payload: isShowMask}){
        return { ...state, isShowMask }
    },
    // 转换导航栏的展开
    handleFoldMenu(state){
      return { ...state, isFold: !state.isFold }
    },
    // 将用户Id保存下来
    setUser(state, {payload}){
      return { ...state, ...payload }
    },
    clear(state) {
      return initialState
    }

  }
}
