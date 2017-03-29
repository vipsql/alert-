import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const relieveModal = ({alertOperation, dispatch}) => {

    const { isShowRelieveModal, relieveAlert } = alertOperation;

    const localeMessage = defineMessages({
        modal_cancel: {
            id: 'modal.cancel',
            defaultMessage: '取消'
        },
        modal_unrollup: {
            id: 'modal.unrollup',
            defaultMessage: '解除告警'
        },
        modal_unrollupMessage: {
            id: 'modal.unrollupMessage',
            defaultMessage: '解除{name}的合并告警',
            values: {
                name: relieveAlert.name
            }
        },
        
    })

    const closeRelieveModal = () => {
        dispatch({
            type: 'alertOperation/toggleRelieveModal',
            payload: false
        })
    }

    const modalFooter = []
    modalFooter.push(<div className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        dispatch({
            type: 'alertOperation/relieveAlert'
        })
      }} ><FormattedMessage {...localeMessage['modal_unrollup']} /></Button>
      <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
        dispatch({
            type: 'alertOperation/toggleRelieveModal',
            payload: false
        })
      }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
      </div>
    )

    return (
        <Modal
            title={<FormattedMessage {...localeMessage['modal_unrollup']} />}
            maskClosable="true"
            onCancel={ closeRelieveModal }
            visible={ isShowRelieveModal }
            footer={ modalFooter }
        >
            <div className={styles.relieveMain}>
                <p><FormattedMessage {...localeMessage['modal_unrollupMessage']} /></p>
            </div>
        </Modal>
    )
}

relieveModal.defaultProps = {

}

relieveModal.propTypes = {

}

export default connect( state => {
    return {
        alertOperation: state.alertOperation,
    }
})(relieveModal)
