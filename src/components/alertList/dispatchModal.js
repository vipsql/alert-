import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'

const Item = Form.Item;
const Option = Select.Option;
const dispatchModal = ({alertOperation, dispatch, form}) => {

    const { isShowFormModal } = alertOperation;
    const { getFieldDecorator, getFieldsValue } = form;

    const closeDispatchModal = () => {
        dispatch({
            type: 'alertOperation/toggleFormModal',
            payload: false
        })
    }

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        dispatch({
            type: 'alertOperation/toggleFormModal',
            payload: false
        })
        form.resetFields();
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
                            >
                                {getFieldDecorator('closeOption')(
                                    <Select style={{width: '100%'}} placeholder="请选择工单类别">
                                        <Option className={styles.menuItem} value="0">工单类别1</Option>
                                        <Option className={styles.menuItem} value="1">工单类别2</Option>
                                        <Option className={styles.menuItem} value="2">工单类别3</Option>
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