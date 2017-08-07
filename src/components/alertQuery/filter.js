import React, { Component, PropTypes } from 'react'
import { connect } from 'dva'
import { Row, Col, Form, Input, Select, DatePicker, Button, Popover, Checkbox, message } from 'antd'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import styles from './index.less'
import { classnames } from '../../utils'
import TimeSlider from '../ruleEditor/timeSlider'
import DatePeriodPicker from '../common/datePeriodPicker/index'

const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;
const Option = Select.Option;
const OptGroup = Select.OptGroup;

class Filter extends Component {
  constructor(props) {
    super(props);
    this.queryBefore = this.queryBefore.bind(this);
  }
  queryBefore(form) {

    let query = null // 查询条件
      , rawData = null // 用来回显的

    const formData = form.getFieldsValue();
    rawData = { ...formData };
    // ----------------------------------------------------

    let keyWords = JSON.parse(formData.keyWordsType);
    let owner = formData.owner;

    formData.ownerId = owner.key;
    formData.keyName = keyWords.keyName;
    formData.keyWordsType = keyWords.keyWordsType;
    delete formData.owner

    formData.begin = formData.dateTime[0];
    formData.end = formData.dateTime[1];
    delete formData.dateTime

    formData.lastBegin = formData.lastOccurTime[0];
    formData.lastEnd = formData.lastOccurTime[1];
    delete formData.lastOccurTime

    // -----------------------------------------------------

    return {
      currentQuery: formData,
      currentQueryRawData: rawData
    }
  }

