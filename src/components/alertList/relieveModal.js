import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'

const relieveModal = ({alertOperation, dispatch}) => {

    const { isShowRelieveModal, relieveAlert } = alertOperation;

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
      }} >解除</Button>
      <Button type="ghost" onClick={ () => {
        dispatch({
            type: 'alertOperation/toggleRelieveModal',
            payload: false
        })
      }}>取消</Button>
      </div>
    )

    return (
        <Modal
            title="解除告警"
            maskClosable="true"
            onCancel={ closeRelieveModal }
            visible={ isShowRelieveModal }
            footer={ modalFooter }
        >
            <div className={styles.relieveMain}>
                <p>解除{`${relieveAlert.name}`}的合并告警</p>
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
