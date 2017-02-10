import {parse} from 'qs'
import { tagsView, queryAlertDashbord } from '../services/alertManage.js'

const initialState = {
  tagNum: 0,
  selectedTagsNum: 0,
  currentTagsList: [],
  modalVisible: false
}

export default {
  namespace: 'alertTagsSet',

  state: initialState,

  subscriptions: {

  },

  effects: {
    *tagsContentView({payload}, {select, put, call}) {
      const { currentTagsList } = yield select( state => {
        return {
          'currentTagsList': state.alertTagsSet.currentTagsList,
        }
      })
      const { data } = yield tagsView();

      yield put({
        type: 'setCurrentTags',
        payload: data
      })
    },
    *queryAlertDashbord ({payload}, {select, put, call}) {
      const data = yield queryAlertDashbord()
      console.log(data);
      if(data.isSet){
        yield put({
          type: 'alertManage/setCurrentTreemap',
          payload: {
            currentDashbordData: data && data.data || [],
          }
        })
        yield put({
          type: 'alertManage/toggleAlertSet',
          payload: true
        })
      }

      yield put({
        type: 'toggleTagsModal',
        payload: false
      })
      yield put({
        type: 'clear',
      })
    }
  },

  reducers: {

    // 切换标签设置框显示状态
    toggleTagsModal(state, { payload: modalVisible }){
      return { ...state, modalVisible }
    },
    // 保存当前标签列表
    setCurrentTags(state, { payload: current }) {
      return { ...state, currentTagsList: current }
    },
    // 标签选择
    changSelectTag(state, { payload: currentSelectId }){
      const { currentTagsList, selectedTagsNum } = state;
      let newTagsNum = selectedTagsNum;
      const newList = currentTagsList.map( (item) => {
        item.tags.map( (tag) => {
          if (typeof currentSelectId !== 'undefined' && tag.key == currentSelectId) {
            if (!tag.selected && typeof selectedTagsNum === 'number') {
              newTagsNum = selectedTagsNum + 1;
            } else {
              newTagsNum = selectedTagsNum - 1;
            }
            tag.selected = !tag.selected;
          }
          return tag;
        })
        return item;
      })
      
      return { ...state, currentTagsList: newList, selectedTagsNum: newTagsNum }
    },
    // 重置选择(接口没对，暂时这么处理，后期修改)
    resetSelected(state) {
      const { currentTagsList } = state;
      const newList = currentTagsList.map( (item) => {
        item.tags.map( (tag) => {
          if (tag.selected) {
            tag.selected = !tag.selected;
          }
          return tag;
        })
        return item;
      })
      return { ...state, currentTagsList: newList, selectedTagsNum: 0 }
    },
    // 清除
    clear(state) {
      return { ...state, ...initialState }
    }
  }
}
