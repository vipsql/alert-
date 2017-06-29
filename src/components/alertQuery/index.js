import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Form, Input, Select, DatePicker, Button, Popover, Checkbox} from 'antd'
import ListTableWrap from './queryList.js'
import { classnames } from '../../utils'
import AlertDetail from '../common/alertDetail/index.js'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'
import ChatOpshModal from '../common/chatOpsModal/index.js'
import ResolveModal from '../common/resolveModal/index.js'
import SuppressModal from '../common/suppressModal/index.js'
import ManualNotifyModal from '../common/manualNotifyModal/index.js'
import SuppressTimeSlider from '../common/suppressTimeSlider/index.js'
import AlertOriginSlider from '../common/AlertOriginSlider/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import $ from 'jquery'

const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;
const Option = Select.Option;
class alertQueryManage extends Component{

    constructor(props) {
      super(props)
    }

    componentDidMount() {
      const {dispatch} = this.props;
      window.addEventListener('message', (e) => {
        if(e.data.creatTicket !== undefined && e.data.creatTicket === 'success') {
          dispatch({
            type: 'alertQueryDetail/afterDispatch',
          })
        }
      }, false)
    }

    render() {
      const {dispatch, form, alertQuery, alertQueryDetail, alertOrigin, intl: {formatMessage}} = this.props;

      const { haveQuery, sourceOptions, propertyOptions, ownerOptions, queryCount, isShowBar } = alertQuery;

      const { selectGroup, columnList, extendColumnList, extendTagsKey, } = alertQueryDetail

      const { getFieldDecorator, getFieldsValue } = form;

      const formItemLayout = {
        labelCol: { span: 6 },
        wrapperCol: { span: 12 },
      };

      const switchClass = classnames(
          'icon',
          'iconfont',
          'icon-anonymous-iconfont'
      )

      const setClass = classnames(
          'icon',
          'iconfont',
          'icon-bushu'
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

      const toggleBarButtonClick = (e) => {
        const isShowAlertBar = !alertQuery.isShowBar;
        dispatch({
          type: 'alertQuery/toggleBar',
          payload: isShowAlertBar,
        })
      }

      const operateProps = {

        dispatchFunc: (position) => {
          dispatch({
              type: 'alertQueryDetail/openFormModal',
          })
        },
        closeFunc: (position) => {
          dispatch({
              type: 'alertQueryDetail/openCloseModal',
          })
        },
        resolveFunc: (position) => {
          dispatch({
              type: 'alertQueryDetail/toggleResolveModal',
              payload: true
          })
        },
        showChatOpsFunc: (position) => {
          dispatch({
            type: 'alertQueryDetail/openChatOps',
          })
        },
        showNotifyFunc: (position) => {
          dispatch({
            type: 'alertQueryDetail/openNotify',
          })
        },
        suppressIncidents: (min, position) => {
          dispatch({
            type: 'alertQueryDetail/suppressIncidents',
            payload: {
              time: min
            }
          })
        },
        showSuppressTimeSlider: (position) => {
          dispatch({
            type: 'alertQueryDetail/openSuppressTimeSlider',
          })
        }
      }

      const currentAlertDetail = alertQueryDetail['currentAlertDetail'] || {};
      const alertDeatilProps = {
        extraProps: {
          currentAlertDetail: alertQueryDetail.currentAlertDetail,
          isShowOperateForm: alertQueryDetail.isShowOperateForm,
          operateForm: alertQueryDetail.operateForm,
          isShowRemark: alertQueryDetail.isShowRemark,
          operateRemark: alertQueryDetail.operateRemark,
          ciUrl: alertQueryDetail.ciUrl,
          isLoading: alertQueryDetail.isLoading
        },
        operateProps: {
          ...operateProps,
          // 子告警不能派发、已关闭的不能派发
          dispatchDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255,
          // 子告警不能关闭、处理中和已关闭的不能关闭
          closeDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255 || currentAlertDetail['status'] == 40,
          // 子告警不能解决、已解决和已关闭的不能解决
          resolveDisabled: currentAlertDetail['parentId'] || currentAlertDetail['status'] == 255 || currentAlertDetail['status'] == 190,
          // 子告警不能通知、只有未接手和处理中的告警能通知
          notifyDisabled: currentAlertDetail['parentId'] || !(currentAlertDetail['status'] == 0 || currentAlertDetail['status'] == 150),
          // 子告警不能分享
          shareDisabled: currentAlertDetail['parentId']
        },

        closeDeatilModal: () => {
          dispatch({
              type: 'alertQueryDetail/closeDetailModal',
              payload: false
          })
        },
        clickTicketFlow: (operateForm) => {
          if (operateForm !== undefined && operateForm !== '') {
            dispatch({
                type: 'alertQueryDetail/viewTicketDetail',
                payload: operateForm
            })
          }
        },
        openForm: () => {
          dispatch({
              type: 'alertQueryDetail/toggleFormModal',
              payload: true
          })
        },
        editForm: (formData) => {
          dispatch({
              type: 'alertQueryDetail/changeTicketFlow',
              payload: formData.formContent
          })
          dispatch({
              type: 'alertQueryDetail/toggleFormModal',
              payload: false
          })
        },
        closeForm: () => {
          dispatch({
              type: 'alertQueryDetail/toggleFormModal',
              payload: false
          })
        },
        openRemark: () => {
          dispatch({
              type: 'alertQueryDetail/toggleRemarkModal',
              payload: true
          })
        },
        editRemark: (formData) => {
          dispatch({
              type: 'alertQueryDetail/setRemarkData',
              payload: formData.remark
          })
          dispatch({
              type: 'alertQueryDetail/toggleRemarkModal',
              payload: false
          })
        },
        closeRemark: () => {
          dispatch({
              type: 'alertQueryDetail/toggleRemarkModal',
              payload: false
          })
        }
      }

      const closeModalProps = {
        currentData: alertQueryDetail,

        onOk: (form) => {
          form.validateFieldsAndScroll( (errors, values) => {
              if (!!errors) {
                  return;
              }
              const formData = form.getFieldsValue()

              dispatch({
                  type: 'alertQueryDetail/closeAlert',
                  payload: formData.closeMessage
              })
              form.resetFields();
          })

        },
        onCancal: (form) => {
          dispatch({
              type: 'alertQueryDetail/toggleCloseModal',
              payload: false
          })
          form.resetFields();
        }
      }

      const resolveModalProps = {
        currentData: alertQueryDetail,

        onOk: (form) => {
          form.validateFieldsAndScroll( (errors, values) => {
              if (!!errors) {
                  return;
              }
              const formData = form.getFieldsValue()

              dispatch({
                  type: 'alertQueryDetail/resolveAlert',
                  payload: formData.resolveMessage
              })
              form.resetFields();
          })

        },
        onCancal: (form) => {
          dispatch({
              type: 'alertQueryDetail/toggleResolveModal',
              payload: false
          })
          form.resetFields();
        }
      }

      const dispatchModalProps = {
        currentData: alertQueryDetail,

        closeDispatchModal: () => {
          dispatch({
              type: 'alertQueryDetail/toggleDispatchModal',
              payload: false
          })
        },
        onOk: (value) => {
          dispatch({
              type: 'alertQueryDetail/dispatchForm',
              payload: value
          })
        },
        onCancal: () => {
          dispatch({
              type: 'alertQueryDetail/toggleDispatchModal',
              payload: false
          })
        }
      }

      const chatOpsModalProps = {
        currentData: alertQueryDetail,

        closeChatOpsModal: () => {
          dispatch({
              type: 'alertQueryDetail/toggleChatOpsModal',
              payload: false
          })
        },
        onOk: (value) => {
          dispatch({
              type: 'alertQueryDetail/shareChatOps',
              payload: value
          })
        },
        onCancal: () => {
          dispatch({
              type: 'alertQueryDetail/toggleChatOpsModal',
              payload: false
          })
        }
      }

      const notifyModalProps = {
        disableChatOps: alertQueryDetail.disableChatOps,
        isShowNotifyModal: alertQueryDetail.isShowNotifyModal,
        notifyIncident: alertQueryDetail.notifyIncident,
        notifyUsers: alertQueryDetail.notifyUsers,
        onOk: (data) => {
          dispatch({
            type: "alertQueryDetail/notyfiyIncident",
            payload: data
          })
        },
        onCancel: () => {
          dispatch({
            type: "alertQueryDetail/initManualNotifyModal",
            payload: {
              isShowNotifyModal: false
            }
          })
        }
      }

      const timeSliderProps = {
        isShowTimeSliderModal: alertQueryDetail.isShowTimeSliderModal,
        onOk: (time) => {
          dispatch({
            type: "alertQueryDetail/suppressIncidents",
            payload: {
              time: time
            }
          })
          dispatch({
            type: "alertQueryDetail/toggleSuppressTimeSliderModal",
            payload: false
          })
        },
        onCancel: () => {
          dispatch({
            type: "alertQueryDetail/toggleSuppressTimeSliderModal",
            payload: false
          })
        }
      }

      const suppressModalProps = {
        isShowRemindModal: alertQueryDetail.isShowRemindModal,
        onKnow: (checked) => {
          if (checked) {
            localStorage.setItem('__alert_suppress_remind', 'false')
          }
          dispatch({
            type: "alertQueryDetail/toggleRemindModal",
            payload: false
          })
        }
      }

      const ticketModalProps = {
        isShowTicketModal: alertQueryDetail.isShowTicketModal,
        ticketUrl: alertQueryDetail.ticketUrl,
        onCloseTicketModal(){
          dispatch({
            type: 'alertQueryDetail/closeTicketModal'
          })
        }
      }

      const alertOriginSliderProps = {
        intl: {formatMessage},
        onClose: () => {
          dispatch({
            type: 'alertOrigin/toggleVisible',
            payload: {
              visible: false
            }
          })
        },
        onPageChange: (pagination, filters, sorter) => {
          const pageIsObj = typeof pagination === 'object';
          dispatch({
            type: 'alertOrigin/changePage',
            payload: {
              pagination: {
                pageNo: pageIsObj?pagination.current:pagination
              },
              sorter: {
                sortKey: sorter?sorter.field:undefined,
                sortType: sorter?(sorter.order == "descend"?0:1):undefined
              }
            }
          })
        },
        visible: alertOrigin.visible,
        loading: alertOrigin.loading,
        alertOrigin
      }

      const localeMessage = defineMessages({
          owner: {
            id: 'alertDetail.owner',
            defaultMessage: '负责人'
          },
          occurTime: {
              id: 'alertList.title.occurTime',
              defaultMessage: '发生时间',
          },
          severity: {
              id: 'alertList.title.severity',
              defaultMessage: '告警级别',
          },
          entityName:{
              id: 'alertList.title.enityName',
              defaultMessage: '对象',
          },
          name: {
              id: 'alertList.title.name',
              defaultMessage: '告警名称',
          },
          source: {
              id: 'alertList.title.source',
              defaultMessage: '告警来源',
          },
          status:{
              id: 'alertList.title.status',
              defaultMessage: '告警状态',
          },
          description:{
              id: 'alertList.title.description',
              defaultMessage: '告警描述',
          },
          count:{
              id: 'alertList.title.count',
              defaultMessage: '次数',
          },
          classCode:{
              id: 'alertList.title.classCode',
              defaultMessage: '资源类型',
          },
          tags:{
              id: 'alertList.title.tags',
              defaultMessage: '标签',
          },
          lastTime:{
              id: 'alertList.title.lastTime',
              defaultMessage: '持续时间',
          },
          lastOccurTime:{
              id: 'alertQuery.label.lastOccurTime',
              defaultMessage: '最后发生时间',
          },
          firstOccurTime:{
              id: 'alertQuery.label.firstOccurTime',
              defaultMessage: '首次发生时间',
          },
          entityAddr:{
              id: 'alertList.title.entityAddr',
              defaultMessage: 'IP地址',
          },
          orderFlowNum:{
              id: 'alertList.title.orderFlowNum',
              defaultMessage: '关联工单',
          },
          notifyList:{
              id: 'alertList.title.notifyList',
              defaultMessage: '是否分享',
          },
          basic: {
              id: 'alertList.title.basic',
              defaultMessage: '常规',
          },
          additional: {
              id: 'alertList.title.additional',
              defaultMessage: '扩展',
          },
          columns: {
              id: 'alertOperate.columns',
              defaultMessage: '列定制',
          },
          groupBy: {
              id: 'alertOperate.groupBy',
              defaultMessage: '分组显示',
          },
          groupByEnityName: {
              id: 'alertOperate.groupByEnityName',
              defaultMessage: '按对象分组',
          },
          groupBySource: {
              id: 'alertOperate.groupBySource',
              defaultMessage: '按来源分组',
          },
          groupByStatus: {
              id: 'alertOperate.groupByStatus',
              defaultMessage: '按状态分组',
          },
          groupBySeverity: {
              id: 'alertOperate.groupBySeverity',
              defaultMessage: '按级别分组',
          },
          groupByOther: {
              id: 'alertOperate.groupByOther',
              defaultMessage: '按{other}分组',
          },
          keyWords: {
              id: 'alertQuery.label.keyWords',
              defaultMessage: '关键字',
          },
          keyWords_placeholder: {
              id: 'alertQuery.label.keyWords.placeholder',
              defaultMessage: '请输入关键字',
          },
          notifyList_placeholder: {
              id: 'alertQuery.label.notifyList.placeholder',
              defaultMessage: '请选择是否分享',
          },
          notifyList_yes: {
              id: 'alertQuery.label.notifyList.yes',
              defaultMessage: '是',
          },
          notifyList_no: {
              id: 'alertQuery.label.notifyList.no',
              defaultMessage: '否',
          },
          allSource: {
              id: 'alertQuery.label.allSource',
              defaultMessage: '所有来源',
          },
          severity_placeholder: {
              id: 'alertQuery.label.severity.placeholder',
              defaultMessage: '请选择级别',
          },
          allStatus: {
              id: 'alertQuery.label.allStatus',
              defaultMessage: '所有状态',
          },
          allOwners: {
            id: 'alertQuery.label.allOwners',
            defaultMessage: '所有负责人'
          },
          duration: {
              id: 'alertQuery.label.duration',
              defaultMessage: '持续时间',
          },
          duration_placeholder: {
              id: 'alertQuery.label.duration.placeholder',
              defaultMessage: '请选择持续时间',
          },
          count_placeholder: {
              id: 'alertQuery.label.count.placeholder',
              defaultMessage: '请选择告警次数',
          },
          noQueryData: {
              id: 'alertQuery.noQueryData',
              defaultMessage: '暂无数据，请先选择查询条件',
          },
          search: {
              id: 'alertQuery.search',
              defaultMessage: '搜索',
          },
          reset: {
              id: 'alertQuery.reset',
              defaultMessage: '重置',
          },
          result: {
              id: 'alertQuery.result',
              defaultMessage: "共{total}个结果（紧急{critical}个，警告{warning}个，提醒{informaiton}个，正常{ok}个）",
          },
          assign_ticket: {
              id: 'alertDetail.ticket.assgin',
              defaultMessage: '派发工单'
          },
          IP_address: {
              id: 'alertList.title.entityAddr',
              defaultMessage: 'IP地址'
          }
      })

      const popoverContent = <div className={styles.popoverMain}>
          {
              columnList.map( (group, index) => {
                  return (
                      <div key={index} className={styles.colGroup}>
                          <p>{group.type == 0 ? <FormattedMessage {...localeMessage['basic']} /> : <FormattedMessage {...localeMessage['additional']} />}</p>
                          {
                              group.cols.map( (item, index) => {
                                  if (item.id === 'entityName' || item.id === 'name') {
                                      return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={true} disabled={true} >
                                              { item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}
                                            </Checkbox></div>
                                  } else {
                                      return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={item.checked} onChange={ (e) => {
                                          dispatch({
                                              type: 'alertQueryDetail/checkColumn',
                                              payload: e.target.value,
                                          })
                                      }}>{ item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}</Checkbox></div>
                                  }
                              })
                          }
                      </div>
                  )
              })
          }
      </div>

      const onOk = (e, form) => {
        e.preventDefault();

        form.validateFieldsAndScroll( (errors, values) => {
            if (!!errors) {
                return;
            }
            const formData = form.getFieldsValue()

            let keyWords = JSON.parse(formData.keyWordsType);
            formData.keyName = keyWords.keyName;
            formData.keyWordsType = keyWords.keyWordsType;

            if (formData.dateTime !== undefined && formData.dateTime.length !== 0) {
              //   开始时间统一处理为当前日期的0点时间戳
              const _begin = formData.dateTime[0].toDate()
              const _end = formData.dateTime[1].toDate()
              _begin.setHours(0)
              _begin.setMinutes(0)
              _begin.setSeconds(0)
              _begin.setMilliseconds(0)
              // _end.setHours(0)
              // _end.setMinutes(0)
              // _end.setSeconds(0)
              // _end.setMilliseconds(0)

              formData.begin = _begin.getTime()
              formData.end = _end.getTime();

              delete formData.dateTime
            }

            if (formData.lastOccurTime !== undefined && formData.lastOccurTime.length !== 0) {
              //   开始时间统一处理为当前日期的0点时间戳
              const _begin = formData.lastOccurTime[0].toDate()
              const _end = formData.lastOccurTime[1].toDate()
              _begin.setHours(0)
              _begin.setMinutes(0)
              _begin.setSeconds(0)
              _begin.setMilliseconds(0)
              // _end.setHours(0)
              // _end.setMinutes(0)
              // _end.setSeconds(0)
              // _end.setMilliseconds(0)

              formData.lastBegin = _begin.getTime()
              formData.lastEnd = _end.getTime();

              delete formData.lastOccurTime
            }

            // 修复选择时间后删掉时间重新搜索 参数不对bug
            if(formData.dateTime && formData.dateTime.length == 0){
              delete formData.dateTime
            }


            dispatch({
              type: 'alertQuery/queryBefore',
              payload: formData
            })

        })
      }


      return (
          <div>
            <div className={ classnames(styles.searchBar, isShowBar?'':styles.hideBar) }>
              <Form>
                <Row>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['source']} />}
                    >
                      {getFieldDecorator('source', {
                        initialValue: ''
                      })(
                          <Select getPopupContainer={() =>document.getElementById("content")}>
                              <Option value=''><FormattedMessage {...localeMessage['allSource']} /></Option>
                            {
                              sourceOptions.map( (item, index) => {
                                return <Option key={index} value={item.key}>{item.value}</Option>
                              })
                            }
                          </Select>
                      )}
                    </Item>
                  </Col>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['severity']} />}
                    >
                      {getFieldDecorator('severity', {

                      })(
                          <Select getPopupContainer={() =>document.getElementById("content")} placeholder={formatMessage({...localeMessage['severity_placeholder']})}>
                            <Option value="3">{window['_severity']['3']}</Option>
                            <Option value="2">{window['_severity']['2']}</Option>
                            <Option value="1">{window['_severity']['1']}</Option>
                            <Option value="0">{window['_severity']['0']}</Option>
                          </Select>
                      )}
                    </Item>
                  </Col>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['firstOccurTime']} />}
                      wrapperCol={{span: 14}}
                    >
                      {getFieldDecorator('dateTime', {

                      })(
                          <RangePicker />
                      )}
                    </Item>
                  </Col>
                </Row>
                <Row>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['lastOccurTime']} />}
                      wrapperCol={{span: 14}}
                    >
                      {getFieldDecorator('lastOccurTime', {

                      })(
                          <RangePicker />
                      )}
                    </Item>
                  </Col>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['status']} />}
                    >
                      {getFieldDecorator('status', {
                        initialValue: ''
                      })(
                          <Select getPopupContainer={() =>document.getElementById("content")}>
                            <Option value=""><FormattedMessage {...localeMessage['allStatus']} /></Option>
                            <Option value="0">{window['_status']['0']}</Option>
                            <Option value="150">{window['_status']['150']}</Option>
                            <Option value="190">{window['_status']['190']}</Option>
                            <Option value="255">{window['_status']['255']}</Option>
                          </Select>
                      )}
                    </Item>
                  </Col>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['duration']} />}
                    >
                      {getFieldDecorator('duration', {

                      })(
                          <Select getPopupContainer={() =>document.getElementById("content")} placeholder={formatMessage({...localeMessage['duration_placeholder']})}>
                            <Option value="1">{`< 15 min`}</Option>
                            <Option value="2">{`15 ~ 30 min`}</Option>
                            <Option value="3">{`30 ~ 60 min`}</Option>
                            <Option value="4">{`1 ~ 4 h`}</Option>
                            <Option value="5">{`> 4 h`}</Option>
                          </Select>
                      )}
                    </Item>
                  </Col>
                </Row>
                <Row className={styles.rowStyle}>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['count']} />}
                    >
                      {getFieldDecorator('count', {

                      })(
                          <Select getPopupContainer={() =>document.getElementById("content")} placeholder={formatMessage({...localeMessage['count_placeholder']})}>
                            <Option value="1">{`> 5`}</Option>
                            <Option value="2">{`> 10`}</Option>
                            <Option value="3">{`> 20`}</Option>
                            <Option value="4">{`> 30`}</Option>
                          </Select>
                      )}
                    </Item>
                  </Col>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['notifyList']} />}
                    >
                      {getFieldDecorator('isNotify', {

                      })(
                          <Select getPopupContainer={() =>document.getElementById("content")} placeholder={formatMessage({...localeMessage['notifyList_placeholder']})}>
                            <Option value='true'>{formatMessage({...localeMessage['notifyList_yes']})}</Option>
                            <Option value='false'>{formatMessage({...localeMessage['notifyList_no']})}</Option>
                          </Select>
                      )}
                    </Item>
                  </Col>
                  <Col span={8}>
                    <Item
                      {...formItemLayout}
                      label={<FormattedMessage {...localeMessage['owner']} />}
                    >
                      {getFieldDecorator('ownerId', {
                        initialValue: ''
                      })(
                          <Select getPopupContainer={() =>document.getElementById("content")} >
                            <Option value="">{ formatMessage({...localeMessage['allOwners']}) }</Option>
                            {
                              ownerOptions.map((owner, index) => <Option key={ index } value={ owner.userId }>{ owner.realName }</Option>)
                            }
                          </Select>
                      )}
                    </Item>
                  </Col>
                </Row>
                <Row className={styles.rowStyle}>
                  <Col span={8} className={styles.colStyle}>
                    <Item
                      {...formItemLayout}
                      wrapperCol={{span: 10}}
                      label={<FormattedMessage {...localeMessage['keyWords']} />}
                    >
                      {getFieldDecorator('keyWordsType', {
                        initialValue: JSON.stringify({'keyWordsType': '1'})
                      })(
                        <Select getPopupContainer={() =>document.getElementById("content")} size='large'>
                          <Option className={styles.keywordsMenuItem} value={JSON.stringify({'keyWordsType': '1'})}><FormattedMessage {...localeMessage['entityName']} /></Option>
                          <Option className={styles.keywordsMenuItem} value={JSON.stringify({'keyWordsType': '3'})}><FormattedMessage {...localeMessage['tags']} /></Option>
                          <Option className={styles.keywordsMenuItem} value={JSON.stringify({'keyWordsType': '2'})}><FormattedMessage {...localeMessage['description']} /></Option>
                          <Option className={styles.keywordsMenuItem} value={JSON.stringify({'keyWordsType': '4'})}><FormattedMessage {...localeMessage['name']} /></Option>
                          <Option className={styles.keywordsMenuItem} value={JSON.stringify({'keyWordsType': '5'})}><FormattedMessage {...localeMessage['IP_address']} /></Option>
                          <Option className={styles.keywordsMenuItem} value={JSON.stringify({'keyWordsType': '6'})}><FormattedMessage {...localeMessage['orderFlowNum']} /></Option>
                          <Option className={styles.keywordsMenuItem} value={JSON.stringify({'keyWordsType': '7'})}><FormattedMessage {...localeMessage['classCode']} /></Option>
                          {
                            propertyOptions.length > 0 ? propertyOptions.map( (item, index) => {
                              return <Option key={item.code} className={styles.keywordsMenuItem} value={JSON.stringify({'keyWordsType': '100', 'keyName': item.code})}>{item.name}</Option>
                            }) : []
                          }
                        </Select>
                      )}
                    </Item>
                    <Item
                      wrapperCol={{span: 8, offset: 10}}
                      className={ styles.keywordArea }
                    >
                      {getFieldDecorator('keyWords', {

                      })(
                        <Input placeholder={formatMessage({...localeMessage['keyWords_placeholder']})} />
                      )}
                    </Item>
                  </Col>
                  <Button type="primary" size="large" htmlType="submit" onClick={ (e) => {onOk(e, form)} }><FormattedMessage {...localeMessage['search']} /></Button>
                  <Button type="primary" size="large" onClick={ () => {form.resetFields()} }><FormattedMessage {...localeMessage['reset']} /></Button>
                </Row>
              </Form>
            </div>
            <Button className={classnames(styles.toggleBarButton, zhankaiClass)} onClick={toggleBarButtonClick} size="small"><i className={classnames(alertQuery.isShowBar ? shouqiClass : zhankaiClass, styles.toggleBarButtonIcon)} /></Button>
            {!haveQuery ? <div className={styles.alertListInfo}><FormattedMessage {...localeMessage['noQueryData']} /></div> :
            <div>
              <div className={styles.queryOperate}>
                <div className={styles.count}>
                  <FormattedMessage {...localeMessage['result']}
                    values= {{
                      total: queryCount.total !== undefined ?'' + queryCount.total : 0,
                      critical: queryCount.critical !== undefined ?'' +  queryCount.critical : 0,
                      warning: queryCount.warning !== undefined ? '' +  queryCount.warning : 0,
                      informaiton: queryCount.information !== undefined ?'' +  queryCount.information : 0,
                      ok: queryCount.ok !== undefined ?'' +  queryCount.ok : 0
                    }}
                  />

                </div>
                <div className={styles.groupMain}>
                    <Select getPopupContainer={() =>document.getElementById("content")} className={classnames(styles.setGroup, styles.selectSingle)} placeholder={formatMessage({...localeMessage['groupBy']})} value={selectGroup} onChange={ (value) => {
                        dispatch({
                            type: 'alertQueryDetail/groupView',
                            payload: value,
                        })
                    }}>
                        <Option key={'severity'} className={styles.menuItem} value="severity"><FormattedMessage {...localeMessage['groupBySeverity']} /></Option>
                        <Option key={'entityName'} className={styles.menuItem} value="entityName"><FormattedMessage {...localeMessage['groupByEnityName']} /></Option>
                        <Option key={'source'} className={styles.menuItem} value="source"><FormattedMessage {...localeMessage['groupBySource']} /></Option>
                        <Option key={'status'} className={styles.menuItem} value="status"><FormattedMessage {...localeMessage['groupByStatus']} /></Option>
                        {
                          extendColumnList.length !== 0 ? extendColumnList.map( (col, index) => {
                            return <Option key={col.id} className={styles.menuItem} value={col.id}><FormattedMessage {...localeMessage['groupByOther']} values={{other: col.name}}/></Option>
                          }) : []
                        }
                        {
                            extendTagsKey.length > 0 ? extendTagsKey.map( (tag, index) => {
                                return <Option key={tag} className={styles.menuItem} value={tag}><FormattedMessage {...localeMessage['groupByOther']} values={{other: tag}}/></Option>
                            }) : []
                        }
                    </Select>
                    <i className={selectGroup !== window['_groupBy'] && classnames(switchClass, styles.switch)} onClick={() => {
                        dispatch({
                            type: 'alertQueryDetail/noGroupView',
                        })
                    }}></i>
                </div>
                <Popover placement='bottomRight' overlayClassName={styles.popover} trigger="click" content={popoverContent} >
                  <div className={classnames(styles.button, styles.rightBtn)}>
                      <i className={classnames(setClass, styles.setCol)}></i>
                      <p className={styles.col}><FormattedMessage {...localeMessage['columns']} /></p>
                  </div>
                </Popover>
              </div>
              <ListTableWrap />
            </div>}
            {
              Object.keys(alertQueryDetail).length !== 0 && alertQueryDetail.currentAlertDetail !== undefined && Object.keys(alertQueryDetail.currentAlertDetail).length !== 0 ?
              <div className={ alertQueryDetail.isShowDetail ? classnames(styles.alertDetailModal, styles.show) : styles.alertDetailModal }>
                <AlertDetail {...alertDeatilProps}/>
              </div>
              :
              undefined
            }
            <div className={ticketModalProps.isShowTicketModal ?  classnames(styles.ticketModal, styles.show) : styles.ticketModal }>
              <div className={styles.detailHead}>
                  <p><FormattedMessage {...localeMessage['assign_ticket']}/></p>
                  <i className={classnames(styles.shanChu, shanchuClass)} onClick={ticketModalProps.onCloseTicketModal}></i>
              </div>
              <iframe src={ticketModalProps.ticketUrl}>
              </iframe>
            </div>
            <CloseModal {...closeModalProps}/>
            <DispatchModal {...dispatchModalProps}/>
            <ChatOpshModal {...chatOpsModalProps}/>
            <ResolveModal {...resolveModalProps}/>
            <SuppressModal {...suppressModalProps}/>
            <SuppressTimeSlider {...timeSliderProps} />
            <ManualNotifyModal {...notifyModalProps} />
            <AlertOriginSlider { ...alertOriginSliderProps }/>
          </div>
      )
    }
}

export default injectIntl(Form.create()(
  connect((state) => {
    return {
      alertQuery: state.alertQuery,
      alertQueryDetail: state.alertQueryDetail,
      alertOrigin: state.alertOrigin
    }
  })(alertQueryManage)
))
