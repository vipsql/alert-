// import {login, userInfo, logout} from '../services/alertManage'
import {parse} from 'qs'

export default {
  namespace: 'alertListTable',
  state: {
    gridWidth: 100,
    isGroup: true,
    minuteToWidth: 5, //以分钟单位计算间隔
    startTime: 1487031735817,
    endTime: 1487035335817

  },
  subscriptions: {
    setup({dispatch}) {
      dispatch({
        type: 'queryAlertListTime',
        payload: {
          curPage: 1
        }
      })
    }
  },
  reducers: {
    setTimeLineWidth(state,{payload: {gridWidth,minuteToWidth}}){
      return{
        ...state,
        gridWidth,
        minuteToWidth
      }
    }
  },
  effects: {

  },


}
