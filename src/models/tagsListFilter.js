import {parse} from 'qs'

const initalState = {
    isSpread: false, // spread modal to select tags
    selectTagId: undefined,
    tagsList: [
      { name: '告警来源', key: 1, tags: [ {key: 1, name: "紧急", selected: true}, {key: 2, name: "主要", selected: false}, {key: 3, name: "次要", selected: false} ] },
      { name: '告警状态', key: 2, tags: [ 
              {key: 4, name: "新告警", selected: false}, 
              {key: 5, name: "抑制中", selected: false}, 
              {key: 6, name: "确认中", selected: false}, 
              {key: 7, name: "已确认", selected: false},
              {key: 8, name: "新告警", selected: false}, 
              {key: 9, name: "抑制中", selected: false}, 
              {key: 10, name: "确认中", selected: false},
              {key: 11, name: "新告警", selected: false}, 
              {key: 12, name: "抑制中", selected: false}
      ] },  
      { name: '抑制时间', key: 3, tags: [ {key: 13, name: "0-30分钟", selected: true}, {key: 14, name: "0.2-1小时", selected: false}, {key: 15, name: "1小时以上", selected: false} ] },
    ] // 暂时先静态数据代替(数据结构也还不确定)，后期有两种初始可能。1.alertTagsSet传过来 2.重新发一次请求取得

}

export default {
  namespace: 'tagListFilter',

  state: initalState,

  subscriptions: {

  },

  effects: {
    *initTagsList({payload}, {select, put, call}) {

    }
  },

  reducers: {
    // toggle select button state
    toggleTagsSelect(state, { payload: isSpread }) {
      return { ...state, isSpread }
    },
    // select tag
    changSelectTag(state, { payload: selectTagId }) {
      const { tagsList } = state;

      const newList = tagsList.map( (item) => {
        item.tags.map( (tag) => {
          if (typeof selectTagId !== 'undefined' && tag.key == selectTagId) {
            tag.selected = !tag.selected;
          }
          return tag;
        })
        return item;
      })
      
      return { ...state, tagsList: newList }
    },
    // remove select tag
    removeSelectTag(state, { payload: selectTagId }) {
      const { tagsList } = state;

      const newList = tagsList.map( (item) => {
        item.tags.map( (tag) => {
          if (typeof selectTagId !== 'undefined' && tag.key == selectTagId && tag.selected) {
            tag.selected = !tag.selected;
          }
          return tag;
        })
        return item;
      })
      
      return { ...state, tagsList: newList }
    }
  },

}