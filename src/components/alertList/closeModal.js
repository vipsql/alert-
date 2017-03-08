import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col, Input } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'

const Item = Form.Item;
const Option = Select.Option;
const closeModal = ({alertOperation, alertDetailOperation, alertList, dispatch, form}) => {
    const currentData = alertList.alertOperateModalOrigin === 'detail' ? alertDetailOperation : alertOperation
    
    const { isShowCloseModal, isDropdownSpread, closeMessage } = currentData;
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const closeCloseModal = () => {
        dispatch({
            type: alertList.alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleCloseModal' : 'alertOperation/toggleCloseModal',
            payload: false
        })
    }

    const clickDropdown = (e) => {
        const message = e.target.getAttribute('data-message')
        
        dispatch({
            type: alertList.alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/setCloseMessge' : 'alertOperation/setCloseMessge',
            payload: message
        })
    }

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        form.validateFieldsAndScroll( (errors, values) => {
            if (!!errors) {
                return;
            }
            const value = form.getFieldValue('closeOption')
            dispatch({
                type: alertList.alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/closeAlert' : 'alertOperation/closeAlert',
                payload: value
            })

            form.resetFields();
        })
      }} >关闭</Button>
      <Button type="ghost" onClick={ () => {
        dispatch({
            type: alertList.alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleCloseModal' : 'alertOperation/toggleCloseModal',
            payload: false
        })
        form.resetFields();
      }}>取消</Button>
      </div>
    )

    return (
        <Modal
            title="关闭告警"
            maskClosable="true"
            onCancel={ closeCloseModal }
            visible={ isShowCloseModal }
            footer={ modalFooter }
        >
            <div className={styles.closeMain}>
                <Form>
                    <Item
                        label="关闭理由"
                        hasFeedback
                        help={isFieldValidating('closeOption') ? '校验中...' : (getFieldError('closeOption') || []).join(', ')}
                    >
                        {getFieldDecorator('closeOption', {
                            rules: [
                                { required: true, message: '请选择关闭理由' }
                            ],
                            initialValue: closeMessage,
                        })(
                            <Input style={{width: '100%'}} placeholder="请选择关闭理由" onFocus={ (e) => {
                                dispatch({
                                    type: alertList.alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleDropdown' : 'alertOperation/toggleDropdown',
                                    payload: true
                                })
                            }}/>
                        )}
                    </Item>

                </Form>
                <ul onMouseLeave={ () => {
                    dispatch({
                        type: alertList.alertOperateModalOrigin === 'detail' ? 'alertDetailOperation/toggleDropdown' : 'alertOperation/toggleDropdown',
                        payload: false
                    })
                }} className={isDropdownSpread ? styles.selectDropdown : classnames(styles.selectDropdown, styles['selectDropdown-hidden'])}>
                    <li data-message={`关闭理由1：故障已解决`} onClick={clickDropdown}>关闭理由1：故障已解决</li>
                    <li data-message={`关闭理由2：计划停机`} onClick={clickDropdown}>关闭理由2：计划停机</li>
                    <li data-message={`关闭理由3：监控系统误报`} onClick={clickDropdown}>关闭理由3：监控系统误报</li>
                </ul>
            </div>
        </Modal>
    )
}

closeModal.defaultProps = {

}

closeModal.propTypes = {

}

export default Form.create()(
    connect( state => {
        return {
            alertOperation: state.alertOperation,
            alertDetailOperation: state.alertDetailOperation,
            alertList: state.alertList
        }
    })(closeModal)
)