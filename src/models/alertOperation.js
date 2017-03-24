import {parse} from 'qs'
import { getFormOptions, dispatchForm, close, merge, relieve } from '../services/alertOperation'
import { queryAlertList, queryChild, queryAlertListTime } from '../services/alertList'
import { queryCloumns } from '../services/alertQuery'
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

    isDropdownSpread: false, // 是否展开关闭modal的dropdown
    closeMessage: undefined, // 关闭原因

    isSelectAlert: false, // 是否选择了告警
    isSelectOrigin: false, // 是否选择了源告警

    originAlert: [], //选择的radio是个数组
    relieveAlert: {}, // 选中的解除对象
    mergeInfoList: [
        
    ], // 合并列表展示信息

    // 列定制(点击需要初始化进行数据结构转换)
    selectColumn: [], // 选择的列
    columnList: [
        {
            type: 0, // id 
            name: '常规',
            cols: [
                {id: 'entityName', name: '对象', checked: false,},
                {id: 'name', name: '告警名称', checked: false,},
                {id: 'source', name: '告警来源', checked: false,},
                {id: 'status', name: '告警状态', checked: false,},
                {id: 'description', name: '告警描述', checked: false,},
                {id: 'count', name: '次数', checked: false,},
                {id: 'lastTime', name: '持续时间', checked: false,},
                {id: 'lastOccurTime', name: '发生时间', checked: false,}
            ]
        }
    ],

    // 分组显示
    isGroup: false,
    selectGroup: '分组显示', // 默认是分组设置
}

