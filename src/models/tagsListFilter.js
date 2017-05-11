import {parse} from 'qs'
import pathToRegexp from 'path-to-regexp';
import { getAllTagsKey, getTagValues} from '../services/alertListTags.js'
import { message } from 'antd'

const initalState = {
    isShowSelectModal: false, // 展开选择框
    filteredTags: {},
    originTags: {},
    tagsKeyList: [
      // {key: 'severity', keyName: '告警等级', tagSpread: true, selectedChildren: [{ name: '3'}]}, 
      // {key: 'status', keyName: '告警状态', tagSpread: false, selectedChildren: [{ name: '150'}]}, 
      // {key: 'source', keyName: '来源', tagSpread: false, selectedChildren: [{name: '青山湖'}]}
    ], // modal中的数据集合
    selectList: [/*{id: '11', key: 'aa', value: '标签1'}, {id: '21', key: 'aa', value: '标签2'}, {id: '31', key: 'aa', value: '标签3'}*/], // 模糊查询所匹配的内容
    shareSelectTags: [
      //{key: 'severity', keyName: '告警等级', values: [3,2,1,0]}
    ]
}

export default {
  namespace: 'tagListFilter',

  state: initalState,

  subscriptions: {
    pageSetUp({ dispatch, history }) {
      history.listen((location, state) => {
        if (pathToRegexp('/alertManage/:alertClassify/:alertList').test(location.pathname)) {
          dispatch({
            type: 'initTagsList',
          });
        }
      });
    },
  },

  effects: {
    /**
     *  初始化面板的数据
     */
    *initTagsList({payload}, {select, put, call}) {

      const filterTags = yield JSON.parse(localStorage.getItem('alertListPath'));

      yield put({
        type: 'initalshareSelectTags',
        payload: {
          originTags: filterTags
        }
      })
      const originTags = yield select( state => state.tagListFilter.originTags )
      yield put({
        type: 'alertList/queryAlertBar',
        payload: originTags || {}
      })
    },
    *openSelectModal({payload: {isShowSelectModal}}, {select, put, call}) {
      const tagKeysList = yield getAllTagsKey();

      if (tagKeysList.result && tagKeysList.data.length !== 0) {
        yield put({
          type: 'setTagsKeyList',
          payload: {
            tagsKeyList: tagKeysList.data || [],
            isShowSelectModal
          }
        })
      } else {
        yield message.error(window.__alert_appLocaleData.messages[tagKeysList.message], 3);
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
    *addSelectedItem({payload}, {select, put, call}) {
      const { tagsKeyList } = yield select( state => {
        return {
          'tagsKeyList': state.tagListFilter.tagsKeyList
        }
      })
      let newList = tagsKeyList.map( (group, index) => {
        if (group.key === payload.field) {
          let status = true;
          group.selectedChildren.forEach( (child, itemIndex) => {
            if (child.name === payload.item.value) {
              message.error('已经选择了该标签', 3)
              status = false;
            }
          })
          if (status) {
            group.selectedChildren.push({id: payload.item.id, name: payload.item.value});
          }
        }
        return group
      })
      yield put({
        type: 'addItem',
        payload: newList
      })
    },
    /**
     *  查询时间线和列表 + 将shareSelectTags更改
     */
    *saveFilterTags({payload}, {select, put, call}) {
      yield put({ type: 'saveSelectTag' })
      yield put({ type: 'filterTags'})
      yield put({ type: 'toggleTagsSelect', payload: false})
      const filteredTags = yield select( state => state.tagListFilter.filteredTags )
      yield put({ type: 'alertList/queryAlertBar', payload: filteredTags })
    },
    *removeTag({payload}, {select, put, call}) {
      yield put({ type: 'removeSelectTag', payload: payload })
      yield put({ type: 'filterTags'})
      const filteredTags = yield select( state => state.tagListFilter.filteredTags )
      yield put({ type: 'alertList/queryAlertBar', payload: filteredTags })
    },
    /**
     *  自动刷新
     */
    *refresh({payload}, {select, put, call}) {
      yield put({ type: 'filterTags'})
      const filteredTags = yield select( state => state.tagListFilter.filteredTags )
      yield put({ type: 'alertList/queryAlertBar', payload: filteredTags })
    }
  },

  reducers: {
    // toggle select modal
    toggleTagsSelect(state, { payload: isShowSelectModal }) {
      return { ...state, isShowSelectModal }
    },
    // 初始化数据
    initalshareSelectTags(state, { payload: {originTags}}) {
      let filter = {};
      let shareSelectTags = [];
      let keys = Object.keys(originTags);
      keys.length > 0 && keys.forEach( (key, index) => {
        if (key === 'selectedTime') {
          filter[key] = originTags[key]
        } else {
          filter[key] = originTags[key]['values']
          if (key === 'severity') {
            shareSelectTags.push({key: originTags[key]['key'], keyName: originTags[key]['keyName'], values: originTags[key]['values'].split(',') })
          } else {
            shareSelectTags.push({key: originTags[key]['key'], keyName: originTags[key]['keyName'], values: [originTags[key]['values']] })
          }
        }
      })
      
      return { ...state, shareSelectTags, originTags: filter}
    },
    // 存储tagsKeyList
    setTagsKeyList(state, {payload: {tagsKeyList, isShowSelectModal}}) {
      const { shareSelectTags } = state;
      tagsKeyList.length > 0 && tagsKeyList.forEach( (tagkey, index) => {
        tagkey.tagSpread = false
        tagkey.selectedChildren = []
        shareSelectTags.length > 0 && shareSelectTags.forEach( (tag, itemIndex) => {
          if (tagkey.key === tag.key) {
              tag.values.forEach( (val, childIndex) => {
                tagkey.selectedChildren.push({name: val})
              })
          }
        })
      })
      return { ...state, tagsKeyList, isShowSelectModal }
    },
    closeOneItem(state, {payload: target}) {
      const { tagsKeyList } = state;
      let newList = tagsKeyList.map( (group, index) => {
        if (group.key === target.field) {
          let children = group.selectedChildren.filter( (child, itemIndex) => {
            return target.name != child.name
          })
          group.selectedChildren = children;
          //group.tagSpread = false;
        }
        return group
      })
      return { ...state, tagsKeyList: newList }
    },
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
    addItem(state, {payload: newList}) {
      return { ...state, tagsKeyList: newList }
    },
    saveSelectTag(state) {
      const { tagsKeyList } = state;
      let shareSelectTags = []
      tagsKeyList.length > 0 && tagsKeyList.filter( item => item.selectedChildren.length > 0 ).forEach( (tagkey, index) => {
        shareSelectTags.push({key: tagkey['key'], keyName: tagkey['keyName']})
        tagkey.selectedChildren.forEach( (tag, itemIndex) => {
          if (shareSelectTags[index]['values']) {
            shareSelectTags[index]['values'].push(tag.name)
          } else {
            shareSelectTags[index]['values'] = [tag.name]
          }
        })
      })
      return { ...state, shareSelectTags }
    },
    // filter tags
    filterTags(state) {
      const { shareSelectTags } = state;
      let source = {};
      shareSelectTags.forEach( (item) => {
        item.values !== undefined && item.values.forEach( (tag) => {
            if ( source[item.key] ) {
              source[item.key] = source[item.key] + ',' + tag;
            } else {
              source[item.key] = tag;
            }
        })
      })
      return { ...state, filteredTags: source }
    },
    // remove select tag
    removeSelectTag(state, { payload: target }) {
      let { shareSelectTags } = state;
      const newList = shareSelectTags.map( (item) => {
        if (target.field == item.key) {
          let newValues = item.values.filter( (child) => {
            return target.name != child
          })
          item.values = newValues;
        }
        return item;
      })
      return { ...state, shareSelectTags: newList }
    },
    setSelectList(state, {payload: {selectList, targetKey}}) {
      const { tagsKeyList } = state;
      let newList = tagsKeyList.map( (group, index) => {
        group.tagSpread = false; // 其他key-value的可选标签都隐藏掉
        if (group.key === targetKey) {
          group.tagSpread = true;
        }
        return group
      })
      return { ...state, tagsKeyList: newList, selectList }
    },
  }
}
