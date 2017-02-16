// import {login, userInfo, logout} from '../services/alertManage'
import {parse} from 'qs'

export default {
  namespace: 'alertList',
  state: {
    isRefresh: false, //是否实时更新
    tagsFilter: [
      {jb: [1,2,3]}
    ]

  },
  reducers: {
    showLoading(state){
      return {...state, loading: true}
    },
    initAlertList(state, action) {
      return { ...state, ...action.payload, loading: false}
    }
  },
  effects: {

  },


}