export default {
  namespace: 'alertOperation',

  state: initalState,

  effects: {
      // 列定制初始化(将数据变为设定的结构)
      *initalColumn({payload}, {select, put, call}) {
          // 这里后期要先做查询得到扩展字段，再和columnList拼接
          const { columns } = yield select( state => {
              return {
                  'columns': state.alertListTable.columns
              }
          })
          const columnResult = yield call(queryCloumns)
          if (!columnResult.result) {
              console.error('扩展字段查询失败')
          }
          yield put({ type: 'initColumn', payload: {baseCols: columns, extend: columnResult.data || {}}})
      },
      // 打开解除告警modal
      *openRelieveModal({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const relieveAlert = yield select( state => state.alertListTable.selectedAlertIds)

          if (relieveAlert !== undefined && relieveAlert.length === 1) {
              yield put({
                  type: 'setRelieveAlert',
                  payload: relieveAlert[0] || {}
              })
              yield put({
                  type: 'toggleRelieveModal',
                  payload: true
              })
          } else {
              yield message.error('请选择一条源告警');
          }
      },
      // 打开解除告警modal(点击按钮的方式)
      *openRelieveModalByButton({payload}, {select, put, call}) {
          if (payload !== undefined) {
              yield put({
                  type: 'setRelieveAlert',
                  payload: payload || {}
              })
              yield put({
                  type: 'toggleRelieveModal',
                  payload: true
              })
          } else {
              console.error('选择解除的源告警有误')
          }
      },
      // 解除告警
      *relieveAlert({payload}, {select, put, call}) {
          const {relieveAlert, begin, end} = yield select( state => {
              return {
                  'relieveAlert': state.alertOperation.relieveAlert,
                  'begin': state.alertListTable.begin,
                  'end': state.alertListTable.end
              }
          })
          
          if (relieveAlert !== undefined && relieveAlert.id !== undefined) {
              let childResult = {}
              if (relieveAlert.childrenAlert === undefined) {
                  childResult = yield call(queryChild, {incidentId: relieveAlert.id, begin: begin, end: end})
              }
              const relieveResult = yield relieve({
                  parentId: relieveAlert.id
              })
              if (!relieveResult.result) {
                  yield message.error(result.message, 3);
              } else if (childResult.result !== undefined && !childResult.result) {
                  console.error('查询子告警失败')
              } else {
                  yield put({ type: 'alertListTable/resetCheckedAlert'})
                  yield put({ type: 'alertListTable/relieveChildAlert', payload: {
                      childs: childResult.data === undefined ? relieveAlert.childrenAlert : childResult.data,
                      relieveId: relieveAlert.id
                  }})
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
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const { mergeInfoList } = yield select( state => {
              return {
                  'mergeInfoList': state.alertListTable.selectedAlertIds,
              }
          })
          
          if (mergeInfoList !== undefined && mergeInfoList.length >= 2) {
              yield put({
                  type: 'setMergeInfoList',
                  payload: mergeInfoList
              })
              yield put({
                  type: 'toggleMergeModal',
                  payload: true
              })
          } else if (mergeInfoList.length < 2) {
              yield message.error(`请先选择至少二条告警`, 3);
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
              let filterList = yield mergeInfoList.filter( item => item.id != originAlert[0] )
              let filterListIds = yield filterList.map( item => item.id )
              const result = yield merge({
                  parentId: originAlert[0],
                  childs: filterListIds
              })
              if (result.result) {
                  yield put({ type: 'alertListTable/resetCheckedAlert'})
                  yield put({ type: 'alertListTable/mergeChildAlert', payload: { pId: originAlert[0], cItems: filterList }})
                  yield message.success('合并成功', 3);
              } else {
                  yield message.error(result.message, 3);
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
          yield put({
              type: 'alertList/toggleModalOrigin',
              payload: payload
          })
          if (payload !== undefined && payload === 'detail') {
              yield put({
                  type: 'alertDetailOperation/openFormModal'
              })
          } else {
            const options = yield getFormOptions();
            if (options.result) {
                yield put({
                    type: 'setFormOptions',
                    payload: options.data || []
                })
            } else {
                console.error('获取工单类型失败');
            }
            yield put({
                type: 'toggleFormModal',
                payload: true
            })
          }
      },
      *openCloseModal({payload}, {select, put, call}) {
          yield put({
              type: 'alertList/toggleModalOrigin',
              payload: payload.origin
          })
          if (payload.origin !== undefined && payload.origin === 'detail') {
              yield put({type: 'alertDetailOperation/setCloseMessge', payload: undefined})
              yield put({type: 'alertDetailOperation/toggleCloseModal',payload: payload.state})
          } else {
              yield put({type: 'setCloseMessge', payload: undefined})
              yield put({type: 'toggleCloseModal', payload: payload.state})
          }
      },
      // 关闭告警
      *closeAlert({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'});
          const { operateAlertIds } = yield select( state => {
              return {
                  'operateAlertIds': state.alertListTable.operateAlertIds,
              }
          })
          if ( operateAlertIds !== undefined ) {
            if (operateAlertIds.length === 0) {
                yield message.error(`请先选择一条告警`, 3);
            } else {
                let stingIds = operateAlertIds.map( item => '' + item)
                const resultData = yield close({
                    incidentIds: stingIds,
                    closeMessage: payload
                })
                if (resultData.result) {
                    yield put({ type: 'alertListTable/resetCheckedAlert'})
                    yield put({ type: 'alertListTable/deleteAlert', payload: stingIds})
                    yield message.success(`关闭成功`, 3);
                } else {
                    yield message.error(`${resultData.message}`, 3);
                }
            } 

          } else {
              console.error('operateAlertIds有误');
          }

          yield put({
            type: 'toggleCloseModal',
            payload: false
          })
      },
      // 确定派发工单
      *dispatchForm({payload}, {select, put, call}) {
          // 触发筛选
          yield put({ type: 'alertListTable/filterCheckAlert'})
          const operateAlertIds = yield select( state => state.alertListTable.operateAlertIds)

          if (operateAlertIds.length > 1) {
              yield message.error(`请先将多条告警合并为一条原告警`, 3);
          } else if (operateAlertIds.length === 1 && operateAlertIds[0] !== undefined) {
              const result = yield dispatchForm({
                  code: payload, 
                  id: operateAlertIds[0]
              })
              if (result.result) {
                  yield window.open(result.data.url);
                  yield put({ type: 'alertListTable/resetCheckedAlert'})
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
          yield put({
              type: 'alertListTable/setGroup',
              payload: {
                  isGroup: true,
                  group: payload
              }
          })
      },
      // 无分组显示
      *noGroupView({payload}, {select, put, call}) {
          yield put({
              type: 'removeGroupType',
          })
          yield put({
              type: 'alertListTable/setGroup',
              payload: {
                  isGroup: false,
              }
          })
      },
      // 列定制
      *checkColumn({payload}, {select, put, call}) {
          yield put({ type: 'setColumn', payload: payload })
          yield put({ type: 'filterColumn' })
          const selectColumn = yield select(state => state.alertOperation.selectColumn)
          yield put({ type: 'alertListTable/customCols', payload: selectColumn})
      }

  },

  reducers: {
      // 列定制初始化
      initColumn(state, {payload: {baseCols, extend}}) {
        const { columnList } = state;
        let newList = columnList;
        let haveExtend = false;
        baseCols.forEach( (column, index) => {
            newList.forEach( (group) => {
                if (group.type == 1) {
                    haveExtend = true;
                }
                group.cols.forEach( (col) => {
                if (column.key === col.id) {
                    col.checked = true;
                }
                }) 
            })
        })
        if (Object.keys(extend).length !== 0 && !haveExtend) {
            extend.cols.forEach( (col) => {
                col.checked = false;
            })
            newList.push(extend)
        }
        return { ...state, columnList: newList }
      },
      // 列改变时触发
      setColumn(state, {payload: selectCol}) {
        const { columnList } = state;
        let arr = []
        const newList = columnList.map( (group) => {
            group.cols.map( (col) => {
                if (typeof selectCol !== 'undefined' && col.id === selectCol) {
                    col.checked = !col.checked;
                }
                if (col.checked) {
                    if (col.id == 'source' || col.id == 'lastTime' || col.id == 'lastOccurTime' || col.id == 'count') {
                        arr.push({ key: col.id, title: col.name, order: true }) // order字段先定死
                    } else {
                        arr.push({ key: col.id, title: col.name })
                    }
                }
                return col;
            })
            return group;
        })
        
        return { ...state, columnList: newList, selectColumn: arr }
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
      },
      // 是否展开dropdown - closemodal
      toggleDropdown(state, { payload: isDropdownSpread }) {
          return { ...state, isDropdownSpread }
      },
      setCloseMessge(state, { payload: closeMessage}) {
          return { ...state, closeMessage }
      }
  }
}
