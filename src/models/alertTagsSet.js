import {parse} from 'qs'
import { tagsView } from '../services/alertManage.js'
import { getTagsByUser, getAllTags, setUserTags } from '../services/alertTags.js'

const initialState = {
  tagNum: 0,
  selectedTagsNum: 0,
  currentTagsList: [],
  currentSelectTags: [],
  commitTagIds: [],
  modalVisible: false
}

export default {
  namespace: 'alertTagsSet',

  state: initialState,

  subscriptions: {

  },

  effects: {
    *openFocusModal({payload}, {select, put, call}) {
      yield put({type: 'tagsAllView'})
      yield put({type: 'tagSelectedView'})
      yield put({type: 'filterInitalTags'})
      yield put({type: 'toggleTagsModal', payload: true})
    },
    // search all tags
    *tagsAllView({payload}, {select, put, call}) {
      const allTags = yield getAllTags();
      if (typeof allTags.data !== 'undefined' && allTags.length !== 0) {
        yield put({
          type: 'setCurrentTags',
          payload: allTags.data
        })
      } else {
        console.error(allTags.message);
      }
    },
    // search selected tags
    *tagSelectedView({payload}, {select, put, call}) {
      const { userId } = yield select( state => ({'userId': state.app.userId}))
      console.log(userId)
      const selectedTags =yield getTagsByUser(userId);
      if (typeof selectedTags.data !== 'undefined') {
        yield put({
          type: 'setCurrentSelectTags',
          payload: selectedTags.data || []
        })
      } else {
        console.error(selectedTags.message);
      }
    },
    // inital dashbord when isSet is true
    *queryDashbordBySetted({payload: userId}, {select, put, call}) {
      const selectedTags = yield getTagsByUser(userId)
      if (typeof selectedTags.data !== 'undefined') {
        yield put({
          type: 'filterCommitTags',
          payload: selectedTags.data || []
        })
      } else {
        console.error(selectedTags.message);
      }

      const { commitTagIds } = yield select( state => {
        return {
          'commitTagIds': state.alertTagsSet.commitTagIds
        }
      })

      yield put({
        type: 'alertManage/queryAlertDashbord',
        payload: {
          tagIds: commitTagIds
        }
      })
    },
    // commit tagIds by set modal
    *addAlertTags ({payload}, {select, put, call}) {
      const { userId } = yield select( state => ({'userId': state.app.userId}))
      yield put({
        type: 'filterCommitTagsByTagList'
      })

      const { commitTagIds } = yield select( state => {
        return {
          'commitTagIds': state.alertTagsSet.commitTagIds
        }
      })

      const result = yield setUserTags({'userId': userId, 'tagIdList': commitTagIds});
      console.log(result);
      if (result) {

      }

      yield put({
        type: 'alertManage/queryAlertDashbord',
        payload: {
          tagIds: commitTagIds
        }
      })

      yield put({ type: 'alertManage/toggleAlertSet', payload: true })
      yield put({ type: 'toggleTagsModal', payload: false })
      yield put({ type: 'clear' })

    }
  },

  reducers: {

    // 切换标签设置框显示状态
    toggleTagsModal(state, { payload: modalVisible }){
      return { ...state, modalVisible }
    },
    // 保存当前标签列表并做格式处理
    setCurrentTags(state, { payload }) {
      let current = [];
      payload.forEach( (tag) => {
        if (current.length === 0) {
          current.push({
            key: tag.key,
            name: tag.keyName,
            tags: [
              {
                id: tag.id,
                name: tag.value,
                selected: false
              }
            ]
          })
        } else {
          current.forEach( (tagGroup) => {
            if (tagGroup.key === tag.key) {
              tagGroup.tags.push({
                id: tag.id,
                name: tag.value,
                selected: false
              })
            } else {
              current.push({
                key: tag.key,
                name: tag.keyName,
                tags: [
                  {
                    id: tag.id,
                    name: tag.value,
                    selected: false
                  }
                ]
              })
            }
          })

        }
      })
      return { ...state, currentTagsList: current }
    },
    // 保存当前选择的标签列表(注意这里仅仅是保存，没有像setCurrentTags作数据过滤)
    setCurrentSelectTags(state, { payload }) {
      return { ...state, currentSelectTags: payload }
    },
    // 过滤初始化数据
    filterInitalTags(state, { payload }) {
      const { currentSelectTags, currentTagsList } = state;
      if (typeof currentSelectTags !== 'undefined' && currentSelectTags.length !== 0) {
        currentTagsList.forEach( (tagGroup) => {
          currentSelectTags.forEach( (tag) => {
            if (tagGroup.key === tag.key) {
              tagGroup.tags.forEach( (item) => {
                if (item.id === tag.id) {
                  item.selected = true;
                }
              })
            }
          })
        })
        return { ...state, currentTagsList }
      } else {
        return { ...state }
      }
    },
    // 过滤commitTagIds的数据
    filterCommitTags(state, { payload }) {
      if (typeof payload !== 'undefined' && payload.length !== 0) {
        const newCommitTagIds = payload.map( item => {
          return item.id
        } )
        return { ...state, commitTagIds: newCommitTagIds }
      } else {
        return { ...state }
      }
    },
    // 过滤commitTagIds的数据(关注设置时)
    filterCommitTagsByTagList(state, { payload }) {
      let newCommitTagIds = [];
      const { currentTagsList } = state;
      currentTagsList.forEach( (tagsGroup) => {
        tagsGroup.tags.forEach( (tag) => {
          if (tag.selected) {
            newCommitTagIds.push(tag.id);
          }
        })
      })
      return { ...state, ommitTagIds: newCommitTagIds }
    },
    // 标签选择
    changSelectTag(state, { payload: currentSelectId }){
      const { currentTagsList, selectedTagsNum } = state;
      let newTagsNum = selectedTagsNum;
      const newList = currentTagsList.map( (item) => {
        item.tags.map( (tag) => {
          if (typeof currentSelectId !== 'undefined' && tag.id == currentSelectId) {
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
