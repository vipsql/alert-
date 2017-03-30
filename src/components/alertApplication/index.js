import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Tabs, Button } from 'antd'
import { classnames } from '../../utils'
import { Link } from 'dva/router'
import ApplicationList from '../common/applicationList'
import AppSelectModal from './appSelectModal'
import AppDeleteModal from './appDeleteModal'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const TabPane = Tabs.TabPane;
const alertApplication = ({dispatch, alertConfig, intl: {formatMessage}}) => {

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
                    status: status === true ? 1 : 0
                }
            })
        },
        deleteClick: (item) => {
            dispatch({
                type: 'alertConfig/toggleDeleteModal',
                payload: {
                    applicationItem: item,
                    status: true,
                }
            })
        }
    }

    const localeMessage = defineMessages({
        newApplication: {
            id: 'alertApplication.newApplication',
            defaultMessage: '添加应用'
        },
        incoming: {
            id: 'alertApplication.incoming',
            defaultMessage: '接入'
        },
        outgoing: {
            id: 'alertApplication.outgoing',
            defaultMessage: '转出'
        },
    })

    return (
        <div className={styles.myAppTabs}>
            <Tabs defaultActiveKey="0" type='line' onChange={ (tabKey) => {tabsChange(tabKey)}}>
                <TabPane tab={formatMessage({...localeMessage['incoming']})} key="0">
                    <ApplicationList {...appListProps} />
                    <div className={styles.addBtn}>
                        <Button type="primary" className={styles.appBtn} onClick={ () => {
                            openAppModal(0) // 0 -> 接入
                        }}><span>{formatMessage({...localeMessage['newApplication']})}</span></Button>
                    </div>
                </TabPane>
                <TabPane tab={formatMessage({...localeMessage['outgoing']})} key="1">
                    <ApplicationList {...appListProps} />
                    <div className={styles.addBtn}>
                        <Button type="primary" className={styles.appBtn} onClick={ () => {
                            openAppModal(1) // 1 -> 接出
                        }}><span>{formatMessage({...localeMessage['newApplication']})}</span></Button>
                    </div>
                </TabPane>
            </Tabs>
            <AppSelectModal />
            <AppDeleteModal />
        </div>
    )
}

export default injectIntl(connect((state) => {
    return {
        alertConfig: state.alertConfig,
    }
})(alertApplication))