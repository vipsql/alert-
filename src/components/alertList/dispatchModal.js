import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'

const Item = Form.Item;
const Option = Select.Option;
const dispatchModal = ({alertOperation, dispatch, form}) => {

    const { isShowFormModal, formOptions } = alertOperation;
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const closeDispatchModal = () => {
        dispatch({
            type: 'alertOperation/toggleFormModal',
            payload: false
        })
    }

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        form.validateFieldsAndScroll( (errors, values) => {
            if (!!errors) {
                return;
            }
            const value = form.getFieldValue('formOption')
            dispatch({
                type: 'alertOperation/dispatchForm',
                payload: value
            })

            form.resetFields();
        })
      }} >派发</Button>
      <Button type="ghost" onClick={ () => {
        dispatch({
            type: 'alertOperation/toggleFormModal',
            payload: false
        })
        form.resetFields();
      }}>取消</Button>
      </div>
    )

    return (
        <Modal
            title="派发工单"
            maskClosable="true"
            onCancel={ closeDispatchModal }
            visible={ isShowFormModal }
            footer={ modalFooter }
        >
            <div className={styles.dispatchMain}>
                <Form>
                    <Item
                        label="工单类别"
                        hasFeedback
                        help={isFieldValidating('formOption') ? '校验中...' : (getFieldError('formOption') || []).join(', ')}
                    >
                        {getFieldDecorator('formOption', {
                            rules: [
                                { required: true, message: '请输选择工单类型' }
                            ]
                        })(
                            <Select style={{width: '90%'}} placeholder="请选择工单类别">
                                {
                                    formOptions.map( (item, index) => {
                                        return <Option className={styles.menuItem} key={item.code} value={item.code}>{item.name}</Option>
                                    })
                                }
                            </Select>
                        )}
                    </Item>
                </Form>
            </div>
        </Modal>
    )
}

dispatchModal.defaultProps = {

}

dispatchModal.propTypes = {

}

export default Form.create()(
    connect( state => {
        return {
            alertOperation: state.alertOperation,
        }
    })(dispatchModal)
)