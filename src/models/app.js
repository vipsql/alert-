import {queryAlertDashbord} from '../services/app'
import {parse} from 'qs'


const initialState = {
  isFold: false, //false展开
  isShowMask: true // 遮罩层
}

export default {
  namespace: 'app',

  state: initialState,

  subscriptions: {
  
  },
  effects: {
    
  },
  reducers: {
    // 转化alertManage面板显示(通过设置isShowMask)
    showAlertManage(state, {payload: isShowMask}){
        return { ...state, isShowMask }
    },
    // 转换导航栏的展开
    handleFoldMenu(state){
      return { ...state, isFold: !state.isFold }
    },
    clear(state) {
      return initialState
    }

  }
}