  onOk(e, form) {
    e.preventDefault();

    form.validateFieldsAndScroll((errors, values) => {
      if (!!errors) {
        return;
      }

      const { dispatch } = this.props;

      dispatch({
        type: 'alertQuery/queryBefore',
        payload: this.queryBefore(form) ///需要对传过去的参数和保存回显的参数做针对性处理
      })
    })
  }
  render() {
    const { form, dispatch, alertQuery, alertOperation, intl: { formatMessage } } = this.props;
    const { getFieldDecorator, getFieldsValue } = form;
    const { haveQuery, sourceOptions, propertyOptions, ownerOptions, queryCount, isShowBar, selectGroup, columnList, extendColumnList, extendTagsKey } = alertQuery;


    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };
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
      entityName: {
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
      status: {
        id: 'alertList.title.status',
        defaultMessage: '告警状态',
      },
      description: {
        id: 'alertList.title.description',
        defaultMessage: '告警描述',
      },
      count: {
        id: 'alertList.title.count',
        defaultMessage: '次数',
      },
      classCode: {
        id: 'alertList.title.classCode',
        defaultMessage: '资源类型',
      },
      tags: {
        id: 'alertList.title.tags',
        defaultMessage: '标签',
      },
      lastTime: {
        id: 'alertList.title.lastTime',
        defaultMessage: '持续时间',
      },
      lastOccurTime: {
        id: 'alertQuery.label.lastOccurTime',
        defaultMessage: '最后发生时间',
      },
      lastOccurTime_placeholder: {
        id: 'alertQuery.label.lastOccurTime.placeholder',
        defaultMessage: '请点击选择最后发生时间段'
      },
      firstOccurTime: {
        id: 'alertQuery.label.firstOccurTime',
        defaultMessage: '首次发生时间',
      },
      firstOccurTime_placeholder: {
        id: 'alertQuery.label.firstOccurTime.placeholder',
        defaultMessage: '请点击选择首次发生时间段'
      },
      entityAddr: {
        id: 'alertList.title.entityAddr',
        defaultMessage: 'IP地址',
      },
      orderFlowNum: {
        id: 'alertList.title.orderFlowNum',
        defaultMessage: '关联工单',
      },
      notifyList: {
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
      suppressionFlag: {
        id: 'alertList.title.suppressionFlag',
        defaultMessage: '是否被抑制'
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
      allSeverity: {
        id: 'alertQuery.label.allSeverity',
        defaultMessage: '所有级别',
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
      search: {
        id: 'alertQuery.search',
        defaultMessage: '搜索',
      },
      reset: {
        id: 'alertQuery.reset',
        defaultMessage: '重置',
      },
      assign_ticket: {
        id: 'alertDetail.ticket.assgin',
        defaultMessage: '派发工单'
      },
      IP_address: {
        id: 'alertList.title.entityAddr',
        defaultMessage: 'IP地址'
      },
      baseKeyWords: {
        id: 'ruleEditor.label1',
        defaultMessage: '基本字段'
      },
      ciKeyWords: {
        id: 'ruleEditor.label2',
        defaultMessage: 'ci字段'
      },
      extraKeyWords: {
        id: 'ruleEditor.label3',
        defaultMessage: '扩展字段'
      }
    })

    return (
      <div className={classnames(styles.searchBar, isShowBar ? '' : styles.hideBar)}>
        <Form>
          <Row>
            <Col span={8}>
              <Item
                {...formItemLayout}
                label={<FormattedMessage {...localeMessage['source']} />}
              >
                {getFieldDecorator('source', {

                })(
                  <Select getPopupContainer={() => document.getElementById("content")} >
                    <Option value=''><FormattedMessage {...localeMessage['allSource']} /></Option>
                    {
                      sourceOptions.map((item, index) => {
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
                label={<FormattedMessage {...localeMessage['firstOccurTime']} />}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('dateTime', {

                })(
                  <DatePeriodPicker placeholder={formatMessage({ ...localeMessage['firstOccurTime_placeholder'] })} onChange={([startDate, endDate]) => {
                    form.setFieldsValue({
                      dateTime: [startDate, endDate]
                    })
                  }} />
                  )}

              </Item>
            </Col>
            <Col span={8}>
              <Item
                {...formItemLayout}
                label={<FormattedMessage {...localeMessage['lastOccurTime']} />}
                wrapperCol={{ span: 12 }}
              >
                {getFieldDecorator('lastOccurTime', {

                })(
                  <DatePeriodPicker placeholder={formatMessage({ ...localeMessage['lastOccurTime_placeholder'] })} onChange={([startDate, endDate]) => {
                    form.setFieldsValue({
                      lastOccurTime: [startDate, endDate]
                    })
                  }} />
                  )}
              </Item>
            </Col>
          </Row>
          <Row>
            <Col span={8}>
              <Item
                {...formItemLayout}
                label={<FormattedMessage {...localeMessage['severity']} />}
              >
                {getFieldDecorator('severity', {

                })(
                  <Select getPopupContainer={() => document.getElementById("content")}>
                    <Option value=""><FormattedMessage {...localeMessage['allSeverity']} /></Option>
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
                label={<FormattedMessage {...localeMessage['status']} />}
              >
                {getFieldDecorator('status', {

                })(
                  <Select getPopupContainer={() => document.getElementById("content")}>
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
                  <Select getPopupContainer={() => document.getElementById("content")} placeholder={formatMessage({ ...localeMessage['duration_placeholder'] })}>
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
                  <Select getPopupContainer={() => document.getElementById("content")} placeholder={formatMessage({ ...localeMessage['count_placeholder'] })}>
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
                  <Select getPopupContainer={() => document.getElementById("content")} placeholder={formatMessage({ ...localeMessage['notifyList_placeholder'] })}>
                    <Option value='true'>{formatMessage({ ...localeMessage['notifyList_yes'] })}</Option>
                    <Option value='false'>{formatMessage({ ...localeMessage['notifyList_no'] })}</Option>
                  </Select>
                  )}
              </Item>
            </Col>
            <Col span={8}>
              <Item
                {...formItemLayout}
                label={<FormattedMessage {...localeMessage['owner']} />}
              >
                {getFieldDecorator('owner', {

                })(
                  <Select getPopupContainer={() => document.getElementById("content")} labelInValue showSearch filterOption={false}
                    onSearch={
                      _.debounce((value) => {
                        // 保存之前的过滤条件，防止在重新渲染的时候丢失
                        dispatch({
                          type: 'alertQuery/setCurrentQuery',
                          payload: this.queryBefore(form)
                        })
                        dispatch({
                          type: 'alertQuery/ownerQuery',
                          payload: {
                            realName: value
                          }
                        })
                      }, 500)
                    }>
                    <Option value=''>{formatMessage({ ...localeMessage['allOwners'] })}</Option>
                    {
                      ownerOptions.map((owner, index) => <Option key={index} value={owner.userId}>{owner.realName}</Option>)
                    }
                  </Select>
                  )}
              </Item>
            </Col>
          </Row>
          <Row className={styles.rowStyle}>
            <Col span={16} className={styles.colStyle}>
              <Item
                {...formItemLayout}
                wrapperCol={{ span: 6 }}
                labelCol={{ span: 3 }}
                label={<FormattedMessage {...localeMessage['keyWords']} />}
              >
                {getFieldDecorator('keyWordsType', {
                  initialValue: JSON.stringify({ 'keyWordsType': '1' })
                })(
                  <Select getPopupContainer={() => document.getElementById("content")} size='large'>
                    <OptGroup label={formatMessage({ ...localeMessage['baseKeyWords'] })}>
                      <Option key={1} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '1' })}><FormattedMessage {...localeMessage['entityName']} /></Option>
                      <Option key={2} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '3' })}><FormattedMessage {...localeMessage['tags']} /></Option>
                      <Option key={3} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '2' })}><FormattedMessage {...localeMessage['description']} /></Option>
                      <Option key={4} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '4' })}><FormattedMessage {...localeMessage['name']} /></Option>
                      <Option key={5} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '5' })}><FormattedMessage {...localeMessage['IP_address']} /></Option>
                      <Option key={6} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '6' })}><FormattedMessage {...localeMessage['orderFlowNum']} /></Option>
                    </OptGroup>
                    <OptGroup label={formatMessage({ ...localeMessage['ciKeyWords'] })}>
                      <Option key={7} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '7' })}><FormattedMessage {...localeMessage['classCode']} /></Option>
                    </OptGroup>
                    <OptGroup label={formatMessage({ ...localeMessage['extraKeyWords'] })}>
                    {
                      propertyOptions.length > 0 ? propertyOptions.map((item, index) => {
                        return <Option key={item.code + "_" + index} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '100', 'keyName': item.code })}>{item.name}</Option>
                      }) : []
                    }
                    </OptGroup>
                  </Select>
                  )}
              </Item>
              <Item
                wrapperCol={{ span: 15, offset: 9 }}
                className={styles.keywordArea}
              >
                {getFieldDecorator('keyWords', {

                })(
                  <Input autoComplete="off" placeholder={formatMessage({ ...localeMessage['keyWords_placeholder'] })} />
                  )}
              </Item>
            </Col>
            <Col span={8} className={classnames(styles.colStyle, styles.operateCol)}>
              <div>
                <Button type="primary" size="large" htmlType="submit" onClick={(e) => { this.onOk(e, form) }}><FormattedMessage {...localeMessage['search']} /></Button>
                <Button type="primary" size="large" onClick={() => {
                  dispatch({
                    type: 'alertQuery/setCurrentQuery',
                    payload: {
                      currentQueryRawData: {}
                    }
                  })
                }}><FormattedMessage {...localeMessage['reset']} /></Button>
              </div>
            </Col>
          </Row>
        </Form>
      </div>
    )
  }
}

