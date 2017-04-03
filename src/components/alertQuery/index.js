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
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;
const Option = Select.Option;
const alertQueryManage = ({dispatch, form, alertQuery, alertQueryDetail, intl: {formatMessage}}) => {

    const { haveQuery, sourceOptions, queryCount } = alertQuery;
    
    const { selectGroup, columnList, extendColumnList } = alertQueryDetail

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
      showChatOpsFunc: (position) => {
        dispatch({
          type: 'alertQueryDetail/openChatOps',
        })
      }
    }

    const alertDeatilProps = {
      extraProps: {
        currentAlertDetail: alertQueryDetail.currentAlertDetail, 
        isSowOperateForm: alertQueryDetail.isSowOperateForm, 
        operateForm: alertQueryDetail.operateForm, 
        isShowRemark: alertQueryDetail.isShowRemark, 
        operateRemark: alertQueryDetail.operateRemark,
        ciUrl: alertQueryDetail.ciUrl
      },
      operateProps: {
          ...operateProps,
        dispatchDisabled: !(alertQueryDetail['currentAlertDetail']['status'] == 0 && !alertQueryDetail['currentAlertDetail']['parentId']),
        closeDisabled: alertQueryDetail['currentAlertDetail']['status'] == 255 || alertQueryDetail['currentAlertDetail']['status'] == 40,
      },

      closeDeatilModal: () => {
        dispatch({
            type: 'alertQueryDetail/closeDetailModal',
            payload: false
        })
      },
      openForm: () => {
        dispatch({
            type: 'alertQueryDetail/toggleFormModal',
            payload: true
        })
      },
      editForm: (formData) => {
        dispatch({
            type: 'alertQueryDetail/setFormData',
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

      closeCloseModal: () => {
        dispatch({
            type: 'alertQueryDetail/toggleCloseModal',
            payload: false
        })
      },
      clickDropdown: (e) => {
        const message = e.target.getAttribute('data-message') ||  e.target.parentNode.getAttribute('data-message')
        
        dispatch({
            type: 'alertQueryDetail/setCloseMessge',
            payload: message
        })
      },
      onOk: (closeMessage) => {
        dispatch({
            type: 'alertQueryDetail/closeAlert',
            payload: closeMessage
        })
      },
      onCancal: () => {
        dispatch({
            type: 'alertQueryDetail/toggleCloseModal',
            payload: false
        })
      },
      okCloseMessage: (isDropdownSpread) => {
        dispatch({
            type: 'alertQueryDetail/toggleDropdown',
            payload: !isDropdownSpread
        })
      },
      editCloseMessage: (e) => {
        dispatch({
            type: 'alertQueryDetail/setCloseMessge',
            payload: e.target.value
        })
      },
      mouseLeaveDropdown: () => {
        dispatch({
            type: 'alertQueryDetail/toggleDropdown',
            payload: false
        })
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

    const ticketModalProps = {
      isShowTicketModal: alertQueryDetail.isShowTicketModal,
      ticketUrl: alertQueryDetail.ticketUrl,
      onCloseTicketModal(){
        dispatch({
          type: 'alertQueryDetail/closeTicketModal'
        })
      }
    }

    const localeMessage = defineMessages({
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
        lastTime:{
            id: 'alertList.title.lastTime',
            defaultMessage: '持续时间',
        },
        lastOccurTime:{
            id: 'alertList.title.lastOccurTime',
            defaultMessage: '最后发送时间',
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
        tags: {
            id: 'alertQuery.label.tags',
            defaultMessage: '标签',
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
        duration: {
            id: 'alertQuery.label.duration',
            defaultMessage: '持续时间',
        },
        duration_placeholder: {
            id: 'alertQuery.label.duration.placeholder',
            defaultMessage: '请选择持续时间',
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
          
          if (formData.dateTime !== undefined && formData.dateTime.length !== 0) {
            //   开始时间统一处理为当前日期的0点时间戳
            const _begin = formData.dateTime[0].toDate()
            const _end = formData.dateTime[1].toDate()
            _begin.setHours(0)
            _begin.setMinutes(0)
            _begin.setSeconds(0)
            _begin.setMilliseconds(0)
            _end.setHours(0)
            _end.setMinutes(0)
            _end.setSeconds(0)
            _end.setMilliseconds(0)

            formData.begin = _begin.getTime()
            formData.end = _end.getTime();
            
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
          <Form>
            <Row>
              <Col span={8} className={styles.colStyle}>
                <Item
                  {...formItemLayout}
                  wrapperCol={{span: 5}}
                  label={<FormattedMessage {...localeMessage['keyWords']} />}
                > 
                  {getFieldDecorator('keyWordsType', {
                    initialValue: '1'
                  })(
                    <Select size='large'>
                      <Option className={styles.keywordsMenuItem} value="1"><FormattedMessage {...localeMessage['entityName']} /></Option>
                      <Option className={styles.keywordsMenuItem} value="3"><FormattedMessage {...localeMessage['tags']} /></Option>
                      <Option className={styles.keywordsMenuItem} value="2"><FormattedMessage {...localeMessage['description']} /></Option>
                    </Select>
                  )}    
                </Item>
                <Item
                  wrapperCol={{span: 8, offset: 10}}
                >
                  {getFieldDecorator('keyWords', {
                    
                  })(
                    <Input placeholder={formatMessage({...localeMessage['keyWords_placeholder']})} />
                  )}
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...formItemLayout}
                  label={<FormattedMessage {...localeMessage['source']} />}
                >
                  {getFieldDecorator('source', {
                     initialValue: ''
                  })(
                      <Select>
                          <Option value=''><FormattedMessage {...localeMessage['allSource']} /></Option>
                        {
                          sourceOptions.map( (item, index) => {
                            return <Option key={index} value={item.value}>{item.value}</Option>
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
                      <Select placeholder={formatMessage({...localeMessage['severity_placeholder']})}>
                        <Option value="0">{window['_severity']['0']}</Option>
                        <Option value="1">{window['_severity']['1']}</Option>
                        <Option value="2">{window['_severity']['2']}</Option>
                        <Option value="3">{window['_severity']['3']}</Option>
                      </Select>
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Item
                  {...formItemLayout}
                  label={<FormattedMessage {...localeMessage['occurTime']} />}
                  wrapperCol={{span: 14}}
                >
                  {getFieldDecorator('dateTime', {
                     
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
                      <Select>
                        <Option value=""><FormattedMessage {...localeMessage['allStatus']} /></Option>
                        <Option value="0">{window['_status']['0']}</Option>
                        <Option value="150">{window['_status']['150']}</Option>
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
                      <Select placeholder={formatMessage({...localeMessage['duration_placeholder']})}>
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
            <Item wrapperCol={{ span: 10, offset: 2 }}>
              <Button type="primary" size="default" htmlType="submit" onClick={ (e) => {onOk(e, form)} }><FormattedMessage {...localeMessage['search']} /></Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" size="default" onClick={ () => {form.resetFields()} }><FormattedMessage {...localeMessage['reset']} /></Button>
            </Item>
          </Form>
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
                  <Select className={classnames(styles.setGroup, styles.selectSingle)} placeholder={formatMessage({...localeMessage['groupBy']})} value={selectGroup} onChange={ (value) => {
                      dispatch({
                          type: 'alertQueryDetail/groupView',
                          payload: value,
                      })
                  }}>
                      <Option key={0} className={styles.menuItem} value="entityName"><FormattedMessage {...localeMessage['groupByEnityName']} /></Option>
                      <Option key={1} className={styles.menuItem} value="source"><FormattedMessage {...localeMessage['groupBySource']} /></Option>
                      <Option key={2} className={styles.menuItem} value="status"><FormattedMessage {...localeMessage['groupByStatus']} /></Option>
                      {
                        extendColumnList.length !== 0 ? extendColumnList.map( (col, index) => {
                          return <Option key={index + 3} className={styles.menuItem} value={col.id}><FormattedMessage {...localeMessage['groupByOther']} values={{other: col.name}}/></Option>
                        }) : []
                      }
                  </Select>
                  <i className={selectGroup !== window['_groupBy'] && classnames(switchClass, styles.switch)} onClick={() => {
                      dispatch({
                          type: 'alertQueryDetail/noGroupView',
                      })
                  }}></i>
              </div>
              <Popover placement='bottomRight' trigger="click" content={popoverContent} >
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
        </div>
    )
}

export default injectIntl(Form.create()(
  connect((state) => {
    return {
      alertQuery: state.alertQuery,
      alertQueryDetail: state.alertQueryDetail
    }
  })(alertQueryManage)
))