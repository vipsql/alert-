import {parse} from 'qs'

const initalState = {

    showModal: {
        modalType: undefined, // 预设modal类型（0：派发工单，1：关闭告警，2：合并告警，3：解除告警）--> 必须为number类型
        isOpen: false, // 弹窗是否显示
    },
    isSelectAlert: false, // 是否选择了告警
    isSelectOrigin: false, // 是否选择了源告警
    currentAlert: [
        11 //ids
    ], // 当前选中告警

    // 派发工单
    fromType: [
        { id: 1, name: '123'} 
    ], // 工单类别

    // 关闭告警
    closeReason: undefined, // 理由

    // 合并和解除
    mergeList: {
        originId: '1',
        alertList: [
            11 //ids
        ]
    },

    // 抑制告警
    restrainType: [
        {id: 1, name: '344'}
    ], // 5,10,30分钟

    restrainList: {
        typeId: 1,
        alertList: [ 11 ]
    }, // 提交至后台

    // 更多操作
    otherOperation: [
        {id: 1, name: '344'} // 其他操作
    ],

    operateList: {
        typeId: 1,
        alertList: [ 11 ]
    }, // 提交至后台

    // 列定制(点击需要初始化进行数据结构转换)
    selectCol: undefined, // 选择的列
    columnList: [
        {
            type: 1, // id 
            name: '常规',
            cols: [
                {id: 1, name: 'ID', checked: false,},
                {id: 2, name: '节点名称', checked: false,},
                {id: 3, name: '告警名称', checked: false,},
                {id: 4, name: '告警来源', checked: false,},
                {id: 5, name: '告警状态', checked: false,},
                {id: 6, name: '告警描述', checked: false,}
            ]
        },
        {
            type: 2, // id 
            name: '扩展',
            cols: [
                {id: 7, name: '地理位置', checked: false,},
                {id: 8, name: '所属单位', checked: false,},
                {id: 9, name: '运营商', checked: false,},
                {id: 10, name: '负责人', checked: false,}
            ]
        },
    ],

    // 分组显示
    isGroup: false,
    selectGroup: '分组显示', // 默认是分组设置
    groupList: [
        {id: 1, name: '按来源分组'}
    ]
}

export default {
  namespace: 'alertOperation',

  state: initalState,

  effects: {
      // 列定制初始化(将数据变为设定的结构)
      *initalColumn({payload}, {select, put, call}) {

      }

  },

  reducers: {
      // 列定制初始化
      initColumn(state, {payload}) {

      },
      // 列改变时触发
      checkColumn(state, {payload: selectCol}) {
        const { columnList } = state;
        const newList = columnList.map( (group) => {
            group.cols.map( (col) => {
                if (typeof selectCol !== 'undefined' && col.id == selectCol) {
                    col.checked = !col.checked;
                }
                return col;
            })
            return group;
        })
        
        return { ...state, columnList: newList }
      },
      // 设置分组显示的类型
      setGroupType(state, {payload: selectGroup}) {
          return { ...state, selectGroup}
      },
      // 移除分组显示的类型
      removeGroupType(state) {
          return { ...state, selectGroup: initalState.selectGroup }
      },
      // 转换modal状态
      toggleModalState(state, {payload}) {
          return { ...state, showModal: {isOpen: payload.isOpen, modalType: payload.modalType} }
      }
  }
}
