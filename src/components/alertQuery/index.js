import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Form, Input, Select, DatePicker, Button, Popover, Checkbox } from 'antd'
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
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
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
    const { dispatch } = this.props;
    window.addEventListener('message', (e) => {
      if (e.data.creatTicket !== undefined && e.data.creatTicket === 'success') {
        dispatch({
          type: 'alertDetail/afterDispatch',
        })
      }
    }, false)
  }

  render() {
    const { dispatch, form, alertQuery, alertOperation, intl: { formatMessage } } = this.props;

    const { haveQuery, sourceOptions, propertyOptions, ownerOptions, queryCount, isShowBar, selectGroup, columnList, extendColumnList, extendTagsKey } = alertQuery;

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
      firstOccurTime: {
        id: 'alertQuery.label.firstOccurTime',
        defaultMessage: '首次发生时间',
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
        columnList.map((group, index) => {
          return (
            <div key={index} className={styles.colGroup}>
              <p>{group.type == 0 ? <FormattedMessage {...localeMessage['basic']} /> : <FormattedMessage {...localeMessage['additional']} />}</p>
              {
                group.cols.map((item, index) => {
                  if (item.id === 'entityName' || item.id === 'name') {
                    return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={true} disabled={true} >
                      {item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}
                    </Checkbox></div>
                  } else {
                    return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={item.checked} onChange={(e) => {
                      dispatch({
                        type: 'alertQuery/checkColumn',
                        payload: e.target.value,
                      })
                    }}>{item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}</Checkbox></div>
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

      form.validateFieldsAndScroll((errors, values) => {
        if (!!errors) {
          return;
        }
        const formData = form.getFieldsValue()

        let keyWords = JSON.parse(formData.keyWordsType);
        let owner = JSON.parse(formData.owner);

        formData.ownerId = owner.userId;
        formData.keyName = keyWords.keyName;
        formData.keyWordsType = keyWords.keyWordsType;
        delete formData.owner

        if (formData.dateTime !== undefined && formData.dateTime.length !== 0) {
          //   开始时间统一处理为当前日期的0点时间戳
          const _begin = formData.dateTime[0].toDate()
          const _end = formData.dateTime[1].toDate()
          _begin.setHours(0)
          _begin.setMinutes(0)
          _begin.setSeconds(0)
          _begin.setMilliseconds(0)

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

          formData.lastBegin = _begin.getTime()
          formData.lastEnd = _end.getTime();

          delete formData.lastOccurTime
        }

        // 修复选择时间后删掉时间重新搜索 参数不对bug
        if (formData.dateTime && formData.dateTime.length == 0) {
          delete formData.dateTime
        }


        dispatch({
          type: 'alertQuery/queryBefore',
          payload: formData
        })

      })
    }

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

    const topFixArea = (
      <div className={styles.queryOperate}>
        <div className={styles.count}>
          <FormattedMessage {...localeMessage['result']}
            values={{
              total: queryCount.total !== undefined ? '' + queryCount.total : 0,
              critical: queryCount.critical !== undefined ? '' + queryCount.critical : 0,
              warning: queryCount.warning !== undefined ? '' + queryCount.warning : 0,
              informaiton: queryCount.information !== undefined ? '' + queryCount.information : 0,
              ok: queryCount.ok !== undefined ? '' + queryCount.ok : 0
            }}
          />

        </div>
        <div className={styles.groupMain}>
          <Select getPopupContainer={() => document.getElementById("content")} className={classnames(styles.setGroup, styles.selectSingle)} placeholder={formatMessage({ ...localeMessage['groupBy'] })} value={selectGroup} onChange={(value) => {
            dispatch({
              type: 'alertQuery/groupView',
              payload: value,
            })
          }}>
            <Option key={'severity'} className={styles.menuItem} value="severity"><FormattedMessage {...localeMessage['groupBySeverity']} /></Option>
            <Option key={'entityName'} className={styles.menuItem} value="entityName"><FormattedMessage {...localeMessage['groupByEnityName']} /></Option>
            <Option key={'source'} className={styles.menuItem} value="source"><FormattedMessage {...localeMessage['groupBySource']} /></Option>
            <Option key={'status'} className={styles.menuItem} value="status"><FormattedMessage {...localeMessage['groupByStatus']} /></Option>
            {
              extendColumnList.length !== 0 ? extendColumnList.map((col, index) => {
                return <Option key={col.id} className={styles.menuItem} value={col.id}><FormattedMessage {...localeMessage['groupByOther']} values={{ other: col.name }} /></Option>
              }) : []
            }
            {
              extendTagsKey.length > 0 ? extendTagsKey.map((tag, index) => {
                return <Option key={tag} className={styles.menuItem} value={tag}><FormattedMessage {...localeMessage['groupByOther']} values={{ other: tag }} /></Option>
              }) : []
            }
          </Select>
          <i className={selectGroup !== window['_groupBy'] && classnames(switchClass, styles.switch)} onClick={() => {
            dispatch({
              type: 'alertQuery/noGroupView',
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
    )

    return (
      <div>
        <div className={classnames(styles.searchBar, isShowBar ? '' : styles.hideBar)}>
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
                    <Select getPopupContainer={() => document.getElementById("content")}>
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
                    <RangePicker showTime style={{ width: '100%' }} />
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
                    <RangePicker showTime style={{ width: '100%' }} />
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
                    <Select getPopupContainer={() => document.getElementById("content")} placeholder={formatMessage({ ...localeMessage['severity_placeholder'] })}>
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
                    initialValue: ''
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
                    initialValue: JSON.stringify({ userId: '', realName: '' })
                  })(
                    <Select getPopupContainer={() => document.getElementById("content")} showSearch filterOption={false} onSearch={
                      _.debounce((value) => {
                        dispatch({
                          type: 'alertQuery/ownerQuery',
                          payload: {
                            realName: value
                          }
                        })
                      }, 500)
                    }>
                      <Option value={JSON.stringify({ userId: '', realName: '' })}>{formatMessage({ ...localeMessage['allOwners'] })}</Option>
                      {
                        ownerOptions.map((owner, index) => <Option key={index} value={JSON.stringify(owner)}>{owner.realName}</Option>)
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
                      <Option className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '1' })}><FormattedMessage {...localeMessage['entityName']} /></Option>
                      <Option className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '3' })}><FormattedMessage {...localeMessage['tags']} /></Option>
                      <Option className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '2' })}><FormattedMessage {...localeMessage['description']} /></Option>
                      <Option className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '4' })}><FormattedMessage {...localeMessage['name']} /></Option>
                      <Option className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '5' })}><FormattedMessage {...localeMessage['IP_address']} /></Option>
                      <Option className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '6' })}><FormattedMessage {...localeMessage['orderFlowNum']} /></Option>
                      <Option className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '7' })}><FormattedMessage {...localeMessage['classCode']} /></Option>
                      {
                        propertyOptions.length > 0 ? propertyOptions.map((item, index) => {
                          return <Option key={item.code} className={styles.keywordsMenuItem} value={JSON.stringify({ 'keyWordsType': '100', 'keyName': item.code })}>{item.name}</Option>
                        }) : []
                      }
                    </Select>
                    )}
                </Item>
                <Item
                  wrapperCol={{ span: 15, offset: 9 }}
                  className={styles.keywordArea}
                >
                  {getFieldDecorator('keyWords', {

                  })(
                    <Input autoComplete={false} placeholder={formatMessage({ ...localeMessage['keyWords_placeholder'] })} />
                    )}
                </Item>
              </Col>
              <Col span={5} className={classnames(styles.colStyle, styles.operateCol)}>
                <div>
                  <Button type="primary" size="large" htmlType="submit" onClick={(e) => { onOk(e, form) }}><FormattedMessage {...localeMessage['search']} /></Button>
                  <Button type="primary" size="large" onClick={() => { form.resetFields() }}><FormattedMessage {...localeMessage['reset']} /></Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>
        <Button className={classnames(styles.toggleBarButton, zhankaiClass)} onClick={toggleBarButtonClick} size="small"><i className={classnames(alertQuery.isShowBar ? shouqiClass : zhankaiClass, styles.toggleBarButtonIcon)} /></Button>
        {!haveQuery ? <div className={styles.alertListInfo}><FormattedMessage {...localeMessage['noQueryData']} /></div> :
          <div>
            {topFixArea}
            <ListTableWrap topFixArea={topFixArea} topHeight={alertQuery.isShowBar ? 407 : 200} />
          </div>}
        <ScrollTopButton />
        <AlertOriginSliderWrap />
        <AlertDetaiWrap { ...alertDetailWrapProps } />
      </div>
    )
  }
}

export default injectIntl(Form.create()(
  connect((state) => {
    return {
      alertQuery: state.alertQuery,
    }
  })(alertQueryManage)
))
