
import {parse} from 'qs'

export default {
  namespace: 'alertTagsSet',
  state: {
    modalVisible: false,
    tagsNum: 0,
    tagsList: [
      {
        name:'告警来源',
        tags: [
          {
            name: "cmdb",
            selected: true
          },
          {
            name: "apm",
            selected: false
          },
          {
            name: "zabbx",
            selected: false
          }
        ]
      }
    ]
  },
  subscriptions: {

  },
  reducers: {

    // 显示标签设置框
    showTagsModal(state){
      return {
        ...state,
        modalVisible: true
      }
    },
    // 标签选择
    changSelectTag(state){

    },
    // 关闭标签设置框
    closeTagsModal(state){
      return {
        ...state,
        modalVisible: false
      }
    }



  },
  effects: {

  }
}
