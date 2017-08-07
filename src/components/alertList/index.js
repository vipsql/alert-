import React, { PropTypes, Component } from 'react'

import { Tabs, Select, Switch, Checkbox, Button, message } from 'antd'
import ListTableWrap from './listTable'
import ListTimeTableWrap from './listTimeTable'
import VisualAnalyzeWrap from './visualAnalyze'
import AlertDetailWrap from '../alertDetail/wrap'
import AlertOperationWrap from '../alertOperation/wrap'
import AlertBar from './alertBar'
import AlertTagsFilter from './alertTagsFilter'
import AlertOperation from '../common/alertOperation/index.js'
import AlertDetail from '../common/alertDetail/index.js'
import { connect } from 'dva'
import styles from './index.less'
import LevelIcon from '../common/levelIcon/index.js'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import SuppressModal from '../common/suppressModal/index.js'
import ReassignModal from '../common/reassignModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import AlertOriginSliderWrap from '../alertOriginSlider/wrap.js'
import FilterHead from '../common/filterHead/index.js'
import ScrollTopButton from '../common/scrollTopButton/index'
import AutoRefresh from '../common/autoRefresh'
import { classnames } from '../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const TabPane = Tabs.TabPane

const statusOperationMap = {
  'NEW': ['takeOver', 'reassign', 'merge', 'other'],
  'PROGRESSING': ['dispatch', 'reassign', 'close', 'resolve', 'merge'],
  'RESOLVED': ['close', 'reassign', 'merge'],
  'EXCEPTCLOSE': ['merge', 'other'],
}

// “不同状态的过滤”与“是否禁止非自己的告警选择框”的关系
const isNeedCheckOwnerMap = {
  'NEW': false,
  'PROGRESSING': true,
  'RESOLVED': true,
  'EXCEPTCLOSE': false
}

class AlertListManage extends Component {
  constructor(props) {
    super(props);
    this.ITSMPostMessage = this.ITSMPostMessage.bind(this)
  }

  ITSMPostMessage(e) {
    console.log(e, 'alertList postMessage count');
    const { dispatch, intl: { formatMessage } } = this.props;
    if (e.data.createTicket !== undefined && e.data.createTicket === 'success') {
      const localeMessage = defineMessages({
        successMsg: {
          id: 'alertOperate.dispatch.success',
          defaultMessage: "派单成功，工单号为：{ flowNo }",
        }
      })
      message.success(formatMessage({ ...localeMessage['successMsg'] }, { flowNo: e.data.flowNo }));
      dispatch({
        type: 'alertOperation/afterDispatch'
      })
    }
  }

  componentDidMount() {
    const { dispatch, alertManage={}, intl: { formatMessage } } = this.props;

    dispatch({ type: 'alertOperation/changeShowOperation', payload: { showOperations: statusOperationMap[alertManage.selectedStatus || 'NEW'] } });

    window.addEventListener('message', this.ITSMPostMessage, false)
  }

  componentWillUnmount() {
    window.removeEventListener('message', this.ITSMPostMessage, false)
  }

  render() {

    const { alertDetail, alertListTable, alertList, userInfo, dispatch, alertOperation, alertManage, intl: { formatMessage } } = this.props;

    const localeMessage = defineMessages({
      tab_list: {
        id: 'alertList.tabs.list',
        defaultMessage: '列表'
      },
      assign_ticket: {
        id: 'alertDetail.ticket.assgin',
        defaultMessage: '派发工单'
      },
      tab_time: {
        id: 'alertList.tabs.timeList',
        defaultMessage: '时间线'
      },
      tab_visual: {
        id: 'alertList.tabs.visual',
        defaultMessage: '可视化分析'
      },
      noAlert: {
        id: 'alertManage.noAlert',
        defaultMessage: '无告警'
      }
    })

    const { levels } = alertListTable;

    const toggleBarButtonClick = (e) => {
      const isShowAlertBar = !alertList.isShowBar;
      dispatch({
        type: 'alertList/toggleBar',
        payload: isShowAlertBar,
      })
    }

    const refresh = () => {
      dispatch({
        type: 'alertList/refresh'
      })
    }

    const tabList = classnames(
      'iconfont',
      'icon-liebiao',
      styles['listTab']
    )
    const tabLine = classnames(
      'iconfont',
      'icon-shijian',
      styles['timeTab']
    )
    const tabVisual = classnames(
      'iconfont',
      'icon-yunweichangjing',
      styles['visualTab']
    )
    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux'
    )
    const zhankaiClass = classnames(
      'iconfont',
      'icon-xialasanjiao'
    )
    const shouqiClass = classnames(
      'iconfont',
      'icon-xialasanjiao-copy'
    )
    // 转数字匹配等级，并作排序
    let levels_wapper = {};
    Object.keys(levels).length !== 0 && Object.keys(levels).forEach((severity) => {
      switch (severity) {
        case 'Critical':
          levels_wapper['3'] = levels['Critical']
          break;
        case 'Warning':
          levels_wapper['2'] = levels['Warning']
          break;
        case 'Information':
          levels_wapper['1'] = levels['Information']
          break;
        case 'Recovery':
          levels_wapper['0'] = levels['Recovery']
          break;
        default:
          break;
      }
    })
    const groupName = localStorage.getItem('__visual_group'),
      isShowVisualTab = !(groupName == 'source' || groupName == 'status' || groupName == 'severity');

