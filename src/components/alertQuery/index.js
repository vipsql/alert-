import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Form, Input, Select, DatePicker, Button, Popover, Checkbox} from 'antd'
import ListTableWrap from './queryList.js'
import { classnames } from '../../utils'
import AlertDetail from '../common/alertDetail/index.js'
import CloseModal from '../common/closeModal/index.js'
import DispatchModal from '../common/dispatchModal/index.js'

const Item = Form.Item;
const RangePicker = DatePicker.RangePicker;
const InputGroup = Input.Group;
const Option = Select.Option;
const alertQueryManage = ({dispatch, form, alertQuery, alertQueryDetail}) => {

    const { haveQuery, sourceOptions, queryCount } = alertQuery;
    const { selectGroup, columnList } = alertQueryDetail

    const { getFieldDecorator, getFieldsValue } = form;

    const formItemLayout = {
      labelCol: { span: 6 },
      wrapperCol: { span: 12 },
    };

    const switchClass = classnames(
        styles['icon'],
        styles.iconfont,
        styles['icon-anonymous-iconfont']
    )

    const setClass = classnames(
        styles['icon'],
        styles.iconfont,
        styles['icon-bushu']
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
      }
    }

    const alertDeatilProps = {
      extraProps: {
        currentAlertDetail: alertQueryDetail.currentAlertDetail, 
        isSowOperateForm: alertQueryDetail.isSowOperateForm, 
        operateForm: alertQueryDetail.operateForm, 
        isShowRemark: alertQueryDetail.isShowRemark, 
        operateRemark: alertQueryDetail.operateRemark
      },
      operateProps: {...operateProps},

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
        const message = e.target.getAttribute('data-message')
        
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
            type: 'alertQueryDetail/toggleFormModal',
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
            type: 'alertQueryDetail/toggleFormModal',
            payload: false
        })
      }
    }

    const popoverContent = <div className={styles.popoverMain}>
        {
            columnList.map( (group, index) => {
                return (
                    <div key={index} className={styles.colGroup}>
                        <p>{group.name}</p>
                        {
                            group.cols.map( (item, index) => {
                                if (item.id === 'entity' || item.id === 'alertName') {
                                    return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={true} disabled={true} >{item.name}</Checkbox></div>
                                } else {
                                    return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={item.checked} onChange={ (e) => {
                                        dispatch({
                                            type: 'alertQueryDetail/checkColumn',
                                            payload: e.target.value,
                                        })
                                    }}>{item.name}</Checkbox></div>
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
            formData.begin = formData.dateTime[0].toDate().getTime();
            formData.end = formData.dateTime[1].toDate().getTime();
          }
          
          dispatch({
            type: 'alertQuery/queryAlertList',
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
                  label='关键字'
                > 
                  {getFieldDecorator('keyWordsType', {
                    initialValue: '1'
                  })(
                    <Select size='large'>
                      <Option className={styles.keywordsMenuItem} value="1">节点名称</Option>
                      <Option className={styles.keywordsMenuItem} value="3">标签</Option>
                      <Option className={styles.keywordsMenuItem} value="2">描述</Option>
                    </Select>
                  )}    
                </Item>
                <Item
                  wrapperCol={{span: 8, offset: 10}}
                >
                  {getFieldDecorator('keyWords', {
                    
                  })(
                    <Input placeholder='请输入关键字' />
                  )}
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...formItemLayout}
                  label='告警来源'
                >
                  {getFieldDecorator('source', {
                     initialValue: '-1'
                  })(
                      <Select>
                          <Option value='-1'>所有来源</Option>
                        {
                          sourceOptions.map( (item) => {
                            return <Option value={item.value}>{item.name}</Option>
                          })
                        }
                      </Select>
                  )}
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...formItemLayout}
                  label='所属级别'
                >
                  {getFieldDecorator('severity', {
                     
                  })(
                      <Select placeholder='请选择级别'>
                        <Option value="50">紧急</Option>
                        <Option value="40">主要</Option>
                        <Option value="30">次要</Option>
                        <Option value="20">警告</Option>
                        <Option value="10">提醒</Option>
                      </Select>
                  )}
                </Item>
              </Col>
            </Row>
            <Row>
              <Col span={8}>
                <Item
                  {...formItemLayout}
                  label='发生时间'
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
                  label='对应状态'
                >
                  {getFieldDecorator('status', {
                     initialValue: '-1'
                  })(
                      <Select>
                        <Option value="-1">所有状态</Option>
                        <Option value="0">新告警</Option>
                        <Option value="40">已确认</Option>
                        <Option value="150">处理中</Option>
                        <Option value="255">已解决</Option>
                      </Select>
                  )}
                </Item>
              </Col>
              <Col span={8}>
                <Item
                  {...formItemLayout}
                  label='持续时间'
                >
                  {getFieldDecorator('duration', {
                     
                  })(
                      <Select placeholder='请选择级别'>
                        <Option value="entityName">0-1h</Option>
                        <Option value="tag">2-3h</Option>
                        <Option value="description">4-5h</Option>
                      </Select>
                  )}
                </Item>
              </Col>
            </Row>
            <Item wrapperCol={{ span: 10, offset: 2 }}>
              <Button type="primary" size="default" htmlType="submit" onClick={ (e) => {onOk(e, form)} }>搜索</Button>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <Button type="primary" size="default" onClick={ () => {form.resetFields()} }>重置</Button>
            </Item>
          </Form>
          {!haveQuery ? <div className={styles.alertListInfo}>暂无数据，请先选择查询条件</div> :
          <div>
            <div className={styles.queryOperate}>
              <div className={styles.count}>
                {`共${queryCount.total !== undefined ? queryCount.total : 0}个结果（紧急${queryCount.critical !== undefined ? queryCount.critical : 0}个、主要${queryCount.major !== undefined ? queryCount.major : 0}个、次要${queryCount.minor !== undefined ? queryCount.minor : 0}个、警告${queryCount.warning !== undefined ? queryCount.warning : 0}个、提醒${queryCount.information !== undefined ? queryCount.information : 0}个）`}
              </div>
              <div className={styles.groupMain}>
                  <Select className={classnames(styles.setGroup, styles.selectSingle)} placeholder="分组显示" value={selectGroup} onChange={ (value) => {
                      dispatch({
                          type: 'alertQueryDetail/groupView',
                          payload: value,
                      })
                  }}>
                      <Option className={styles.menuItem} value="ENTITY_NAME">按来源分组</Option>
                      <Option className={styles.menuItem} value="status">按状态分组</Option>
                      <Option className={styles.menuItem} value="severity">按级别分组</Option>
                  </Select>
                  <i className={selectGroup !== '分组显示' && classnames(switchClass, styles.switch)} onClick={() => {
                      dispatch({
                          type: 'alertQueryDetail/noGroupView',
                      })
                  }}></i>
              </div>
              <Popover placement='bottomRight' trigger="click" content={popoverContent} onClick={ () => {
                dispatch({
                    type: 'alertQueryDetail/initalColumn'
                })
              }}>
                <div className={classnames(styles.button, styles.rightBtn)}>
                    <i className={classnames(setClass, styles.setCol)}></i>
                    <p className={styles.col}>列定制</p>
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
          <CloseModal {...closeModalProps}/>
          <DispatchModal {...dispatchModalProps}/>
        </div>
    )
}

export default Form.create()(
  connect((state) => {
    return {
      alertQuery: state.alertQuery,
      alertQueryDetail: state.alertQueryDetail
    }
  })(alertQueryManage)
)