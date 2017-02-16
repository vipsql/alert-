import {parse} from 'qs'

const initalState = {
  isShowDetail: true, // 是否显示detail

  currentAlertDetail: {
    id: 1,
    name: '不满意交易笔数告警',
    state: 1, // 状态（后台定义：1：已解决）
    stateName: '已解决',
    levelName: '紧急',
    level: 1, // 级别 同状态
    origin: 'CMDB',
    description: '不满意交易笔数超过阈值2000',
    firstHappend: '2017/1/20 15:27', // 时间格式后期需要处理
    endHappend: '2017/1/24 10:31',
    continueTime: '2小时',
    alertTime: 13,
    managePerson: '张某某',
    manageDepartment: '---',
    form: '张某某张某某张某某张某某张某某张某某张某某张某某张某某张某某张某某张某某', // 工单
    affiliation: '江城分区', // 所属单位
    position: '华中区域',
    david: '武汉联通', // 代维商
    remark: '备注信息', // 备注
  },

  operateForm: undefined, // 操作工单（当前） 
  isSowOperateForm: false, // 是否显示操作工单文本

  operateRemark: undefined, // 备注信息
  isShowRemark: false, // 是否显示备注框
    
}

export default {
  namespace: 'alertDetail',

  state: initalState,

  subscriptions: {

  },

  effects: {
    *initalForm() {
      // 将初始的detail form --> operateForm
    }
  },

  reducers: {
    // 初始化operateForm
    initalFormData(state) {
      return { ...state, operateRemark: state.currentAlertDetail.form }
    },
    // 切换侧滑框的状态
    toggleDetailModal(state, {payload: isShowDetail}) {
      return { ...state, isShowDetail }
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