    const updateRow = (response, currentAlertDetail) => {
      if(response && response.result) {
        dispatch({
          type: 'alertListTable/updateDataRow',
          payload: currentAlertDetail
        })
      }
    }

    const alertDetailWrapProps = {
      afterTakeOver: updateRow,
      afterClose: updateRow, // 告警关闭后的回调方法
      afterDispatch: updateRow, // 告警派发后的回调方法
      afterChatOpsh: updateRow, // 告警发送到ChatOps后的回调方法
      afterResolve: updateRow, // 告警解决后的回调方法
      afterSuppress: updateRow, // 告警抑制后的回调方法
      afterReassign: updateRow, // 告警转派后的回调方法
      afterMunalNotify: updateRow // 告警通知后的回调方法
    }

    return (
      <div style={{ position: 'relative' }}>
        <AutoRefresh origin='alertList' refresh={refresh} />
        <FilterHead
          style={{ marginBottom: '20px' }}
          defaultTime={alertManage.selectedTime}
          defaultStatus={alertManage.selectedStatus}
          queryByTime={(value) => {
            dispatch({ type: 'tagListFilter/selectTime', payload: value })
          }}
          queryByStatus={(value) => {
            const showOperations = statusOperationMap[value];
            dispatch({ type: 'alertOperation/changeShowOperation', payload: { showOperations } })
            dispatch({ type: 'tagListFilter/selectStatus', payload: value })
          }}
        />
        <div className={alertList.isShowBar ? styles.showBar : styles.hideBar}>
          <AlertTagsFilter />
          <AlertBar />
        </div>
        <Button className={classnames(styles.toggleBarButton, zhankaiClass)} onClick={toggleBarButtonClick} size="small"><i className={classnames(alertList.isShowBar ? shouqiClass : zhankaiClass, styles.toggleBarButtonIcon)} /></Button>
        <div className={styles.alertListPage + " " + (alertList.isShowBar ? '' : styles.marginTop0)}>
          <Tabs defaultActiveKey="1">
            <TabPane tab={<span className={tabList}><FormattedMessage {...localeMessage['tab_list']} /></span>} key='1'>
              {/*<AlertOperation position='list' {...operateProps} />*/}
              <AlertOperationWrap />
              <ListTableWrap isNeedCheckOwner={ isNeedCheckOwnerMap[alertManage.selectedStatus] && userInfo.supervisor != "1" } topFixArea={<AlertOperationWrap />} topHeight={alertList.isShowBar ? 366 : 216} />
            </TabPane>
            <TabPane tab={<span className={tabLine} ><FormattedMessage {...localeMessage['tab_time']} /></span>} key='2'>
              {/*<AlertOperation position='timeAxis' {...operateProps} />*/}
              <AlertOperationWrap isShowColSetBtn={ false } />
              <ListTimeTableWrap isNeedCheckOwner={ isNeedCheckOwnerMap[alertManage.selectedStatus] && userInfo.supervisor != "1" }/>
            </TabPane>
            {isShowVisualTab &&
              <TabPane tab={<span className={tabVisual}><FormattedMessage {...localeMessage['tab_visual']} /></span>} key='3'>
                <VisualAnalyzeWrap key={new Date().getTime()} />
              </TabPane>
            }
          </Tabs>
          <ul className={styles.levelBar}>
            {
              Object.keys(levels_wapper).length !== 0 && Object.keys(levels_wapper).sort((prev, next) => {
                return Number(next) - Number(prev);
              }).map((key, index) => {
                return (<li key={index}><LevelIcon extraStyle={styles.extraStyle} iconType={key} /><p>{`${window['_severity'][key]}（${levels_wapper[key]}）`}</p></li>)
              })
            }
            <li><LevelIcon extraStyle={styles.extraStyle} iconType='noAlerts' /><p><FormattedMessage {...localeMessage['noAlert']} /></p></li>
          </ul>
        </div>

        <AlertDetailWrap { ...alertDetailWrapProps }/>
        <AlertOriginSliderWrap />
        <ScrollTopButton />
      </div>
    )
  }
}

export default injectIntl(connect((state) => {
  return {
    alertManage: state.alertManage,
    alertListTable: state.alertListTable,
    alertList: state.alertList,
    userInfo: state.app.userInfo
  }
})(AlertListManage))