export default injectIntl(
  connect((state) => {
    return {
      alertQuery: state.alertQuery
    }
  })
    (Form.create({
      mapPropsToFields: (props) => {
        const params = props.alertQuery.currentQueryRawData || {};

        return {
          source: {
            value: typeof params.source !== 'undefined' ? params.source : ''
          },
          dateTime: {
            value: typeof params.dateTime !== 'undefined' ? params.dateTime : []
          },
          lastOccurTime: {
            value: typeof params.lastOccurTime !== 'undefined' ? params.lastOccurTime : []
          },
          severity: {
            value: typeof params.severity !== 'undefined' ? params.severity : ''
          },
          status: {
            value: typeof params.status !== 'undefined' ? params.status : ''
          },
          duration: {
            value: typeof params.duration !== 'undefined' ? params.duration : undefined
          },
          count: {
            value: typeof params.count !== 'undefined' ? params.count : undefined
          },
          isNotify: {
            value: typeof params.isNotify !== 'undefined' ? params.isNotify : undefined
          },
          owner: {
            value: typeof params.owner !== 'undefined' ? params.owner : { key: '', label: '' }
          },
          keyWordsType: {
            value: typeof params.keyWordsType !== 'undefined' ? params.keyWordsType : JSON.stringify({ 'keyWordsType': '1' })
          },
          keyWords: {
            value: typeof params.keyWords !== 'undefined' ? params.keyWords : undefined
          }
        }
      }
    })(Filter))
)