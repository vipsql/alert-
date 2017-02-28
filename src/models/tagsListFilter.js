import {parse} from 'qs'
import pathToRegexp from 'path-to-regexp';
import { getAllListTags } from '../services/alertListTags.js'

const initalState = {
    isSpread: false, // spread modal to select tags
    selectTagName: undefined,
    tagsList: [
      // { name: '告警来源', field: 1, type: 0, values: [ {name: "紧急", selected: true}, {key: 2, name: "主要", selected: false}, {key: 3, name: "次要", selected: false} ] },
      // { name: '告警状态', field: 2, tags: [
      //         {key: 4, name: "新告警", selected: false},
      //         {key: 5, name: "抑制中", selected: false},
      //         {key: 6, name: "确认中", selected: false},
      //         {key: 7, name: "已确认", selected: false},
      //         {key: 8, name: "新告警", selected: false},
      //         {key: 9, name: "抑制中", selected: false},
      //         {key: 10, name: "确认中", selected: false},
      //         {key: 11, name: "新告警", selected: false},
      //         {key: 12, name: "抑制中", selected: false}
      // ] },
      // { name: '抑制时间', field: 3, tags: [ {key: 13, name: "0-30分钟", selected: true}, {key: 14, name: "0.2-1小时", selected: false}, {key: 15, name: "1小时以上", selected: false} ] },
    ], // 暂时先静态数据代替(数据结构也还不确定)，后期有两种初始可能。1.alertTagsSet传过来 2.重新发一次请求取得
    // ------
    originTags: {},
    filteredTags: {}
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
    *initTagsList({payload}, {select, put, call}) {
      const originTags = yield localStorage.getItem('alertListPath');
      yield put({
        type: 'setOriginTags',
        payload: JSON.parse(originTags) || {}
      })
      yield put({
        type: 'alertList/queryAlertBar',
        payload: JSON.parse(originTags) || {}
      })

      const tagsList = yield getAllListTags();

      if (typeof tagsList !== 'undefined' && tagsList.length !== 0) {
        yield put({
          type: 'initalTagsList',
          payload: tagsList || []
        })
      } else {
        console.error('查询所有标签失败');
      }
    },
    *changeTags({payload}, {select, put, call}) {
      yield put({ type: 'changeSelectTag', payload: payload })
      yield put({ type: 'filterTags'})
      const filteredTags = yield select( state => state.tagListFilter.filteredTags )
      yield put({ type: 'alertList/queryAlertBar', payload: filteredTags })
    },
    *removeTag({payload}, {select, put, call}) {
      yield put({ type: 'removeSelectTag', payload: payload })
      yield put({ type: 'filterTags'})
      const filteredTags = yield select( state => state.tagListFilter.filteredTags )
      yield put({ type: 'alertList/queryAlertBar', payload: filteredTags })
    }
  },

  reducers: {
    // 设置初始化的tags
    setOriginTags(state, { payload: originTags }) {
      return { ...state, originTags }
    },
    // 将数据转换成需要的格式
    initalTagsList(state, { payload: tagsList }) {
      const { originTags } = state;
      let originTagsList = Object.keys(originTags) || [];
      const newList = tagsList.map( (group) => {
        group.values = group.values.map( (item) => {
          if (originTagsList.length !== 0
            && ((originTagsList[0] == group.field && originTags[`${originTagsList[0]}`] == item)
              || (originTagsList[1] == group.field && originTags[`${originTagsList[1]}`] == item))) {
                return {
                  name: item,
                  selected: true
                }
          }
          return {
            name: item,
            selected: false
          }
        })
        return group
      })
      return { ...state, tagsList: newList }
    },
    // toggle select button state
    toggleTagsSelect(state, { payload: isSpread }) {
      return { ...state, isSpread }
    },
    // select tag
    changeSelectTag(state, { payload: selectTagName }) {

      const { tagsList } = state;

      const newList = tagsList.map( (item) => {
        item.values.map( (tag) => {
          if (typeof selectTagName !== 'undefined' && tag.name == selectTagName) {
            tag.selected = !tag.selected;
          }
          return tag;
        })
        return item;
      })

      return { ...state, tagsList: newList }
    },
    // remove select tag
    removeSelectTag(state, { payload: selectTagName }) {
      const { tagsList } = state;

      const newList = tagsList.map( (item) => {
        item.values.map( (tag) => {
          if (typeof selectTagName !== 'undefined' && tag.name == selectTagName && tag.selected) {
            tag.selected = !tag.selected;
          }
          return tag;
        })
        return item;
      })

      return { ...state, tagsList: newList }
    },
    // filter tags
    filterTags(state) {
      const { tagsList } = state;
      let source = {};
      tagsList.forEach( (item) => {
        item.values.forEach( (tag) => {
          if (tag.selected) {
            if ( source[item.field] ) {
              source[item.field] = source[item.field] + ',' + tag.name;
            } else {
              source[item.field] = tag.name;
            }
          }
        })
      })
      return { ...state, filteredTags: source }
    }
  },

}
