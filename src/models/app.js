import {queryAlertDashbord} from '../services/app'
import {parse} from 'qs'

export default {
  namespace: 'app',
  state: {
    isFold: false,
    isShowMask: true // 遮罩层
  },
  subscriptions: {
    setup({dispatch}){
      dispatch({
        type: 'queryAlertDashbord'
      })
    }
  },
  effects: {
    *queryAlertDashbord ({
      payload
    }, {put, call}) {

      const data = yield call(queryAlertDashbord, parse(payload))
      if(data.isSet){
        yield put({
          type: 'showAlertManage',
        })
      }
    }
  },
  reducers: {
    showAlertManage(state){

        return {
          ...state,
          isShowMask: false
        }
    },
    handleFoldMenu(state){
      return {
        ...state,
        isFold: !state.isFold
      }
    },
    focusSet(state){
      return {
        ...state,
        isShowMask: false
      }
    }


  }
}
