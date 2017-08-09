import { queryAlertList, queryChild, queryAlertListTime } from '../services/alertList'
import { viewTicket } from '../services/alertOperation'
import { parse } from 'qs'
import { message } from 'antd'
import { assign } from 'es6-object-assign';
import { groupSort, returnByIsReRender } from '../utils'

const initialState = {
  isGroup: false,
  groupBy: 'source',

  selectedAlertIds: [], //选中的告警(合并告警)
  operateAlertIds: [], //选中的告警(派发 关闭)
  viewDetailAlertId: false, // 查看详细告警ID
  isResize: false, //是否折叠
  isShowMore: false,
  isLoading: false,

  orderBy: 'lastOccurTime',
  orderType: 0,
  pageSize: 40,
  currentPage: 1,

  levels: {}, // 告警级别

  begin: 0,
  end: 0,

  tagsFilter: {}, // 过滤标签
  selectedAll: false,

  checkAlert: {}, //此对象将alertId作为属性，用来过滤checked的alert

  lineW: 800, //时间线长度
  gridWidth: 100,
  minuteToWidth: 5, //以分钟单位计算间隔

  tempListData: [], //用于临时记录列表数据，在分组时取用这块的数据（避免连续分组时的BUG）
  data: [],

  columns: [{
    key: 'entityName',
    isFixed: true
  }, {
    key: 'name',
    isFixed: true
  }, {
    key: 'owner',
    order: true
  }, {
    key: 'source',
    order: true
  }, {
    key: 'description',
  }, {
    key: 'count',
    order: true
  }, {
    key: 'lastTime',
    order: true
  }, {
    key: 'lastOccurTime',
    order: true
  }, {
    key: 'status',
    order: true
  },],
}

