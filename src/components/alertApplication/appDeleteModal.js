import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'

const appDeleteModal = ({alertConfig, dispatch}) => {

    const { isShowDeteleModal, currentDeleteApp } = alertConfig;
    
    const closeDeleteModal = () => {
        dispatch({
            type: 'alertConfig/toggleDeleteModal',
            payload: {
                applicationItem: {},
                status: false,
            }
        })
    }

    const modalFooter = []
    modalFooter.push(<div key={1} className={styles.modalFooter}>
      <Button type="primary" onClick={ () => {
        dispatch({
            type: 'alertConfig/deleteApp'
        })
      }} >删除</Button>
      <Button type="primary" onClick={ () => {
        closeDeleteModal()
      }}>取消</Button>
      </div>
    )

    return (
        <Modal
          title="删除操作"
          maskClosable="true"
          onCancel={ closeDeleteModal }
          visible={ isShowDeteleModal }
          footer={ modalFooter }
        >
            <div className={styles.delModalMain}>
                <p>{`删除以后，数据无法恢复，您确定要删除${Object.keys(currentDeleteApp).length !== 0 ? currentDeleteApp['applyType']['name'] : '' }应用吗`}</p>
            </div>
        </Modal>
    )
}

appDeleteModal.propTypes = {

}

export default connect( state => {
    return {
        alertConfig: state.alertConfig,
    }
})(appDeleteModal);