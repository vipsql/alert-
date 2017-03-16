import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Tabs } from 'antd'
import { classnames } from '../../utils'
import { Link } from 'dva/router'
import ApplicationList from '../common/applicationList'

const TabPane = Tabs.TabPane;
const alertApplication = ({dispatch, alertConfig}) => {

    const { orderType, orderBy, applicationData } = alertConfig;

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
                </TabPane>
                <TabPane tab="接出" key="2">
                    <ApplicationList {...appListProps} />
                </TabPane>
            </Tabs>
        </div>
    )
}

export default connect((state) => {
    return {
        alertConfig: state.alertConfig,
    }
})(alertApplication)