import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Form, Input, Select, DatePicker, Button, Popover, Checkbox, message } from 'antd'
import ListTableWrap from './queryList.js'
import AlertOriginSliderWrap from '../alertOriginSlider/wrap'
import AlertDetaiWrap from '../alertDetail/wrap'
import { classnames } from '../../utils'
import AlertDetail from '../common/alertDetail/index.js'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import SuppressModal from '../common/suppressModal/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import ReassignModal from '../common/reassignModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'
import ScrollTopButton from '../common/scrollTopButton/index.js'
import AutoRefresh from '../common/autoRefresh'
import Filter from './filter'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import moment from 'moment'
import $ from 'jquery'
import _ from 'lodash'

const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;
const Option = Select.Option;
class alertQueryManage extends Component {

  constructor(props) {
    super(props)
  }

  componentDidMount() {
    const { dispatch, intl: { formatMessage } } = this.props;
    window.addEventListener('message', (e) => {
      if (e.data.createTicket !== undefined && e.data.createTicket === 'success') {
        const localeMessage = defineMessages({
          successMsg: {
            id: 'alertOperate.dispatch.success',
            defaultMessage: "派单成功，工单号为：{flowNo}",
          }
        })
        message.success(formatMessage({ ...localeMessage['successMsg'] }, { flowNo: e.data.flowNo }));
        dispatch({
          type: 'alertDetail/afterDispatch',
        })
      }
    }, false)
  }

  render() {
    const { dispatch, form, alertOperation, intl: { formatMessage } } = this.props;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    const refreshList = (response) => {
      if (response && response.result) {
        dispatch({
          type: 'alertQuery/queryAlertList'
        })
      }
    }

    const alertDetailWrapProps = {
      afterTakeOver: refreshList,
      afterClose: refreshList, // 告警关闭后的回调方法
      afterDispatch: refreshList, // 告警派发后的回调方法
      afterChatOpsh: refreshList, // 告警发送到ChatOps后的回调方法
      afterResolve: refreshList, // 告警解决后的回调方法
      afterSuppress: refreshList, // 告警抑制后的回调方法
      afterReassign: refreshList, // 告警转派后的回调方法
      afterMunalNotify: refreshList // 告警通知后的回调方法
    }

    return (
      <div style={{ position: 'relative' }}>
        <AutoRefresh origin='alertList' top={"-50px"} refresh={() => {
          dispatch({
            type: 'alertQuery/queryAlertList'
          })
        }} />
        <Filter />
        <ListTableWrap />
        <ScrollTopButton />
        <AlertOriginSliderWrap />
        <AlertDetaiWrap { ...alertDetailWrapProps } />
      </div>
    )
  }
}

export default injectIntl(connect()(alertQueryManage))
