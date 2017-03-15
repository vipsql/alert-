import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col, Input } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'

const Item = Form.Item;
const Option = Select.Option;
const closeModal = ({currentData, closeCloseModal, clickDropdown, onOk, onCancal, okCloseMessage, editCloseMessage, mouseLeaveDropdown, form}) => {
    
    const { isShowCloseModal, isDropdownSpread, closeMessage } = currentData;
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        onOk(closeMessage)
      }} >关闭</Button>
      <Button type="ghost" onClick={ () => {
        onCancal()
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
                        required
                    >
                        <Input style={{width: '100%'}} placeholder="请选择关闭理由" onClick={ (e) => {
                            okCloseMessage(isDropdownSpread)
                        }} value={closeMessage} onChange={ (e) => {
                            editCloseMessage(e)
                        }}/>
                    </Item>

                </Form>
                <ul onMouseLeave={ () => {
                    mouseLeaveDropdown()
                }} className={isDropdownSpread ? styles.selectDropdown : classnames(styles.selectDropdown, styles['selectDropdown-hidden'])}>
                    <li data-message={`关闭理由1：故障已解决`} onClick={(e) => {clickDropdown(e)}}>关闭理由1：故障已解决</li>
                    <li data-message={`关闭理由2：计划停机`} onClick={(e) => {clickDropdown(e)}}>关闭理由2：计划停机</li>
                    <li data-message={`关闭理由3：监控系统误报`} onClick={(e) => {clickDropdown(e)}}>关闭理由3：监控系统误报</li>
                </ul>
            </div>
        </Modal>
    )
}

closeModal.defaultProps = {
    currentData: {}, 
    closeCloseModal: () => {}, 
    clickDropdown: () => {}, 
    onOk: () => {}, 
    onCancal: () => {}, 
    okCloseMessage: () => {}, 
    editCloseMessage: () => {}, 
    mouseLeaveDropdown: () => {}, 
}

closeModal.propTypes = {

}

export default Form.create()(closeModal)