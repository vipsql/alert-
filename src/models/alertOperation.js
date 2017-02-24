import {parse} from 'qs'
import { getFormOptions, dispatchForm, close, merge, relieve } from '../services/alertOperation'
import { message } from 'antd';

const initalState = {
    // 操作的alertIds
    operateAlertIds: [], // 只有合并length>1
    formOptions: [],

    // 各个modal弹窗
    isShowFormModal: false, // 派发
    isShowCloseModal: false, // 关闭
    isShowMergeModal: false, // 合并
    isShowRelieveModal: false, // 解除

    isSelectAlert: false, // 是否选择了告警
    isSelectOrigin: false, // 是否选择了源告警

    originAlert: [], //选择的radio是个数组
    relieveAlert: {}, // 选中的解除对象
    mergeInfoList: [
        {
            id: 1,
            object: 'hb_mysql1',
            name: '不满意交易笔数',
            origin: 'Monitor',
            descipition: '这是一条描述',
            time: '1h',
        },
        {
            id: 2,
            object: 'hb_mysql1',
            name: '不满意交易笔数',
            origin: 'Monitor',
            descipition: '这是一条描述',
            time: '1h',
        },
        {
            id: 3,
            object: 'hb_mysql1',
            name: '不满意交易笔数',
            origin: 'Monitor',
            descipition: '这是一条描述',
            time: '1h',
        }
    ], // 合并列表展示信息

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
    ],
}

