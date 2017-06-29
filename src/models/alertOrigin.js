import { queryAlertOrigin } from '../services/alertQuery.js'
import { message } from 'antd'

export default {
  namespace: 'alertOrigin',
  state: {
    loading: false,
    visible: false,
    alertName: '',
    times: 0,
    records: [],
    pagination:{ pageNo:1, pageSize:10 },
    sorter: { sortKey:'occurTime', sortType: 1 },
  },
  reducers: {
    toggleLoading(state, { payload: { loading }}) {
      return { ...state, loading};
    },

    setData(state, { payload }) {
      return { ...state, ...payload }
    },

    toggleVisible(state, { payload: { visible, alertName } }) {
      return { ...state, visible, alertName };
    }
  },

  effects: {
    // 查询
    *queryAlertOrigin({payload}, {call, put, select}) {
      yield put({
        type: 'toggleLoading',
        payload: {
          loading: true
        }
      })
      const oldAlertOrigin = yield select((state) => state.alertOrigin);
      payload.pagination = { ...oldAlertOrigin.pagination, ...payload.pagination }
      payload.sorter = { ...oldAlertOrigin.sorter,  ...payload.sorter};
      const newAlertOrigin = { ...oldAlertOrigin,  ...payload}
      const response = yield queryAlertOrigin({ pagination: newAlertOrigin.pagination, sorter: newAlertOrigin.sorter, alertId: newAlertOrigin.alertId })
      // 请求无论成功还是失败都停止“记载中”状态
      yield put({
        type: 'toggleLoading',
        payload: {
          loading: false
        }
      })
      if(!response.result) {
        yield message.error(window.__alert_appLocaleData.messages[response.message], 2);
        return;
      }
      const responseData = response.data;
      const records = responseData.records.map((row, index) => {
        const time = new Date(row.occurTime);
        const occurTime = time.getMonth() + "/" + time.getDay() + " " + time.getHours() + ":" + time.getMinutes()
        return {...row, key: index, occurTime}}
      )
      const newPayload = {
        ...newAlertOrigin,
        pagination: {
          pageNo: responseData.pageNo,
          pageSize: responseData.pageSize,
          totalPage: responseData.totalPage,
          total: responseData.total,
        },
        records,
        loading: false
      }
      yield put({
        type: 'setData',
        payload: newPayload
      })
    },

    *changePage({ payload: { pagination, sorter } }, {call, put, select}) {
      yield put({
        type: 'queryAlertOrigin',
        payload: { pagination, sorter }
      })
    }
  }
}