export default {
  namespace: 'alertListTable',
  state: initialState,
  subscriptions: {
    setup({ dispatch }) {


    }
  },
  reducers: {
    // 更新时间线每分钟占宽
    updateMinToWidth(state, { payload: payload }) {
      return {
        ...state,
        ...payload
      }
    },
    // 折叠状态
    updateResize(state, { payload: isResize }) {
      return {
        ...state,
        ...isResize
      }
    },
    // 加载状态
    toggleLoading(state, { payload: { isLoading, isReRender = true } }) {
      return returnByIsReRender(state, { isLoading }, isReRender);
    },
    // // 更改全选状态
    toggleSelectedAll(state, { payload }) {
      // const { checkAlert } = state;
      // // let newStatus = !selectedAll;
      // let ids = Object.keys(checkAlert);

      // let newOperateAlertIds = [];
      // let newSelectedAlertIds = [];
      // if (checked) {
      //   newOperateAlertIds = ids;
      //   newSelectedAlertIds = ids.map(id => checkAlert[id].info);
      // } else {
      //   newOperateAlertIds = [];
      //   newSelectedAlertIds = [];
      // }
      // ids.forEach((id) => {
      //   checkAlert[id].checked = checked;
      // });
      const { selectedAll, checkAlert, operateAlertIds, selectedAlertIds, isReRender = true } = payload;
      return returnByIsReRender(
        state,
        {
          selectedAll,
          checkAlert,
          operateAlertIds,
          selectedAlertIds
        },
        isReRender
      )
    },
    // 更新分组字段
    updateGroup(state, { payload }) {
      return {
        ...state,
        ...payload
      }
    },
    // 更新显示更多字段
    updateShowMore(state, { payload: { isShowMore, isReRender = true } }) {
      return returnByIsReRender(
        state,
        { isShowMore },
        isReRender
      )
    },
    // 点击查看更多
    setMore(state, { payload: { currentPage, isReRender = true } }) {
      return returnByIsReRender(
        state,
        { currentPage },
        isReRender
      )
    },
    // 注入通用状态
    setInitvalScope(state, { payload }) {
      return { ...state, ...payload }
    },
    // 设置viewDetailAlertId
    toggleDetailAlertId(state, { payload: viewDetailAlertId }) {
      return { ...state, viewDetailAlertId }
    },
    // 初始化
    clear(state) {
      return { ...state, ...initialState }
    },

    // 将除了payload以外的值初始化
    // setInitialExceptPayload(state, { payload }) {
    //   return {
    //     ...initialState,
    //     ...payload
    //   }
    // },
    // 不分组更新
    updateAlertListToNoGroup(state, { payload: { info, isShowMore, isGroup, levels, orderBy, orderType, tempListData, currentPage, isReRender = true } }) {
      let checkList = {};
      info.forEach((item, index) => {
        checkList[`${item.id}`] = {
          info: item,
          checked: false
        }
      })
      return returnByIsReRender(state, { checkAlert: checkList, data: info, tempListData, isShowMore, isGroup, levels, orderBy, orderType, currentPage }, isReRender)
    },
    // 分组时更新
    updateAlertListToGroup(state, { payload: { info, isShowMore, isGroup, groupBy, levels, isReRender = ture } }) {
      let checkList = {};
      info.forEach((group, index) => {
        group.children.forEach((item) => {
          checkList[`${item.id}`] = {
            info: item,
            checked: false
          }
        })
      })
      return returnByIsReRender(state, { checkAlert: checkList, data: info, isShowMore, isGroup, groupBy, levels }, isReRender);
    },
    // 记录下原先checked数据
    //将loadMore取得的新数据放入checkAlert中
    resetCheckAlert(state, { payload: { moreData, isReRender = true } }) {
      // let ids = Object.keys(origin);
      let checkList = {};
      // newObj.forEach((item, index) => {
      //   checkList[`${item.id}`] = {
      //     info: item,
      //     checked: false
      //   }
      //   ids.forEach((id) => {
      //     if (item.id == id && origin[id].checked) {
      //       checkList[`${item.id}`] = {
      //         info: item,
      //         checked: true
      //       }
      //     }
      //   })
      // })
      // return { ...state, checkAlert: checkList }
      moreData.forEach(item => {
        checkList[item.id] = {
          info: item,
          checked: false
        }
      })
      return returnByIsReRender(
        state,
        {
          checkAlert: {
            ...state.checkAlert,
            ...checkList
          }
        },
        isReRender
      )
    },
    // 删除勾选项
    deleteCheckAlert(state, { payload: arr }) {
      let { checkAlert } = state;
      arr.forEach((id) => {
        if (checkAlert[id]) delete checkAlert[id]
      })
      return { ...state, checkAlert }
    },
    // 重置勾选状态
    resetCheckedAlert(state) {
      const { checkAlert } = state;
      let ids = Object.keys(checkAlert);
      ids.forEach((id) => {
        checkAlert[id].checked = false
      })
      return { ...state, checkAlert: checkAlert, operateAlertIds: [], selectedAlertIds: [], selectedAll: false }
    },
    // 更改勾选状态
    changeCheckAlert(state, { payload: { alertId } }) {
      const previousChecked = state.checkAlert[alertId].checked
      let newOperateAlertIds = [];
      let newSelectedAlertIds = [];
      let newCheckAlert = {
        ...state.checkAlert,
        [alertId]: {
          ...state.checkAlert[alertId],
          checked: !previousChecked
        }
      };
      if (!previousChecked) {
        newOperateAlertIds = [
          ...state.operateAlertIds,
          alertId
        ];
        newSelectedAlertIds = [
          ...state.selectedAlertIds,
          state.checkAlert[alertId].info
        ];
      } else {
        let index = state.operateAlertIds.indexOf(alertId);
        //index逻辑上来说不可能出现小于-1的情况，但还是判断一下吧
        if (index > -1) {
          newOperateAlertIds = [
            ...state.operateAlertIds.slice(0, index),
            ...state.operateAlertIds.slice(index + 1)
          ];
          newSelectedAlertIds = [
            ...state.selectedAlertIds.slice(0, index),
            ...state.selectedAlertIds.slice(index + 1)
          ];
        }
      }
      return {
        ...state,
        operateAlertIds: newOperateAlertIds,
        selectedAlertIds: newSelectedAlertIds,
        checkAlert: newCheckAlert
      }
      // if (checkAlert[alertInfo.id] !== undefined) {
      //   checkAlert[alertInfo.id].checked = !checkAlert[alertInfo.id].checked
      //   return { ...state, checkAlert: checkAlert }
      // } else {
      //   return { ...state }
      // }
    },
    // 在点击操作时进行过滤处理
    // filterCheckAlert(state) {
    //   const { checkAlert } = state;
    //   let operateAlertIds = [], selectedAlertIds = [];
    //   let keyArr = Object.keys(checkAlert) || [];
    //   keyArr.forEach((id) => {
    //     if (checkAlert[id].checked) {
    //       operateAlertIds.push(id);
    //       // selectedAlertIds.push(checkAlert[id].info)
    //     }
    //   })
    //   return { ...state, operateAlertIds: operateAlertIds, selectedAlertIds: selectedAlertIds }
    // },
    // ----------------------------------------------------------------------------------------------
    setTimeLineWidth(state, { payload: { gridWidth, minuteToWidth, lineW } }) {

      return {
        ...state,
        gridWidth,
        minuteToWidth,
        lineW
      }
    },
    // 自定义列
    customCols(state, { payload: columns }) {
      return {
        ...state,
        columns
      }

    },
    // 更新告警列表
    updateAlertListData(state, { payload: { data, newLevels, tempListData, isReRender = true } }) {
      let { levels } = state;
      let keys = Object.keys(newLevels);
      keys.forEach((key) => {
        levels[key] = typeof levels[key] !== 'undefined' ? levels[key] + newLevels[key] : newLevels[key]
      })
      return returnByIsReRender(state, { data, tempListData, levels: levels }, isReRender);
    },
    // 手动添加子告警
    addChild(state, { payload: { children, parentId, isGroup } }) {
      const { data } = state;
      if (isGroup === true) {
        const newData = data.map((group) => {
          group.children.map((item) => {
            if (item.id == parentId) {
              item.childrenAlert = children;
              item.isSpread = true
            }
            return item;
          })
          return group
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.map((item, index) => {
          if (item.id == parentId) {
            item.childrenAlert = children;
            item.isSpread = true
          }
          return item;
        })
        return { ...state, data: newData }
      }
      return { ...state }
    },
    // 收拢子告警
    toggleSpreadChild(state, { payload: { parentId, isGroup } }) {
      const { data } = state;
      if (isGroup === true) {
        const newData = data.map((group) => {
          group.children.map((item) => {
            if (item.id == parentId) {
              item.isSpread = !item.isSpread
            }
            return item;
          })
          return group
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.map((item, index) => {
          if (item.id == parentId) {
            item.isSpread = !item.isSpread
          }
          return item;
        })
        return { ...state, data: newData }
      }
      return { ...state }
    },
    // 合并告警
    mergeChildrenAlert(state, { payload: { parentId, childItems, isGroup, relieveItem } }) {
      const { data, checkAlert } = state;
      const childIds = childItems.map(item => item.id)
      let childsItem = [];
      if (isGroup === true) {
        const newData = data.map((group) => {
          const arr = group.children.filter((item) => {
            let status = true;
            if (item.id == parentId) {
              item.hasChild = true;
              item.isSpread = true;
              item.childrenAlert = childItems;
            }
            childIds.forEach((child) => {
              if (child == item.id) {
                status = false;
              }
            })
            return status;
          })
          group.children = arr.concat(relieveItem);
          return group
        })
        relieveItem.length !== 0 && relieveItem.forEach((item) => { checkAlert[item.id] = { info: item, checked: false } })
        return { ...state, data: newData, checkAlert: checkAlert }
      } else if (isGroup === false) {
        const newData = data.filter((item) => {
          let status = true;
          if (item.id == parentId) {
            item.hasChild = true;
            item.isSpread = true;
            item.childrenAlert = childItems;
          }
          childIds.forEach((child) => {
            if (child == item.id) {
              status = false;
            }
          })
          return status;
        })
        newData.push(...relieveItem)
        relieveItem.length !== 0 && relieveItem.forEach((item) => { checkAlert[item.id] = { info: item, checked: false } })
        return { ...state, data: newData, checkAlert: checkAlert }
      }
      return { ...state }
    },
    // addParent再没展开过的情况下去解除告警
    addParent(state, { payload: { addItem, parentId, isGroup } }) {
      const { data, checkAlert } = state;
      if (isGroup === true) {
        const newData = data.map((group) => {
          let status = false;
          group.children.map((item) => {
            if (item.id == parentId) {
              status = true;
              item.hasChild = false;
              item.isSpread = false;
              delete item.childrenAlert
            }
            return item;
          })
          if (status) {
            group.children.push(...addItem);
            addItem.forEach((item) => { checkAlert[item.id] = { info: item, checked: false } })
          }
          return group;
        })
        return { ...state, data: newData, checkAlert: checkAlert }
      } else if (isGroup === false) {
        let status = false;
        const newData = data.map((item, index) => {
          if (item.id == parentId) {
            status = true;
            item.hasChild = false;
            item.isSpread = false;
            delete item.childrenAlert
          }
          return item;
        })
        if (status) {
          newData.push(...addItem);
          addItem.forEach((item) => { checkAlert[item.id] = { info: item, checked: false } })
        }
        return { ...state, data: newData, checkAlert: checkAlert }
      }
      return { ...state }
    },
    // 手动添加分组展开状态
    addGroupSpread(state, { payload }) {
      const { data } = state;
      const newData = data.map((group) => {
        if (group.classify == payload) {
          group.isGroupSpread = false;
        }
        return group
      })
      return { ...state, data: newData }
    },
    // 转换分组的展开状态
    toggleGroupSpread(state, { payload }) {
      const { data } = state;
      const newData = data.map((group) => {
        if (group.classify == payload) {
          group.isGroupSpread = !group.isGroupSpread;
        }
        return group
      })
      return { ...state, data: newData }
    },
    // 排序
    toggleOrder(state, { payload: { orderBy, orderType, isReRender = true } }) {
      return returnByIsReRender(state, { orderBy, orderType }, isReRender);
    },
    // 删除告警
    deleteIncident(state, { payload: arr }) {
      const { data, isGroup } = state;
      if (isGroup === true) {
        const newData = data.map((group) => {
          const children = group.children.filter((item) => {
            let status = true;
            // arr.forEach((id) => {
            //   if (id === item.id) status = false
            // })
            for (let i = 0, len = arr.length; i < len; i++) {
              if (arr[i] === item.id) {
                status = false;
                break;
              }
            }
            return status;
          })
          group.children = children;
          return group;
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.filter((item) => {
          let status = true;
          // arr.forEach((id) => {
          //   if (id === item.id) status = false
          // })
          for (let i = 0, len = arr.length; i < len; i++) {
            if (arr[i] === item.id) {
              status = false;
              break;
            }
          }
          return status;
        })
        return { ...state, data: newData }
      }
    },

    // 修改状态为处理中
    changeCloseState(state, { payload: { arrList, status } }) {
      const { data, isGroup } = state;
      if (isGroup === true) {
        const newData = data.map((group) => {
          const arr = group.children.map((item) => {
            arrList.forEach((id) => {
              if (item.id == id) {
                item['status'] = status; // 手动变为150 -> 已解决
              }
              if (item.childrenAlert !== undefined) {
                item.childrenAlert.forEach((childItem) => {
                  childItem['status'] = status; // 子告警也变为已解决
                })
              }
            })
            return item;
          })
          group.children = arr;
          return group;
        })
        return { ...state, data: newData }
      } else if (isGroup === false) {
        const newData = data.map((item, index) => {
          arrList.forEach((id) => {
            if (item.id == id) {
              item['status'] = status; // 手动变为150 -> 已解决
            }
            if (item.childrenAlert !== undefined) {
              item.childrenAlert.forEach((childItem) => {
                childItem['status'] = status; // 子告警也变为已解决
              })
            }
          })
          return item;
        })
        return { ...state, data: newData }
      }
    },

    // 修改data数组多行的值
    updateDataRows(state, { payload }) {
      const { datas, isReRender = true } = payload;
      const { data, isGroup, tagsFilter: { status }, checkAlert } = state;
      const ids = datas.map((data) => data.id);
      let newData = assign([], data);

      if (isGroup) {
        newData = newData.map((tempGroup) => {
          let data = tempGroup.children.map((tempRow) => {
            if (ids.indexOf(tempRow['id']) >= 0) {
              tempRow = { ...tempRow, ...(datas[ids.indexOf(tempRow['id'])]) };

              // 如果告警的状态与当前过滤条件的状态不一致，则设置“移除字段”为true
              if (status.indexOf(',') < 0 && status != tempRow.status) {
                tempRow.isRemoved = true;
              }

              if (!tempRow.checked) {
                if (checkAlert[tempRow.id] && checkAlert[tempRow.id].checked) {
                  checkAlert[tempRow.id].checked = false;
                }
              }
            }
          })
          tempGroup.children = data;
          return tempGroup;
        });
      } else {
        newData = newData.map((tempRow) => {
          if (ids.indexOf(tempRow['id']) >= 0) {
            tempRow = { ...tempRow, ...(datas[ids.indexOf(tempRow['id'])]) };

            // 如果告警的状态与当前过滤条件的状态不一致，则设置“移除字段”为true
            if (status.indexOf(',') < 0 && status != tempRow.status) {
              tempRow.isRemoved = true;
            }

            if (!tempRow.checked) {
              if (checkAlert[tempRow.id] && checkAlert[tempRow.id].checked) {
                checkAlert[tempRow.id].checked = false;
              }
            }
          }

          return tempRow
        });
      }

      return returnByIsReRender(state, { data: newData, checkAlert, operateAlertIds: [], selectedAlertIds: [] }, isReRender);
    },

    // 修改data数组某一行的值
    updateDataRow(state, { payload }) {
      const { data, isGroup, tagsFilter: { status }, isReRender = true } = state;
      let newData = assign([], data);
      if (isGroup) {
        newData = newData.map((tempGroup) => {
          let data = tempGroup.children.map((tempRow) => {
            if (tempRow['id'] == payload['id']) {
              tempRow = { ...tempRow, ...payload };
              // 如果告警的状态与当前过滤条件的状态不一致，则设置“移除字段”为true
              if (status.indexOf(',') < 0 && status != tempRow.status) {
                tempRow.isRemoved = true;
              }
            }
            return tempRow
          })
          tempGroup.children = data;
          return tempGroup;
        });
      } else {
        newData = newData.map((tempRow) => {
          if (tempRow['id'] == payload['id']) {
            tempRow = { ...tempRow, ...payload };
            // 如果告警的状态与当前过滤条件的状态不一致，则设置“移除字段”为true
            if (status.indexOf(',') < 0 && status != tempRow.status) {
              tempRow.isRemoved = true;
            }
          }
          return tempRow;
        });
      }
      return returnByIsReRender(state, { data: newData }, isReRender);
    },

    // 清空selectedAlertIds和operateAlertIds： 接手成功后要手动清除
    // deleteOperateIds(state) {
    //   return {
    //     ...state,
    //     operateAlertIds: [],
    //     selectedAlertIds: []
    //   }
    // },

    //
    resetCheckboxStatus(state) {
      return {
        ...state,
        operateAlertIds: [],
        selectedAlertIds: [],
        selectedAll: false
      }
    }
  },







  effects: {
    // beforeCustomCols
    *initCustomCols({ payload: custome }, { call, put, select }) {
      let initColumns = JSON.parse(JSON.stringify(initialState.columns))
      let columns = custome.length > 0 ? custome : initColumns;
      let userColumns = custome.length > 0 ? JSON.stringify(columns) : JSON.stringify(initColumns)
      localStorage.setItem('__alert_list_userColumns', userColumns)
      yield put({ type: 'customCols', payload: columns })
    },
    //查询告警列表
    *queryAlertList({ payload }, { call, put, select }) {

      // console.log(linew)
      yield put({
        type: 'toggleLoading',
        payload: { isLoading: true }
      })

      var {
        isGroup,
        groupBy,
        begin,
        end,
        pageSize,
        orderBy,
        lineW,
        orderType,
        columns,
      } = yield select(state => {
          const alertListTable = state.alertListTable
          return {
            isGroup: alertListTable.isGroup,
            groupBy: alertListTable.groupBy,
            begin: alertListTable.begin,
            end: alertListTable.end,
            lineW: alertListTable.lineW,
            pageSize: alertListTable.pageSize,
            orderBy: alertListTable.orderBy,
            orderType: alertListTable.orderType,
            columns: alertListTable.columns,
          }
        })

      // 更新每分钟占宽
      const countMins = (end - begin) / (60 * 1000)
      const minuteToWidth = lineW / countMins
      const gridWidth = lineW / 10
      yield put({
        type: 'updateMinToWidth',
        payload: {
          minuteToWidth,
          gridWidth
        }
      })

      var extraParams = {};

      if (payload !== undefined && payload.isGroup !== undefined) {
        isGroup = payload.isGroup;
        groupBy = payload.groupBy;
        orderBy = payload.orderBy;
        orderType = payload.orderType;
      }

      const tagsFilter = yield select(state => {

        return {
          ...state.alertListTable.tagsFilter,
          begin: begin,
          end: end
        }
      })

      // 这里触发时currentPage始终为1，如果从common取在分组转分页时会有问题
      extraParams = {
        pageSize: pageSize,
        currentPage: 1,
        orderBy: orderBy,
        orderType: orderType
      }

      const listData = yield call(queryAlertList, {
        ...tagsFilter,
        ...extraParams
      })

      if (listData.result) {
        const userInfo = yield select((state) => {
          return state.app && state.app.userInfo
        })
        const list = listData.data.datas.map((alert) => {
          if (alert.owner == userInfo.userId) {
            alert.isOwn = true;
          } else {
            alert.isOwn = false;
          }

          return alert;
        })
        yield put({
          type: 'updateAlertListToNoGroup',
          payload: {
            info: list,
            tempListData: list,
            isShowMore: listData.data.hasNext,
            currentPage: 1,
            isGroup: false,
            orderBy: orderBy,
            orderType: orderType,
            levels: listData.data.levels,
            isReRender: false
          }
        })
        yield put({
          type: 'toggleLoading',
          payload: { isLoading: false }
        })
        yield put({
          type: 'alertOperation/initColumn',
          payload: {
            baseCols: columns,
            extend: listData.data.properties,
            tags: listData.data.tagKeys
          }
        })

      } else {
        yield message.error(listData.message, 2)
      }
    },
    // 展开子告警
    *spreadChild({ payload }, { call, put, select }) {
      let haveChild;
      const { data, isGroup, begin, end } = yield select(state => {
        return {
          'isGroup': state.alertListTable.isGroup,
          'data': state.alertListTable.data,
          'begin': state.alertListTable.begin,
          'end': state.alertListTable.end
        }
      })
      // 先看下有没有子告警，没有就查询 有就隐藏
      if (isGroup === true) {
        data.forEach((group) => {
          group.children.forEach((item) => {
            if (item.id == payload) {
              haveChild = !(typeof item.childrenAlert === 'undefined')
            }
          })
        })
      } else if (isGroup === false) {
        data.forEach((item, index) => {
          if (item.id == payload) {
            haveChild = !(typeof item.childrenAlert === 'undefined')
          }
        })
      }

      if (typeof haveChild !== undefined && !haveChild) {
        const childResult = yield call(queryChild, { incidentId: payload, begin: begin, end: end })
        if (childResult.result) {
          yield put({ type: 'addChild', payload: { children: childResult.data, parentId: payload, isGroup: isGroup } })

        } else {
          yield message.error(childResult.message, 2)
        }
      } else if (typeof haveChild !== undefined && haveChild) {
        yield put({ type: 'toggleSpreadChild', payload: { parentId: payload, isGroup: isGroup } })
      } else {
        console.error('haveChild is undefined')
      }
    },
    // 收拢子告警
    *noSpreadChild({ payload }, { call, put, select }) {
      const { isGroup } = yield select(state => {
        return {
          'isGroup': state.alertListTable.isGroup,
        }
      })

      yield put({ type: 'toggleSpreadChild', payload: { parentId: payload, isGroup: isGroup } })
    },
    // 合并告警
    *mergeChildAlert({ payload }, { call, put, select }) {
      let { totalItems, pId, cItems } = payload;
      let relieveItem = []; // 需要释放的子告警
      const { data, isGroup, begin, end } = yield select(state => {
        return {
          'isGroup': state.alertListTable.isGroup,
          'data': state.alertListTable.data,
          'begin': state.alertListTable.begin,
          'end': state.alertListTable.end
        }
      })
      // 处理合并的告警之前有子告警的情况，先释放子告警，再合并
      for (let item of totalItems) {
        // 先判断有没有子告警
        if (item.hasChild) {
          // 有子告警后判断是否需要通过查询得到子告警
          let haveChild = !(typeof item.childrenAlert === 'undefined')
          if (typeof haveChild !== 'undefined' && !haveChild) {
            const childResult = yield queryChild({ incidentId: item.id, begin: begin, end: end })
            if (childResult.result) {
              relieveItem.push(...childResult.data)
            } else {
              yield message.error(childResult.message, 2)
            }
          } else if (typeof haveChild !== 'undefined' && haveChild) {
            relieveItem.push(...item.childrenAlert)
          } else {
            console.error('haveChild is undefined')
          }
        }
      }
      // push childrenAlert/ remove parent/ hasChild -> true/ isSpread -> true
      yield put({ type: 'mergeChildrenAlert', payload: { parentId: pId, childItems: cItems, isGroup: isGroup, relieveItem: relieveItem } })
    },
    // 解除告警
    *relieveChildAlert({ payload }, { call, put, select }) {

      const { isGroup, begin, end } = yield select(state => {
        return {
          'isGroup': state.alertListTable.isGroup,
        }
      })

      yield put({ type: 'addParent', payload: { addItem: payload.childs, parentId: payload.relieveId, isGroup: isGroup } })

    },
    // 展开组
    *spreadGroup({ payload }, { call, put, select }) {
      yield put({ type: 'toggleGroupSpread', payload: payload })
    },
    // 合拢组
    *noSpreadGroup({ payload }, { call, put, select }) {
      yield put({ type: 'addGroupSpread', payload: payload })
    },
    // ------------------------------------------------------------------------------------------------

    // 点击分组时触发
    *setGroup({ payload }, { select, put, call }) {
      const { tempListData, levels } = yield select(state => {
        return {
          'tempListData': state.alertListTable.tempListData,
          'levels': state.alertListTable.levels
        }
      })

      if (payload.isGroup) {
        yield put({
          type: 'toggleLoading',
          payload: { isLoading: true }
        })
        const groupList = yield groupSort()(tempListData, payload.group)
        if (payload.group !== undefined && payload.group === 'severity') {
          groupList.sort((prev, next) => {
            return Number(next.classify) - Number(prev.classify);
          })
        }
        yield put({
          type: 'updateAlertListToGroup',
          payload: {
            info: groupList,
            isShowMore: false,
            isGroup: true,
            groupBy: payload.group,
            levels: levels,
            isReRender: false
          }
        })
        yield put({
          type: 'toggleLoading',
          payload: { isLoading: false }
        })
        //yield put({ type: 'queryAlertList', payload: { isGroup: payload.isGroup, groupBy: payload.group } })
      } else {
        yield put({ type: 'queryAlertList', payload: { isGroup: payload.isGroup, orderBy: undefined, orderType: undefined } })
      }
    },
    // show more
    *loadMore({ }, { call, put, select }) {
      const isLoading = yield select((state) => state.alertListTable.isLoading);
      if (isLoading) {
        return;
      }

      yield put({
        type: 'toggleLoading',
        payload: { isLoading: true }
      })

      let { currentPage, listData, alertListTable } = yield select(state => {
        return {
          'currentPage': state.alertListTable.currentPage,
          'listData': state.alertListTable.data,
          'alertListTable': state.alertListTable
        }
      })

      currentPage = currentPage + 1
      const params = {
        currentPage: currentPage,
        begin: alertListTable.begin,
        end: alertListTable.end,
        orderBy: alertListTable.orderBy,
        orderType: alertListTable.orderType,
        pageSize: alertListTable.pageSize,
        ...alertListTable.tagsFilter,
      }

      const listReturnData = yield call(queryAlertList, params)

      if (listReturnData.result) {

        listData = listData.concat(listReturnData.data.datas);

        yield put({
          type: 'resetCheckAlert',
          payload: {
            // origin: alertListTable.checkAlert,
            // newObj: listData
            moreData: listReturnData.data.datas,
            isReRender: false
          }
        })
        if (!listReturnData.data.hasNext) {
          yield put({
            type: 'updateShowMore',
            payload: { isShowMore: listReturnData.data.hasNext, isReRender: false }
          })
        }

        yield put({
          type: 'updateAlertListData',
          payload: {
            data: listData,
            tempListData: listData,
            newLevels: listReturnData.data.levels,
            isReRender: false
          }
        })

        yield put({ type: 'setMore', payload: { currentPage, isReRender: false } })

        yield put({
          type: 'toggleLoading',
          payload: { isLoading: false }
        })
        yield put({
          type: 'alertOperation/addProperties',
          payload: {
            properties: listReturnData.data.properties,
            tags: listReturnData.data.tagKeys
          }
        })
      } else {
        yield message.error(listReturnData.message, 2)
      }
    },
    //orderList排序
    *orderList({ payload }, { select, put, call }) {
      //yield put({ type: 'toggleOrder', payload: payload })
      yield put({ type: 'queryAlertList', payload: { isGroup: false, orderBy: payload.orderBy, orderType: payload.orderType } })
    },
    //orderByTittle
    *orderByTittle({ payload }, { select, put, call }) {
      const { orderType } = yield select(state => {
        return {
          'orderType': state.alertListTable.orderType,
        }
      })
      if (payload !== undefined) {
        yield put({
          type: 'toggleOrder',
          payload: {
            orderBy: payload,
            orderType: orderType === undefined || orderType === 1 ? 0 : 1,
            isReRender: false
          }
        })
        yield put({ type: 'queryAlertList' })
      } else {
        console.error('orderBy error')
      }
    },
    *orderFlowNumClick({ payload: { orderFlowNum, id } }, { select, put, call }) {
      const itsmDetailUrlData = yield call(viewTicket, orderFlowNum);
      if (itsmDetailUrlData.result) {
        const itsmDetailUrl = itsmDetailUrlData.data.url;
        yield put({ type: 'updateDataRow', payload: { itsmDetailUrl, id } })
        window.open(itsmDetailUrl);
      } else {
        yield message.error(itsmDetailUrlData.message, 2)
      }
    },

    // 响应列表项的选中状态
    *handleCheckboxClick({ payload: { alertId } }, { select, put, call }) {
      // const startDate = new Date();

      yield put({ type: 'changeCheckAlert', payload: { alertId } });

      const selectedAlertIds = yield select(state => state.alertListTable.selectedAlertIds)
      // 如果列表为空，或者其中有一个未接手的，disabled都为true
      const disabled = selectedAlertIds.length === 0;

      yield put({
        type: 'alertOperation/setButtonsDisable',
        payload: disabled
      })

      // console.log(new Date() - startDate, "check");
    },

    // 点击全选按钮
    *handleSelectAll({ payload: { checked, isNeedCheckOwner } }, { select, put, call }) {
      const checkAlert = yield select(state => state.alertListTable.checkAlert);
      // let newStatus = !selectedAll;
      let ids = Object.keys(checkAlert);

      let newOperateAlertIds = [];
      let newSelectedAlertIds = [];
      if (checked) {
        newOperateAlertIds = ids;
        newSelectedAlertIds = ids.map(id => checkAlert[id].info);
      } else {
        newOperateAlertIds = [];
        newSelectedAlertIds = [];
      }
      if (isNeedCheckOwner) {
        ids.forEach((id) => {
          const info = checkAlert[id].info;
          if (info.isOwn) {
            checkAlert[id].checked = checked;
          } else {
            checkAlert[id].checked = false;
          }
        });
      } else {
        ids.forEach((id) => {
          checkAlert[id].checked = checked;
        })
      }

      yield put({
        type: 'toggleSelectedAll',
        payload: {
          selectedAll: checked,
          checkAlert,
          operateAlertIds: newOperateAlertIds,
          selectedAlertIds: newSelectedAlertIds
        }
      });
      const disabled = newSelectedAlertIds.length === 0;
      yield put({
        type: 'alertOperation/setButtonsDisable',
        payload: disabled
      })
    }
  },
}
