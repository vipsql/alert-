import { login } from '../services/app'
//import pathToRegexp from 'path-to-regexp';
import {parse} from 'qs'


const initialState = {
  isLogin: false, // 是否登录
  userName: 'xuyh', // 前端先写死，后期改用localstorge来存储
  userId: 'admin',
  isFold: false, //false展开
  isShowMask: true // 遮罩层
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
      })
    },
  },

  effects: {
    *login({ payload }, { select, call, put }) {
      const app = yield select( state => state.app)

      if(!app.isLogin) {
        const userInfo = yield login(app.userName)

        if (userInfo.data.userId !== undefined) {
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
