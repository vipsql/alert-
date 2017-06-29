import {parse} from 'qs'
import { tagsView } from '../services/alertManage.js'
import { getTagsByUser, setUserTags, getAllTagsKey, getTagValues} from '../services/alertTags.js'
import { message } from 'antd';

const initialState = {
  // --------------------------------
  modalVisible: false,
  commitTagIds: [], // 保存时的Ids
  tagsKeyList: [
    // {key: 'severity', keyName: '告警等级', tagSpread: true, selectedChildren: [{id: '1', name: '3'}]},
    // {key: 'status', keyName: '告警状态', tagSpread: false, selectedChildren: [{id: '2', name: '150'}]},
    // {key: 'source', keyName: '来源', tagSpread: false, selectedChildren: [{id: '3', name: '青山湖'}]}
  ], // 打开Modal时查询所有的key
  currentSelectTags: [/*{key: 'severity', value: '3'}, {key: 'status', value: '2'}, {key: 'source', value: '青山湖'}*/], // 已经选择的标签
  selectList: [/*{id: '11', key: 'aa', value: '标签1'}, {id: '21', key: 'aa', value: '标签2'}, {id: '31', key: 'aa', value: '标签3'}*/] // 模糊查询所匹配的内容
}

export default {
  namespace: 'alertTagsSet',

  state: initialState,

  subscriptions: {

  },

  effects: {
    /**
     *  查询所有标签的key + 填充已选择标签
     */
    *openSetModal({payload}, {select, put, call}) {
      // tags keys
      const allTagsKeys = yield call(getAllTagsKey)

      if (allTagsKeys.result) {
        // selected tags
        const selectedTags = yield getTagsByUser();
        if (selectedTags.result) {
          // filter tags
          yield put({
            type: 'initalSelectTags',
            payload: {
              tagskey: allTagsKeys.data || [],
              selectedTags: selectedTags.data || [],
            }
          })
          yield put({type: 'toggleTagsModal', payload: true})
        } else {
          yield message.error(window.__alert_appLocaleData.messages[selectedTags.message], 2);
        }
      } else {
        yield message.error(window.__alert_appLocaleData.messages[allTagsKeys.message], 2);
      }

    },
    /**
     *  查询标签对应的values
     */
    *queryTagValues({payload}, {select, put, call}) {
      if (payload !== undefined && payload.key !== undefined && payload.value !== undefined) {
        const tagValues = yield call(getTagValues, payload);
        if (!tagValues.result) {
          yield message.error(window.__alert_appLocaleData.messages[tagValues.message], 2);
        }
        yield put({
          type: 'setSelectList',
          payload: {
            selectList: tagValues.result ? tagValues.data : [],
            targetKey: payload.key
          }
        })
      } else {
        console.error('query params type error')
      }
    },
    // 保存标签 + 查询面板
    *addAlertTags ({payload}, {select, put, call}) {
      yield put({
        type: 'filterCommitTagsByTagList'
      })

      const { commitTagIds } = yield select( state => {
        return {
          'commitTagIds': state.alertTagsSet.commitTagIds
        }
      })

      const postResult = yield setUserTags({'tagIdList': commitTagIds});

      if (postResult.result) {
        yield message.success(window.__alert_appLocaleData.messages['constants.success'], 2);
      } else {
        yield message.error(window.__alert_appLocaleData.messages[postResult.message], 2);
      }

      yield put({
        type: 'alertManage/queryAlertDashbord',
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
    // 初始化数据
    initalSelectTags(state, {payload: {tagskey, selectedTags}}) {
      let newList = tagskey.filter( item => item.key !== 'status' ).map( (tagkey, index) => {
        tagkey.tagSpread = false
        tagkey.selectedChildren = []
        selectedTags.length > 0 && selectedTags.forEach( (tag, itemIndex) => {
          if (tagkey.key === tag.key) {
              tagkey.selectedChildren.push({id: tag.id, name: tag.value})
          }
        })
        return tagkey
      })
      return { ...state, tagsKeyList: newList, currentSelectTags: selectedTags}
    },
    // 单个删除标签
    closeOneItem(state, {payload: target}) {
      const { tagsKeyList } = state;
      let newList = tagsKeyList.map( (group, index) => {
        if (group.key === target.field) {
          let children = group.selectedChildren.filter( (child, itemIndex) => {
            return target.id !== child.id
          })
          group.selectedChildren = children;
          //group.tagSpread = false;
        }
        return group
      })
      return { ...state, tagsKeyList: newList }
    },
    // 删除一组标签
    closeAllItem(state, {payload: target}) {
      const { tagsKeyList } = state;
      let newList = tagsKeyList.map( (group, index) => {
        if (group.key === target.field) {
          group.selectedChildren = [];
          //group.tagSpread = false;
        }
        return group
      })
      return { ...state, tagsKeyList: newList }
    },
    // 重置
    resetItems(state, {payload: target}) {
      const { tagsKeyList } = state;
      let newList = tagsKeyList.map( (group, index) => {
        group.selectedChildren = [];
        group.tagSpread = false;
        return group
      })
      return { ...state, tagsKeyList: newList }
    },
    // 鼠标移开时触发
    mouseLeave(state, {payload: target}) {
      const { tagsKeyList } = state;
      let newList = tagsKeyList.map( (group, index) => {
        if (group.key === target.field) {
          group.tagSpread = false;
        }
        return group
      })
      return { ...state, tagsKeyList: newList }
    },
    // 键盘删除动作
    deleteItemByKeyboard(state, {payload: target}) {
      const { tagsKeyList } = state;
      let newList = tagsKeyList.map( (group, index) => {
        if (group.key === target.field) {
          group.selectedChildren = group.selectedChildren.slice(0, group.selectedChildren.length - 1)
        }
        return group
      })
      return { ...state, tagsKeyList: newList }
    },
    // 改变标签选择状态
    changeSelectedItem(state, {payload: {key, item}}) {
      const { tagsKeyList, selectList } = state;
      tagsKeyList.forEach( (group) => {
        if(group.key === key) {
          let compare = group.selectedChildren.map( i => i.name )
          if(compare.includes(item.value)) {
            group.selectedChildren = group.selectedChildren.filter( i => i.name !== item.value )
          } else {
            group.selectedChildren.push({ 'id': item.id, 'name': item.value })
          }
        }
      })
      selectList.forEach( (it) => {
        if(it.value === item.value) {
          if(typeof it.checked === 'undefined') {
            it.checked = true;
          } else {
            delete it.checked
          }
        }
      })
      return { ...state, tagsKeyList, selectList }
    },
    setSelectList(state, {payload: {selectList, targetKey}}) {
      const { tagsKeyList } = state;
      let newList = tagsKeyList.map( (group, index) => {
        group.tagSpread = false; // 其他key-value的可选标签都隐藏掉
        if (group.key === targetKey) {
          group.tagSpread = true;
          group.selectedChildren.forEach( (val) => {
            selectList.forEach( (select) => {
              if (select.value == val.name) {
                select.checked = true;
              }
            })
          })
        }
        return group
      })
      return { ...state, tagsKeyList: newList, selectList }
    },
    toggleTagsModal(state, { payload: modalVisible }){
      return { ...state, modalVisible }
    },
    // 过滤commitTagIds的数据(关注设置时)
    filterCommitTagsByTagList(state, { payload }) {
      let newCommitTagIds = [];
      const { tagsKeyList } = state;
      tagsKeyList.forEach( (tagsGroup) => {
        tagsGroup.selectedChildren.forEach( (tag) => {
            newCommitTagIds.push(tag.id);
        })
      })
      return { ...state, commitTagIds: newCommitTagIds }
    },
    // 清除
    clear(state) {
      return { ...state, ...initialState }
    }
  }
}
