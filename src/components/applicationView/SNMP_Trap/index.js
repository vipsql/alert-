import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Button, Input, Form, Table} from 'antd'
import { classnames, getUUID } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import RuleModal from './ruleConfigModal'

const Item = Form.Item;
const SNMP_Trap = (props) => {
    const { builtIn, dispatch, appkey, url, form, onOk, keyCreate, snmpTrapRules, intl: {formatMessage}} = props;
    
    const { getFieldDecorator, getFieldsValue } = form;
    const { appRules } = snmpTrapRules;

    const alertClass = classnames(
        'icon',
        'iconfont',
        'icon-Alert'
    )

    const localeMessage = defineMessages({
        rtrap_headerTitle: {
            id: 'alertApplication.trap.headerTitle',
            defaultMessage: '接入第三方监控系统发出的SNMP Trap告警'
        },
        trap_step2: {
            id: 'alertApplication.trap.step2',
            defaultMessage: '配置SNMP Trap'
        },
        trap_message: {
            id: 'alertApplication.trap.step2Message',
            defaultMessage: '本步骤主要完成配置SMNPTrap解析规则的定义'
        },
        trap_info: {
            id: 'alertApplication.trap.step2Info',
            defaultMessage: '在配置SNMPTrap规则之前，建议在您的监控系统中开启SNMPTrap并发送到{url}，端口号为{port}',
            values: {
                url: 'alert.uyun.cn',
                port: '8162'
            }
        },
        newRule: {
            id: 'alertApplication.trap.newRule',
            defaultMessage: '添加规则'
        },
        ruleName: {
            id: 'alertApplication.trap.ruleName',
            defaultMessage: '规则名称'
        },
        description: {
            id: 'alertApplication.trap.description',
            defaultMessage: '告警描述'
        },
        action: {
            id: 'alertApplication.trap.action',
            defaultMessage: '操作'
        },
        action_edit: {
            id: 'alertApplication.trap.action_edit',
            defaultMessage: '编辑'
        },
        action_delete: {
            id: 'alertApplication.trap.action_delete',
            defaultMessage: '删除'
        },
        displayName: {
            id: 'alertApplication.displayName',
            defaultMessage: '设定显示名'
        },
        displayName_message: {
            id: 'alertApplication.displayName.message',
            defaultMessage: '设定一个显示名用于标识应用'
        },
        displayName_placeholder: {
            id: 'alertApplication.displayName.placeholder',
            defaultMessage: '请输入应用名称'
        },
        appKey: {
            id: 'alertApplication.appKey',
            defaultMessage: '点击生成AppKey'
        },
        save: {
            id: 'alertApplication.save',
            defaultMessage: '保存'
        }
    })

    const matchFieldsList = []
    const groupFieldsList = []
    snmpTrapRules.operateAppRules.matchFields !== undefined && Object.keys(snmpTrapRules.operateAppRules.matchFields).length !== 0 && Object.keys(snmpTrapRules.operateAppRules.matchFields).forEach( (key, index) => {
        matchFieldsList.push({'OID': snmpTrapRules.operateAppRules.matchFields[key], 'mapper': key})
    })
    snmpTrapRules.operateAppRules.groupFields !== undefined && Object.keys(snmpTrapRules.operateAppRules.groupFields).length !== 0 && Object.keys(snmpTrapRules.operateAppRules.groupFields).forEach( (key, index) => {
        groupFieldsList.push({'compose': snmpTrapRules.operateAppRules.groupFields[key], 'field': key})
    })
    
    const ruleModalProps = {
        snmpTrapRules: {
            ...snmpTrapRules,
            matchFieldsList: matchFieldsList,
            groupFieldsList: groupFieldsList
        },
        okRule: (state, form) => {
            form.validateFieldsAndScroll( (errors, values) => {
                let appRule = {};
                appRule.filterFields = [];
                appRule.matchFields = {};
                appRule.groupFields = {};
                appRule.properties = [];
                if (!!errors) {
                    return;
                }
                const formData = form.getFieldsValue()
                appRule.name = formData.ruleName;
                appRule.description = formData.description;
                appRule.severity = formData.severity;
                state.filterFields.forEach( (filter) => {if (filter.key !== undefined) { appRule.filterFields.push(filter) }})
                state.matchFields.forEach( (matchField) => {if (matchField.OID !== undefined && matchField.OID !== '' && matchField.mapper !== undefined) { 
                    Object.defineProperty(appRule.matchFields, matchField.mapper, {
                        configurable: true,
                        enumerable: true,
                        value: matchField.OID,
                        writable: true
                    })
                 }})
                state.groupFieldsList.forEach( (groupField) => {if (groupField.field !== undefined && groupField.compose !== undefined) {
                    Object.defineProperty(appRule.groupFields, groupField.field, {
                        configurable: true,
                        enumerable: true,
                        value: groupField.compose,
                        writable: true
                    })
                 }})
                appRule.properties = state.properties.filter( (property) => { delete property.enitable; return property.code !== undefined && property.code !== '' && property.name !== undefined && property.name !== '' && property.oid !== undefined && property.oid !== ''})
                appRule.mergeKey = state.mergekey

                dispatch({
                    type: 'snmpTrapRules/saveRule',
                    payload: appRule
                })
                
                form.resetFields()
            })
        },
        closeModal: () => {
            dispatch({
                type: 'snmpTrapRules/toggleTrapModal',
                payload: false
            })
        }
    }

    return (
        <div className={styles.detailView}>
            <div className={styles.viewHeader}>
                <i className={classnames(alertClass, styles.headerIcon)}></i>
                <span className={styles.headerContent}>
                    <p className={styles.headerName}>SNMP Trap</p>
                    <p>{formatMessage({...localeMessage['rtrap_headerTitle']})}</p>
                </span>
            </div>
            <div className={styles.viewContent}>
                <div className={styles.step1}>
                    <span className={styles.step1Icon}></span>
                    <p className={styles.stepName}>{formatMessage({...localeMessage['displayName']})}</p>
                    <p className={styles.stepMessage}>{formatMessage({...localeMessage['displayName_message']})}</p>
                    <Form className={styles.viewForm}>
                        <Item>
                            {getFieldDecorator('displayName', {
                                rules: [
                                    { required: true, message: formatMessage({...localeMessage['displayName_placeholder']})}
                                ]
                            })(
                                <Input className={styles.nameInput} placeholder={formatMessage({...localeMessage['displayName_placeholder']})}></Input>
                            )}
                        </Item>
                    </Form>
                    {
                        appkey === undefined ? 
                        <Button type="primary" className={styles.createBtn} onClick={() => {keyCreate(form)}}>{formatMessage({...localeMessage['appKey']})}</Button>
                        :
                        <p className={styles.readOnly}>{`App key：${appkey}`}</p>
                    }
                </div>
                {
                    builtIn !== undefined && builtIn == 1 ?
                    <div className={styles.step2}>
                        <span className={styles.step2Icon}></span>
                        <p className={styles.stepName}>{formatMessage({...localeMessage['trap_step2']})}</p>
                        <p className={styles.stepMessage}>{formatMessage({...localeMessage['trap_message']})}</p>
                        <p className={styles.stepMessage}><FormattedMessage {...localeMessage['trap_info']}/></p>
                        <Button type="primary" onClick={ () => {
                            // Add TODO
                            dispatch({
                                type: 'snmpTrapRules/addRule'
                            })
                        }}><span>{formatMessage({...localeMessage['newRule']})}</span></Button>
                        <Table
                            className={styles.ruleTable}
                            columns={[
                                {
                                    title: <FormattedMessage {...localeMessage['ruleName']}/>,
                                    dataIndex: 'name',
                                    key: 'name',
                                },
                                {
                                    title: <FormattedMessage {...localeMessage['description']}/>,
                                    dataIndex: 'description',
                                    key: 'description',
                                },
                                {
                                    title: <FormattedMessage {...localeMessage['action']}/>,
                                    key: 'operation',
                                    render: (text, record) => {
                                        return (
                                            <span>
                                                <Button size='small' className={styles.editBtn} onClick={ () => {
                                                    // Edit TODO
                                                    dispatch({
                                                        type: 'snmpTrapRules/editRule',
                                                        payload: record.id
                                                    })
                                                }}>{formatMessage({...localeMessage['action_edit']})}</Button>
                                                &nbsp;&nbsp;&nbsp;&nbsp;
                                                <Button size='small' className={styles.delBtn} onClick={ () => {
                                                    // Delete TODO
                                                    dispatch({
                                                        type: 'snmpTrapRules/deleteRule',
                                                        payload: record.id
                                                    })
                                                }}>{formatMessage({...localeMessage['action_delete']})}</Button>
                                            </span>
                                        )
                                    }
                                }
                            ]}
                            rowKey={ record => record.id }
                            pagination={false}
                            dataSource={appRules}
                        />
                    </div>
                    : undefined
                }
                { builtIn !== undefined && builtIn == 1 ? <span className={styles.stepLine}></span> : undefined }
                <Button type="primary" htmlType='submit' onClick={(e) => {onOk(e, form)}}>{formatMessage({...localeMessage['save']})}</Button>
            </div>
            <RuleModal {...ruleModalProps}/>
        </div>
    )
}

export default injectIntl(Form.create({
    mapPropsToFields: (props) => {
        return {
            displayName: {
                value: props.displayName || undefined
            }
        }
    }
})(connect( (state) => {
    return {
        snmpTrapRules: state.snmpTrapRules
    }
})(SNMP_Trap)))