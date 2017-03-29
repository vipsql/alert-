import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col, Input } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const Option = Select.Option;
const closeModal = ({currentData, closeCloseModal, clickDropdown, onOk, onCancal, okCloseMessage, editCloseMessage, mouseLeaveDropdown, form, intl: {formatMessage}}) => {
    
    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        modal_closeIncident: {
            id: 'modal.closeIncident',
            defaultMessage: '关闭告警'
        },
        modal_close: {
            id: 'modal.close',
            defaultMessage: '关闭'
        },
        modal_closeReason: {
            id: 'modal.closeReason',
            defaultMessage: '关闭理由'
        },
        modal_noCloseReason: {
            id: 'modal.noCloseReason',
            defaultMessage: '请选择关闭理由'
        },
        modal_closeReason_1: {
            id: 'modal.closeReason.1',
            defaultMessage: '故障已解决'
        },
        modal_closeReason_2: {
            id: 'modal.closeReason.2',
            defaultMessage: '计划停机'
        },
        modal_closeReason_3: {
            id: 'modal.closeReason.3',
            defaultMessage: '监控系统误报'
        },
    })

    const { isShowCloseModal, isDropdownSpread, closeMessage } = currentData;
    const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        onOk(closeMessage)
      }} ><FormattedMessage {...localeMessage['modal_close']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        onCancal()
      }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
      </div>
    )

    return (
        <Modal
            title={<FormattedMessage {...localeMessage['modal_closeIncident']} />}
            maskClosable="true"
            onCancel={ closeCloseModal }
            visible={ isShowCloseModal }
            footer={ modalFooter }
        >
            <div className={styles.closeMain}>
                <Form>
                    <Item
                        label={<FormattedMessage {...localeMessage['modal_closeReason']} />}
                        required
                    >
                        <Input style={{width: '100%'}} placeholder={formatMessage({...localeMessage['modal_noCloseReason']})} onClick={ (e) => {
                            okCloseMessage(isDropdownSpread)
                        }} value={closeMessage} onChange={ (e) => {
                            editCloseMessage(e)
                        }}/>
                    </Item>

                </Form>
                <ul onMouseLeave={ () => {
                    mouseLeaveDropdown()
                }} className={isDropdownSpread ? styles.selectDropdown : classnames(styles.selectDropdown, styles['selectDropdown-hidden'])}>
                    <li data-message={formatMessage({...localeMessage['modal_closeReason_1']})} onClick={(e) => {clickDropdown(e)}}><FormattedMessage {...localeMessage['modal_closeReason_1']} /></li>
                    <li data-message={formatMessage({...localeMessage['modal_closeReason_2']})} onClick={(e) => {clickDropdown(e)}}><FormattedMessage {...localeMessage['modal_closeReason_2']} /></li>
                    <li data-message={formatMessage({...localeMessage['modal_closeReason_3']})} onClick={(e) => {clickDropdown(e)}}><FormattedMessage {...localeMessage['modal_closeReason_3']} /></li>
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

export default injectIntl(Form.create()(closeModal))