export default {
  namespace: 'alertOperation',

  state: initalState,

  effects: {
      // 列定制初始化(将数据变为设定的结构)
      *initalColumn({payload}, {select, put, call}) {

      },
      // 打开解除告警modal
      *openRelieveModal({payload}, {select, put, call}) {
          const relieveAlert = yield select( state => state.alertListTable.relieveAlert)

          if (relieveAlert !== undefined ) {
              yield put({
                  type: 'setRelieveAlert',
                  payload: relieveAlert || {}
              })
              yield put({
                  type: 'toggleRelieveModal',
                  payload: true
              })
          } else {
              yield message.error('请选择一条源告警');
          }
      },
      // 解除告警
      *relieveAlert({payload}, {select, put, call}) {
          const relieveAlert = yield select( state => state.alertOperation.relieveAlert)

          if (relieveAlert !== undefined && relieveAlert.id !== undefined) {
              const relieveResult = yield relieve({
                  parentId: relieveAlert.id
              })
              if (!relieveResult.result) {
                  yield message.error(result.message, 3);
              } else {
                  yield message.success('解除成功', 3);
              }
          } else {
              console.error('relieveAlert有误');
          }

          yield put({
            type: 'toggleRelieveModal',
            payload: false
          })
      },
      // 打开合并告警需要做的处理
      *openMergeModal({payload}, {select, put, call}) {
          const { mergeInfoList } = yield select( state => {
              return {
                  'mergeInfoList': state.alertListTable.mergeInfoList,
              }
          })
          if (mergeInfoList !== undefined && mergeInfoList.length !== 0) {
              yield put({
                  type: 'setMergeInfoList',
                  payload: mergeInfoList
              })
              yield put({
                  type: 'toggleMergeModal',
                  payload: true
              })
          } else if (mergeInfoList.length < 2) {
              yield message.error(`请先选择至少两条告警`, 3);
          } else {
              console.error('合并告警源有错误');
          }
      },
      // 合并告警
      *mergeAlert({payload}, {select, put, call}) {
          const { originAlert, mergeInfoList} = yield select( state => {
              return {
                  'originAlert': state.alertOperation.originAlert,
                  'mergeInfoList': state.alertOperation.mergeInfoList
              }
          })
          if (mergeInfoList !== undefined && mergeInfoList.length > 1) { // 合并告警数量少于2不允许合并的操作在页面就不允许删除，还需和交互讨论，暂时不做处理
              let newList = yield mergeInfoList.map( item => item.id )
              let filterList = yield newList.filter( item => item != originAlert[0] )
              const result = yield merge({
                  parentId: originAlert[0],
                  childs: filterList
              })
              if (!result.result) {
                  yield message.error(result.message, 3);
              } else {
                  yield message.success('合并成功', 3);
              }
          } else {
              console.error('合并的子告警有误');
          }

          yield put({
            type: 'toggleMergeModal',
            payload: false
          })
      },
      // 打开派发工单做的相应处理
      *openFormModal({payload}, {select, put, call}) {
          const options = yield getFormOptions();
          if (options !== undefined) {
              yield put({
                  type: 'setFormOptions',
                  payload: options.data || []
              })
          } else {
              console.error(options.message);
          }
          yield put({
            type: 'toggleFormModal',
            payload: true
          })
      },
      // 关闭告警
      *closeAlert({payload}, {select, put, call}) {
          const { operateAlertIds, userId } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
                  'userId': state.app.userId
              }
          })

          if (operateAlertIds.length === 0) {
             yield message.error(`请先选择一条告警`, 3);
          } else {
              const resultData = yield close({
                  userId: userId, 
                  alertIds: operateAlertIds,
                  closeMessage: payload
              })
              if (resultData.result) {
                  yield message.success(`关闭成功`, 3);
              } else {
                  yield message.error(`${resultData.message}`, 3);
              }
          } 

          yield put({
            type: 'toggleCloseModal',
            payload: false
          })
      },
      // 确定派发工单
      *dispatchForm({payload}, {select, put, call}) {

          const operateAlertIds = yield select( state => state.alertListTable.operateAlertIds)

          if (operateAlertIds.length > 1) {
              yield message.error(`请先将多条告警合并为一条原告警`, 3);
          } else if (operateAlertIds.length === 1 && operateAlertIds[0] !== undefined) {
              const result = yield dispatchForm({
                  type: payload, 
                  alertId: operateAlertIds[0]
              })
              if (result.data !== undefined) {
                  yield window.open(result.data); 
              }
          } else if (operateAlertIds.length === 0) {
              yield message.error(`请先选择一条告警`, 3);
          } else {
              console.error('operateAlertIds有误');
          }

          yield put({
            type: 'toggleFormModal',
            payload: false
          })
      },
      // 分组显示
      *groupView({payload}, {select, put, call}) {
          yield put({
              type: 'setGroupType',
              payload: payload
          })
        //   const group = yield select( state => state.alertOperation.selectGroup)
        //   yield put({
        //       type: 'alertListTableCommon/setGroup',
        //       payload: {
        //           isGroup: true,
        //           group: group
        //       }
        //   })
      },
      // 无分组显示
      *noGroupView({payload}, {select, put, call}) {
          yield put({
              type: 'removeGroupType',
          })
        //   yield put({
        //       type: 'alertListTableCommon/setGroup',
        //       payload: {
        //           isGroup: false,
        //       }
        //   })
      }
  },

  reducers: {
      // 列定制初始化
      initColumn(state, {payload}) {

      },
      // 设置合并子列表
      setMergeInfoList(state, { payload }) {
          return { ...state, mergeInfoList: payload }
      },
      // 设置要被解除的告警
      setRelieveAlert(state, { payload: relieveAlert }) {
          return { ...state, relieveAlert }
      },
      // 设置工单类型
      setFormOptions(state, { payload }) {
          return { ...state, formOptions: payload }
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
          return { ...state, selectGroup, isGroup: true }
      },
      // 移除分组显示的类型
      removeGroupType(state) {
          return { ...state, selectGroup: initalState.selectGroup, isGroup: false }
      },
      // 转换modal状态
      toggleFormModal(state, {payload: isShowFormModal}) {
          return { ...state, isShowFormModal }
      },
      toggleCloseModal(state, {payload: isShowCloseModal}) {
          return { ...state, isShowCloseModal }
      },
      toggleMergeModal(state, {payload: isShowMergeModal}) {
          return { ...state, isShowMergeModal }
      },
      toggleRelieveModal(state, {payload: isShowRelieveModal}) {
          return { ...state, isShowRelieveModal }
      },
      // selectRows是合并告警时触发
      selectRows(state, {payload: originAlert}) {
          return { ...state, originAlert }
      },
      // remove告警
      removeAlert(state, {payload}) {
          const { mergeInfoList } = state;
          const newList = mergeInfoList.filter( (item) => (item.id !== payload) )
          return { ...state, mergeInfoList: newList}
      }
  }
}
