import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Tabs, Button } from 'antd'
import { classnames } from '../../utils'
import { Link } from 'dva/router'
import AssociationRulesList from '../common/configList'

import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const alertAssociationRules = ({dispatch, alertAssociationRules, intl: {formatMessage}}) => {
    
    const rulesListProps = {
        ...alertAssociationRules,

        pageBy: 'associationRule',

        listData: alertAssociationRules.associationRules,

        formatMessages: defineMessages({
            ruleName: {
                id: 'alertAssociationRules.List.ruleName',
                defaultMessage: '规则名称',
            },
            description: {
                id: 'alertAssociationRules.List.description',
                defaultMessage: '描述',
            },
            createPerson: {
                id: 'alertAssociationRules.List.createPerson',
                defaultMessage: '创建人',
            },
            status: {
                id: 'alertAssociationRules.List.onOff',
                defaultMessage: '是否开启',
            },
            operation: {
                id: 'alertAssociationRules.List.actions',
                defaultMessage: '操作',
            },
            action_edit: {
                id: 'alertAssociationRules.List.edit',
                defaultMessage: '编辑',
            },
            action_delete: {
                id: 'alertAssociationRules.List.delete',
                defaultMessage: '删除',
            },
            Unknown: {
                id: 'alertList.unknown',
                defaultMessage: '未知',
            },
            noData: {
                id: 'alertList.noListData',
                defaultMessage: '暂无数据',
            },
            ruleTypeNum_0: {
                id: 'alertAssociationRules.ruleTypeNum.0',
                defaultMessage: '周期性',
            },
            ruleTypeNum_1: {
                id: 'alertAssociationRules.ruleTypeNum.1',
                defaultMessage: '非周期性',
            },
            ruleTypeNum_2: {
                id: 'alertAssociationRules.ruleTypeNum.2',
                defaultMessage: '固定时间段',
            }
        }),

        orderUp: (e) => {
            const orderKey = e.target.getAttribute('data-key');
        
            dispatch({
                type: 'alertAssociationRules/orderList',
                payload: {
                    orderBy: orderKey,
                    orderType: 1
                }
            })
        },
        orderDown: (e) => {
            const orderKey = e.target.getAttribute('data-key');
        
            dispatch({
                type: 'alertAssociationRules/orderList',
                payload: {
                    orderBy: orderKey,
                    orderType: 0
                }
            })
        },
        orderByTittle: (e) => {
            const orderKey = e.target.getAttribute('data-key');
        
            dispatch({
                type: 'alertAssociationRules/orderByTittle',
                payload: orderKey
            })
        },
        switchClick: (id, status) => {
            
        },
        deleteClick: (item) => {
            
        },
        spreadGroup: (e) => {
            const groupClassify = e.target.getAttribute('data-classify')
      
            dispatch({
                type: 'alertAssociationRules/spreadGroup',
                payload: groupClassify
            })
        },
        noSpreadGroup: (e) => {
            const groupClassify = e.target.getAttribute('data-classify')
      
            dispatch({
                type: 'alertAssociationRules/noSpreadGroup',
                payload: groupClassify
            })
        }
    }

    const localeMessage = defineMessages({
        newRule: {
            id: 'alertAssociationRules.newRule',
            defaultMessage: '添加规则'
        },
        ruleTotal: {
            id: 'alertAssociationRules.ruleTotal',
            defaultMessage: '规则总数: {num}'
        }
    })


    return (
        <div className={styles.rulesTable}>
            <div className={styles.addBtn}>
                <Button type="primary" className={styles.appBtn} onClick={ () => {
                    //window.location.hash
                }}><span>{formatMessage({...localeMessage['newRule']})}</span></Button>
                <p className={styles.total}><FormattedMessage {...localeMessage['ruleTotal']} values={{num: `${alertAssociationRules.associationRulesTotal}`}}/></p>
            </div>
            <AssociationRulesList {...rulesListProps} />
        </div>
    )
}

export default injectIntl(alertAssociationRules)