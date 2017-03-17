import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Tabs, Button } from 'antd'
import { classnames } from '../../utils'
import { Link } from 'dva/router'
import ApplicationList from '../common/applicationList'
import AppSelectModal from './appSelectModal'

const TabPane = Tabs.TabPane;
const alertApplication = ({dispatch, alertConfig}) => {

    const { orderType, orderBy, applicationData } = alertConfig;

    const switchClass = classnames(
        styles['icon'],
        styles.iconfont,
        styles['icon-anonymous-iconfont']
    )

    const tabsChange = (tabKey) => {
        dispatch({
            type: 'alertConfig/queryAplication',
            payload: {
                type: tabKey,
                orderBy: undefined,
                orderType: undefined,
            }
        })
    }

    const openAppModal = (type) => {
        dispatch({
            type: 'alertConfig/queryAplicationType',
            payload: type
        })
    }

    const appListProps = {
        ...alertConfig,

        orderUp: (e) => {
            const orderKey = e.target.getAttribute('data-key');
        
            dispatch({
                type: 'alertConfig/orderList',
                payload: {
                    orderBy: orderKey,
                    orderType: 1
                }
            })
        },
        orderDown: (e) => {
            const orderKey = e.target.getAttribute('data-key');
        
            dispatch({
                type: 'alertConfig/orderList',
                payload: {
                    orderBy: orderKey,
                    orderType: 0
                }
            })
        },
        orderByTittle: (e) => {
            const orderKey = e.target.getAttribute('data-key');
        
            dispatch({
                type: 'alertConfig/orderByTittle',
                payload: orderKey
            })
        },
        switchClick: (id, status) => {
            dispatch({
                type: 'alertConfig/changeStatus',
                payload: {
                    id: id,
                    status: status
                }
            })
        },
        deleteClick: (id) => {
            dispatch({
                type: 'alertConfig/deleteApp',
                payload: id
            })
        }
    }

    return (
        <div>
            <Tabs defaultActiveKey="1" type='line' onChange={ (tabKey) => {tabsChange(tabKey)}}>
                <TabPane tab="接入" key="1">
                    <ApplicationList {...appListProps} />
                    <Button type="primary" className={styles.appBtn} onClick={ () => {
                        openAppModal(0) // 0 -> 接入
                    }}><i className={switchClass}></i><span>添加应用</span></Button>
                </TabPane>
                <TabPane tab="接出" key="2">
                    <ApplicationList {...appListProps} />
                    <Button type="primary" className={styles.appBtn} onClick={ () => {
                        openAppModal(1) // 1 -> 接出
                    }}><i className={switchClass}></i><span>添加应用</span></Button>
                </TabPane>
            </Tabs>
            <AppSelectModal />
        </div>
    )
}

export default connect((state) => {
    return {
        alertConfig: state.alertConfig,
    }
})(alertApplication)