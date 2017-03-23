import {parse} from 'qs'
import { queryDetail } from '../services/alertDetail'
import { queryCloumns } from '../services/alertQuery'
import { getFormOptions, dispatchForm, close, merge, relieve } from '../services/alertOperation'

const initalState = {
    isShowDetail: false, // 是否显示detail
    selectGroup: '分组显示', // 默认是分组设置

    isShowFormModal: false, // 派发工单modal
    formOptions: [],
    isShowCloseModal: false,
    closeMessage: undefined,
    isDropdownSpread: false, // 是否展开关闭modal的dropdown

    columnList: [
        {
            type: 0, // id 
            name: '常规',
            cols: [
                {id: 'entityName', name: '对象', checked: true,},
                {id: 'name', name: '告警名称', checked: false,},
                {id: 'source', name: '告警来源', checked: false,},
                {id: 'status', name: '告警状态', checked: true,},
                {id: 'description', name: '告警描述', checked: false,},
                {id: 'count', name: '次数', checked: false,},
                {id: 'lastTime', name: '持续时间', checked: false,},
                {id: 'lastOccurTime', name: '发生时间', checked: false,}
            ]
        },
    ],

    currentAlertDetail: {},

    operateForm: undefined, // 操作工单（当前）
    isSowOperateForm: false, // 是否显示操作工单文本

    operateRemark: undefined, // 备注信息
    isShowRemark: false, // 是否显示备注框
}

export default {
  namespace: 'alertQueryDetail',

  state: initalState,

  effects: {
    *initalForm() {
      // 将初始的detail form --> operateForm
    },

    // 打开派发工单做的相应处理
    *openFormModal({payload}, {select, put, call}) { 
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
            type: 'toggleDispatchModal',
            payload: true
        })
    },
    // 确定派发工单
    *dispatchForm({payload}, {select, put, call}) {

        const viewDetailAlertId = yield select( state => state.alertQuery.viewDetailAlertId)
        
        if ( viewDetailAlertId ) {
            const result = yield dispatchForm({
                type: payload, 
                alertId: viewDetailAlertId
            })
            if (result.result) {
                yield window.open(result.data.url); 
            } else {
                yield message.error(`派发工单失败`, 3);
            }
        } else {
            console.error('请先选择告警/告警Id类型错误');
        }
        yield put({
          type: 'toggleFormModal',
          payload: false
        })
    },
    // 打开关闭工单
    *openCloseModal({payload}, {select, put, call}) {
        yield put({type: 'setCloseMessge', payload: undefined})
        yield put({type: 'toggleCloseModal', payload: true })  
    },
    // 点击展开detail时的操作
    *openDetailModal({payload}, {select, put, call}) {
      const viewDetailAlertId = yield select( state => state.alertQuery.viewDetailAlertId )
      
      if ( viewDetailAlertId ) {
        const detailResult = yield queryDetail(viewDetailAlertId);
        if ( detailResult.result ) {
          yield put({
            type: 'setDetail',
            payload: detailResult.data || {}
          })
          if (detailResult.data.orderInfo) {
            yield put({
              type: 'setFormData',
              payload: detailResult.data.orderInfo
            })
          }
          yield put({
            type: 'toggleDetailModal',
            payload: true
          })
        } else {
          yield message.error(`${detailResult.message}`, 3);
        }
      } else {
        console.error('viewDetailAlertId类型错误')
      }
    },
    // 关闭时
    *closeDetailModal({payload}, {select, put, call}) {
        yield put({
          type: 'alertQuery/toggleDetailAlertId',
          payload: false
        })
        yield put({
            type: 'toggleDetailModal',
            payload: false
        })
    },
    // 关闭告警
    *closeAlert({payload}, {select, put, call}) {
        const { userId, viewDetailAlertId } = yield select( state => {
            return {
                'userId': state.app.userId,
                'viewDetailAlertId': state.alertQuery.viewDetailAlertId
            }
        })
        
        if (viewDetailAlertId) {
            let stringId = '' + viewDetailAlertId;
            const resultData = yield close({
                userId: userId, 
                alertIds: [stringId],
                closeMessage: payload
            })
            if (resultData.result) {
                yield put({ type: 'alertQuery/deleteAlert', payload: [stringId]})
                yield message.success(`关闭成功`, 3);
            } else {
                yield message.error(`${resultData.message}`, 3);
            }
        } else {
            console.error('请先选择告警/告警Id类型错误');
        }
        yield put({
          type: 'toggleCloseModal',
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
            type: 'alertQuery/setGroup',
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
            type: 'alertQuery/setGroup',
            payload: {
                isGroup: false,
            }
        })
    },
    // 列定制初始化(将数据变为设定的结构)
    *initalColumn({payload}, {select, put, call}) {
        // 这里后期要先做查询得到扩展字段，再和columnList拼接
        const { columns } = yield select( state => {
            return {
                'columns': state.alertQuery.columns
            }
        })
        const columnResult = yield call(queryCloumns)
        if (!columnResult.result) {
            console.error('扩展字段查询失败')
        }
        yield put({ type: 'initColumn', payload: {baseCols: columns, extend: columnResult.data || {}}})
        
    },
    // 列定制
    *checkColumn({payload}, {select, put, call}) {
        yield put({ type: 'setColumn', payload: payload })
        const selectColumn = yield select(state => state.alertQueryDetail.selectColumn)
        yield put({ type: 'alertQuery/customCols', payload: selectColumn})
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
                      arr.push({ key: col.id, title: col.name, width: 150, order: true }) // order字段先定死
                  } else {
                      arr.push({ key: col.id, title: col.name, width: 150 }) // width先定死
                  }
              }
              return col;
          })
          return group;
      })
      
      return { ...state, columnList: newList, selectColumn: arr }
    },
    // 设置分组显示的类型
    setGroupType(state, {payload: selectGroup}) {
        return { ...state, selectGroup }
    },
    // 移除分组显示的类型
    removeGroupType(state) {
        return { ...state, selectGroup: initalState.selectGroup }
    },
    // -----------------------------------------------
    // 初始化operateForm
    initalFormData(state) {
      return { ...state, operateRemark: state.currentAlertDetail.form }
    },
    // 储存detail信息
    setDetail(state, {payload: currentAlertDetail}) {
      return { ...state, currentAlertDetail }
    },
    // 切换侧滑框的状态
    toggleDetailModal(state, {payload: isShowDetail}) {
      return { ...state, isShowDetail }
    },
    // 设置工单类型
    setFormOptions(state, { payload }) {
        return { ...state, formOptions: payload }
    },
    // 切换派发工单modal的状态
    toggleDispatchModal(state, {payload: isShowFormModal}) {
      return { ...state, isShowFormModal }
    },
    toggleCloseModal(state, {payload: isShowCloseModal}) {
        return { ...state, isShowCloseModal }
    },
    setCloseMessge(state, { payload: closeMessage}) {
        return { ...state, closeMessage }
    },
    // 是否展开dropdown - closemodal
    toggleDropdown(state, { payload: isDropdownSpread }) {
        return { ...state, isDropdownSpread }
    },
    // 切换工单的状态
    toggleFormModal(state, {payload: isSowOperateForm}) {
      return { ...state, isSowOperateForm }
    },
    // 切换备注的状态
    toggleRemarkModal(state, {payload: isShowRemark}) {
      return { ...state, isShowRemark }
    },
    // 存储工单信息
    setFormData(state, {payload: operateForm}) {
      return { ...state, operateForm }
    },
    // 存储备注信息
    setRemarkData(state, {payload: operateRemark}) {
      return { ...state, operateRemark }
    }
  },

}
