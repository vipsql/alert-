import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button } from 'antd';
import styles from './index.less'
import { classnames } from '../../utils'
import { Link } from 'dva/router'

const appSelectModal = ({alertConfig, dispatch}) => {

    const { isShowTypeModal, applicationTypeData } = alertConfig;
    
    const closeTypeModal = () => {
        dispatch({
            type: 'alertConfig/toggleTypeModal',
            payload: false
        })
    }

    const lis = applicationTypeData.map( (appGroup, index) => {
        const appDetail = appGroup.children.map( (app, index) => {
            return (
                <Link to={`alertConfig/alertApplication/applicationView/add/${app.id}`} key={index}>
                    <span key={index} className={styles.appItem}>{app.name}</span>
                </Link>
            )
        })
        return (
            <li key={index}>
                <p className={styles.appTitle}>{appGroup.appType}</p>
                {appDetail}
            </li>
        )
    })

    return (
        <Modal
          title="添加应用"
          maskClosable="true"
          onCancel={ closeTypeModal }
          visible={ isShowTypeModal }
          footer={ null }
          width={600}
        >
            <div className={styles.appModalMain}>
                <p>请选择一款应用</p>
                <ul>
                    {lis}
                </ul>
            </div>
        </Modal>
    )
}

appSelectModal.defaultProps = {

}

appSelectModal.propTypes = {

}

export default connect( state => {
    return {
        alertConfig: state.alertConfig,
    }
})(appSelectModal);