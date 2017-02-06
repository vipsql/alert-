import {queryAlertDashbodr} from '../services/app'
import {parse} from 'qs'

export default {
  namespace: 'app',
  state: {
    isFold: false,
    isShowMask: true // 遮罩层
  },

  effects: {

  },
  reducers: {
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
