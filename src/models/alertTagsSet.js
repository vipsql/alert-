import {parse} from 'qs'
import { tagsView } from '../services/alertManage.js'
import { getTagsByUser, getAllTags, setUserTags } from '../services/alertTags.js'
import { message } from 'antd';
import CodeWords from '../codewords.json'

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
      // search all tags
      //const { userId } = yield select( state => ({'userId': state.app.userId}))
      const allTags = yield getAllTags();

      if (typeof allTags !== 'undefined' && allTags.length !== 0) {
        yield put({
          type: 'setCurrentTags',
          payload: allTags || []
        })
        // search selected tags
        const selectedTags = yield getTagsByUser();

        if (typeof selectedTags !== 'undefined') {
          yield put({
            type: 'setCurrentSelectTags',
            payload: selectedTags
          })
          // filter tags
          yield put({type: 'filterInitalTags'})
          yield put({type: 'toggleTagsModal', payload: true})
        } else {
          console.error('查询用户已选择标签错误');
        }
      } else {
        console.error('查询所有标签错误');
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

        yield put({ type: 'alertManage/toggleAlertSet', payload: true })

      } else {
        console.error('查询用户标签错误');
      }

    },
    // commit tagIds by set modal
    *addAlertTags ({payload}, {select, put, call}) {
      //const { userId } = yield select( state => ({'userId': state.app.userId}))
      yield put({
        type: 'filterCommitTagsByTagList'
      })

      const { commitTagIds } = yield select( state => {
        return {
          'commitTagIds': state.alertTagsSet.commitTagIds
        }
      })

      const postResult = yield setUserTags({'tagIdList': commitTagIds});

      if (postResult) {
        yield message.success('标签保存成功');
      } else {
        yield message.error('标签未保存成功');
      }

      yield put({
        type: 'alertManage/queryAlertDashbord',
        payload: {
          tagIds: commitTagIds
        }
      })

      yield put({ type: 'alertManage/toggleAlertSet', payload: true })
      yield put({ type: 'toggleTagsModal', payload: false })

    },
    // close modal
    *closeModal({payload}, {select, put, call}) {
      yield put({ type: 'toggleTagsModal', payload: payload })
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
      const arr = payload.map( (group) => {
        group.name = group.keyName;
        delete group.keyName;
        group.values = group.tags;
        delete group.tags;
        group.values.map( (tag) => {
          if (tag.key == 'severity' || tag.key == 'status') {
            tag.name = CodeWords[tag.key][tag.value]
          } else {
            tag.name = tag.value;
          }
          delete tag.value;
          return tag
        })
        return group
      })

      return { ...state, currentTagsList: arr }
    },
    // 保存当前选择的标签列表(注意这里仅仅是保存，没有像setCurrentTags作数据过滤)
    setCurrentSelectTags(state, { payload: currentSelectTags }) {
      return { ...state, currentSelectTags }
    },
    // 过滤初始化数据
    filterInitalTags(state, { payload }) {
      const { currentSelectTags, currentTagsList } = state;
      let num = 0;
      if (typeof currentSelectTags !== 'undefined' && currentSelectTags.length !== 0) {
        currentTagsList.forEach( (tagGroup) => {
          currentSelectTags.forEach( (tag, index) => {
            if (tagGroup.key === tag.key) {
              tagGroup.values.forEach( (item) => {
                if (item.id === tag.id) {
                  item.selected = true;
                }
              })
            }
            num = index + 1;
          })
        })
        return { ...state, currentTagsList, selectedTagsNum: num }
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
        tagsGroup.values.forEach( (tag) => {
          if (tag.selected) {
            newCommitTagIds.push(tag.id);
          }
        })
      })
      return { ...state, commitTagIds: newCommitTagIds }
    },
    // 标签选择
    changSelectTag(state, { payload: currentSelectId }){
      const { currentTagsList, selectedTagsNum } = state;
      let newTagsNum = selectedTagsNum;
      const newList = currentTagsList.map( (item) => {
        item.values.map( (tag) => {
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
    // 重置选择
    resetSelected(state) {
      const { currentTagsList } = state;
      const newList = currentTagsList.map( (item) => {
        item.values.map( (tag) => {
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
