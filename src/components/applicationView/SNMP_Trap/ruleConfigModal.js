import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Select, Row, Col, Input, Table, Popover, Radio} from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Item = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;
class ruleModal extends Component{

    constructor(props){
        console.log('constructor modal')
        super(props);
        this.state = {
            dataSource: 1,
            filterFields: [{ key: undefined, ruleMatch: '3'}],
            matchFields: [{'OID': undefined, 'mapper': undefined, 'enitable': true}],
            properties: [{'oid': undefined, 'code': undefined, 'name': undefined, 'enitable': true}],
            groupFieldsList: [{'field': undefined, 'compose': undefined, 'enitable': true}],
            levelList: [{'trap': undefined, 'severity': undefined, 'enitable': true}],
            mergeKey: '', 
            __matchProps: [],
            __groupFieldProps: [],
            __groupComposeProps: [],
            __mergeProps: [],
        }
        
        this.haveOIDChildrenList = false; // Trap OID + 精确匹配时 --> true

        this.replaceFunc = this.replaceFunc.bind(this)
        this.addFieldMapper = this.addFieldMapper.bind(this)
        this.enitFieldMapper = this.enitFieldMapper.bind(this)
        this.deleFieldMapper = this.deleFieldMapper.bind(this)
        this.addComposeField = this.addComposeField.bind(this)
        this.editComposeField = this.editComposeField.bind(this)
        this.deleComposeField = this.deleComposeField.bind(this)
        this.clickCompose = this.clickCompose.bind(this)
        this.clickComposeByField = this.clickComposeByField.bind(this)
        this.addOrRemoveSeverity = this.addOrRemoveSeverity.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.snmpTrapRules !== this.props.snmpTrapRules) {
            //console.log(nextProps.snmpTrapRules.levelList)
            this.setState({
                dataSource: nextProps.snmpTrapRules.operateAppRules.dataSource || 1,
                filterFields: nextProps.snmpTrapRules.operateAppRules.filterFields || [{ key: undefined, ruleMatch: '3'}],
                matchFields: nextProps.snmpTrapRules.matchFieldsList.length !== 0 ? nextProps.snmpTrapRules.matchFieldsList : [{'OID': undefined, 'mapper': undefined, 'enitable': true}],
                properties: nextProps.snmpTrapRules.operateAppRules.properties !== undefined && nextProps.snmpTrapRules.operateAppRules.properties.length !== 0 ? nextProps.snmpTrapRules.operateAppRules.properties : [{'oid': undefined, 'code': undefined, 'name': undefined, 'enitable': true}],
                groupFieldsList: nextProps.snmpTrapRules.groupFieldsList.length !== 0 ? nextProps.snmpTrapRules.groupFieldsList : [{'field': undefined, 'compose': undefined, 'enitable': true}],
                levelList: nextProps.snmpTrapRules.levelList.length !== 0 ? nextProps.snmpTrapRules.levelList : [{'trap': undefined, 'severity': undefined, 'enitable': true}],
                mergeKey: nextProps.snmpTrapRules.operateAppRules.mergeKey || '',
                __matchProps: nextProps.snmpTrapRules.__matchProps,
                __groupFieldProps: nextProps.snmpTrapRules.__groupFieldProps,
                __groupComposeProps: nextProps.snmpTrapRules.__groupComposeProps,
                __mergeProps: nextProps.snmpTrapRules.__mergeProps,
            })
        }
    }

    // 遍历替换当前值
    replaceFunc(data, targetIndex, key, targetValue) {
        //TODO
        let newData = data.map( (item, itemIndex) => {
            if (targetIndex === itemIndex) { item[key] = targetValue }
            return item
        })
        return newData
    }

    // 点击合并原则时触发
    clickCompose() {
        let __newMergeProps = [];
        this.state.matchFields.forEach( (field) => {
            if (field['enitable'] === undefined && (field['mapper'] === 'name' || field['mapper'] === 'entityName') && field['mapper'] !== undefined)
                !__newMergeProps.includes(field['mapper']) && __newMergeProps.push(field['mapper'])
        })
        this.state.properties.forEach( (field) => {
            if (field['enitable'] === undefined && field['code'] !== undefined && field['code'] !== '')
                !__newMergeProps.includes(field['code']) && __newMergeProps.push(field['code'])
        })
        this.state.groupFieldsList.forEach( (field) => {
            if (field['enitable'] === undefined && (field['field'] === 'name' || field['field'] === 'entityName') && field['field'] !== undefined)
                !__newMergeProps.includes(field['field']) && __newMergeProps.push(field['field'])
        })
        this.setState({ __mergeProps: [...__newMergeProps]})
    }

    // 点击组合时触发
    clickComposeByField() {
        let __newGroupComposeProps = [];
        this.state.matchFields.forEach( (field) => {
            if (field['enitable'] === undefined && field['mapper'] !== undefined)
                !__newGroupComposeProps.includes(field['mapper']) && __newGroupComposeProps.push(field['mapper'])
        })
        this.state.properties.forEach( (field) => {
            if (field['enitable'] === undefined && field['code'] !== undefined && field['code'] !== '')
                !__newGroupComposeProps.includes(field['code']) && __newGroupComposeProps.push(field['code'])
        })
        this.setState({ __groupComposeProps: [...__newGroupComposeProps]})
    }

    // 在增加映射字段时 --> 减少字段组合中的可选字段，增加组合的可选项目
    addFieldMapper(data, targetIndex, key, targetValue) {
        //TODO
        let newMatchFields = []
        let __newMatchProps = []

        data.forEach( (item, itemIndex) => {
            if (targetIndex === itemIndex) {
                item[key] = targetValue 
            }

            // 重复的置为undefined
            if (item['enitable'] && item['mapper'] === data[targetIndex]['mapper']) {
                item['mapper'] = undefined
            }
            newMatchFields.push(item)
        })
        this.state.__matchProps.forEach( (child) => {
            if (data[targetIndex]['mapper'] !== child) { __newMatchProps.push(child) }
        })
        this.setState({ matchFields: [ ...newMatchFields ], __matchProps: __newMatchProps})
    }

    // 在编辑映射字段时 --> 将内容补到__matchProps中
    enitFieldMapper(data, targetIndex, key, targetValue) {
        //TODO
        let newMatchFields = []
        let __newMatchProps = [].concat(this.state.__matchProps)
        
        data.forEach( (item, itemIndex) => {
            if (targetIndex === itemIndex) {
                item[key] = targetValue 
            }
            newMatchFields.push(item)
        })
        if (data[targetIndex]['mapper'] !== undefined && !__newMatchProps.includes(data[targetIndex]['mapper'])) { 
            __newMatchProps.push(data[targetIndex]['mapper']) 
        }
        
        this.setState({ matchFields: [ ...newMatchFields ], __matchProps: __newMatchProps })
    }

    // 在删除映射字段时 --> 增加字段组合中的可选字段，减少组合的可选项目
    deleFieldMapper(data, targetIndex) {
        let __newMatchProps = [].concat(this.state.__matchProps)
        
        let newMatchFields = data.filter( (item, itemIndex) => {
            if (itemIndex === targetIndex && item['enitable'] === undefined) {
                if ( item['mapper'] !== undefined) { __newMatchProps.unshift(item['mapper'])}
            }
            return itemIndex !== targetIndex 
        })

        this.setState({ matchFields: [ ...newMatchFields ], __matchProps: __newMatchProps })
    }

    // 在编辑字段组合时 --> 将内容补到__matchProps中
    editComposeField(data, targetIndex, key, targetValue) {
        //TODO
        let newGroupFieldsList = []
        let __newGroupFieldProps = [].concat(this.state.__groupFieldProps)
        data.forEach( (item, itemIndex) => {
            if (targetIndex === itemIndex) {
                item[key] = targetValue 
            }
            newGroupFieldsList.push(item)
        })
        if (data[targetIndex]['field'] !== undefined && !__newGroupFieldProps.includes(data[targetIndex]['field'])) { 
            __newGroupFieldProps.push(data[targetIndex]['field']) 
        }

        this.setState({ groupFieldsList: [ ...newGroupFieldsList ], __groupFieldProps: __newGroupFieldProps })
    }

    // 在新增字段组合时 --> 除掉已经选择的
    addComposeField(data, targetIndex, key, targetValue) {
        //TODO
        let __newGroupFieldProps = []
        let newGroupFieldsList = []
        data.forEach( (item, itemIndex) => {
            if (targetIndex === itemIndex) {
                item[key] = targetValue 
            }
            // 重复的置为undefined
            if (item['enitable'] && item['field'] === data[targetIndex]['field']) {
                item['field'] = undefined
            }
            newGroupFieldsList.push(item)
        })
        
        this.state.__groupFieldProps.forEach( (child) => {
            if (data[targetIndex]['field'] !== child) { __newGroupFieldProps.push(child) }
        })
        this.setState({ groupFieldsList: [ ...newGroupFieldsList ], __groupFieldProps: __newGroupFieldProps })
    }

    // 在删除字段组合时 --> 补全删除的
    deleComposeField(data, targetIndex) {
        let __newGroupFieldProps = [].concat(this.state.__groupFieldProps)
        let newGroupFieldsList = data.filter( (item, itemIndex) => {
            if (itemIndex === targetIndex && item['enitable'] === undefined) {
                if ( item['field'] !== undefined) { __newGroupFieldProps.unshift(item['field'])}
            }
            return itemIndex !== targetIndex 
        })

        this.setState({ groupFieldsList: [ ...newGroupFieldsList ], __groupFieldProps: __newGroupFieldProps })
    }

    // 网络设备时，去掉severity - 第三方网络监控时，加上severity可选字段
    addOrRemoveSeverity(state) {
        let __newMatchProps = [].concat(this.state.__matchProps)
        let __newGroupFieldProps = [].concat(this.state.__groupFieldProps)
        if (state === 1 && (__newMatchProps.includes('severity') || __newGroupFieldProps.includes('severity'))) {
            __newMatchProps = __newMatchProps.filter((field) => field !== 'severity')
            __newGroupFieldProps = __newGroupFieldProps.filter((field) => field !== 'severity')
        } else if (state === 2){
            !__newMatchProps.includes('severity') && __newMatchProps.push('severity')
            !__newGroupFieldProps.includes('severity') && __newGroupFieldProps.push('severity')
        }

        this.setState({dataSource: state, __matchProps: __newMatchProps, __groupFieldProps: __newGroupFieldProps})
    }

    render() {
        const { snmpTrapRules, okRule, closeModal, form, intl: {formatMessage} } = this.props;
        const { isShowTrapModal } = snmpTrapRules
        const { getFieldDecorator, getFieldsValue, isFieldValidating, getFieldError } = form;

        const shanchuClass = classnames(
            'icon',
            'iconfont',
            'icon-anonymous-iconfont'
        )

        const composeClass = classnames(
            'icon',
            'iconfont',
            'icon-snmp'
        )

        const localeMessage = defineMessages({
            modal_ok: {
                id: 'modal.ok',
                defaultMessage: '确定'
            },
            modal_cancel: {
                id: 'modal.cancel',
                defaultMessage: '取消'
            },
            addRule: {
                id: 'alertApplication.trap.newRule',
                defaultMessage: '添加规则'
            },
            modal_validating: {
                id: 'modal.validating',
                defaultMessage: '检验中...'
            },
            ruleName: {
                id: 'modal.trap.ruleName',
                defaultMessage: '规则名称'
            },
            ruleName_placeholder: {
                id: 'modal.trap.ruleName_placeholder',
                defaultMessage: '请输入规则名称'
            },
            ruleDescription: {
                id: 'modal.trap.ruleDescription',
                defaultMessage: '规则描述'
            },
            ruleDescription_placeholder: {
                id: 'modal.trap.ruleDescription_placeholder',
                defaultMessage: '请输入规则描述'
            },
            rule_dataSource: {
                id: 'modal.trap.dataSource',
                defaultMessage: '数据源'
            },
            rule_dataSource_netWork: {
                id: 'modal.trap.dataSource.netWork',
                defaultMessage: '网络设备'
            },
            rule_dataSource_thirdParty: {
                id: 'modal.trap.dataSource.thirdParty',
                defaultMessage: '第三方监控系统'
            },
            rule_filter: {
                id: 'modal.trap.filter',
                defaultMessage: '过滤条件:'
            },
            rule_filter_Exact: {
                id: 'modal.trap.filter.Exact',
                defaultMessage: '精确匹配'
            },
            rule_filter_Inexact: {
                id: 'modal.trap.filter.Inexact',
                defaultMessage: '模糊匹配'
            },
            rule_filter_Range: {
                id: 'modal.trap.filter.Range',
                defaultMessage: '范围'
            },
            rule_filter_Regular: {
                id: 'modal.trap.filter.Regular',
                defaultMessage: '正则表达式'
            },
            rule_Condition: {
                id: 'modal.trap.condition',
                defaultMessage: '添加条件'
            },
            rule_addRow: {
                id: 'modal.trap.addRow',
                defaultMessage: '添加行'
            },
            rule_fieldMatch: {
                id: 'modal.trap.fieldMatch',
                defaultMessage: '字段匹配:'
            },
            rule_fieldMatch_mapper: {
                id: 'modal.trap.fieldMatch.mapper',
                defaultMessage: '字段映射'
            },
            rule_expression: {
                id: 'modal.trap.expression',
                defaultMessage: '表达式'
            },
            rule_OID: {
                id: 'modal.trap.OID',
                defaultMessage: 'OID'
            },
            rule_action: {
                id: 'modal.trap.action',
                defaultMessage: '操作'
            },
            rule_action_edit: {
                id: 'modal.trap.action.edit',
                defaultMessage: '编辑'
            },
            rule_action_save: {
                id: 'modal.trap.action.save',
                defaultMessage: '保存'
            },
            rule_action_delete: {
                id: 'modal.trap.action.delete',
                defaultMessage: '删除'
            },
            rule_fieldEnrich: {
                id: 'modal.trap.fieldEnrich',
                defaultMessage: '字段扩展:'
            },
            rule_fieldEnrich_newField: {
                id: 'modal.trap.fieldEnrich.newField',
                defaultMessage: '新字段名'
            },
            rule_fieldEnrich_displayName: {
                id: 'modal.trap.fieldEnrich.displayName',
                defaultMessage: '显示名'
            },
            rule_fieldsComposition: {
                id: 'modal.trap.fieldsComposition',
                defaultMessage: '字段组合:'
            },
            rule_fieldsComposition_field: {
                id: 'modal.trap.fieldsComposition.field',
                defaultMessage: '字段'
            },
            rule_fieldsComposition_compose: {
                id: 'modal.trap.fieldsComposition.composition',
                defaultMessage: '组合'
            },
            rule_noSelectField: {
                id: 'modal.trap.noSelectField',
                defaultMessage: '没有可选字段'
            },
            rule_mergeKeys: {
                id: 'modal.trap.mergeKeys',
                defaultMessage: '合并原则'
            },
            rule_mergeKeys_message: {
                id: 'modal.trap.mergeKeys.message',
                defaultMessage: '指定合并告警的关键字段'
            },
            rule_bindCMDB: {
                id: 'modal.trap.bindCMDB',
                defaultMessage: '绑定CMDB类'
            },
            rule_bindCMDB_placeholder: {
                id: 'modal.trap.bindCMDB.placeholder',
                defaultMessage: '请选择需要绑定的CMDB类'
            },
            rule_severityMapper: {
                id: 'modal.trap.severityMapper',
                defaultMessage: '级别映射'
            },
            rule_severityMapper_severity: {
                id: 'modal.trap.severityMapper.severity',
                defaultMessage: '告警等级'
            },
            rule_severityMapper_placeholder: {
                id: 'modal.trap.severityMapper.placeholder',
                defaultMessage: '请输入告警级别'
            },
            rule_severityMapper_trap: {
                id: 'modal.trap.severityMapper.trap',
                defaultMessage: 'Trap级别'
            },
            rule_severityMapper_alert: {
                id: 'modal.trap.severityMapper.alert',
                defaultMessage: 'Alert级别'
            },
            rule_severityMapper_message: {
                id: 'modal.trap.severityMapper.message',
                defaultMessage: 'Alert级别定义：紧急 - 3，警告 - 2，提醒 - 1，正常 - 0'
            }
        })

        const modalFooter = []
        modalFooter.push(<div className={styles.modalFooter}>
        <Button type="primary" onClick={ () => {
            okRule(this.state, form)
        }} ><FormattedMessage {...localeMessage['modal_ok']} /></Button>
        <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
            closeModal()
        }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
        </div>
        )
        
        const filters = this.state.filterFields !== undefined && this.state.filterFields.length !== 0 && this.state.filterFields.map( (filter, index) => {
            
            return (
                <li key={index}>
                    <Select value={filter.key} onChange={ (value) => {
                        //TODO
                        let data = this.replaceFunc(this.state.filterFields, index, 'key', value)
                        this.setState({ filterFields: [ ...data ] })
                    }}>
                        {
                            this.props.snmpTrapRules.filterSource.length > 0 ? this.props.snmpTrapRules.filterSource.map( (source, sourceIndex) => {
                                return <Option key={sourceIndex} value={source}>{source}</Option>
                            }) : []
                        }
                    </Select>
                    <Select value={`${filter.ruleMatch}`} onChange={ (value) => {
                        //TODO
                        let data = this.replaceFunc(this.state.filterFields, index, 'ruleMatch', value)
                        this.setState({ filterFields: [ ...data ] })
                    }}>
                        <Option value={'3'}>{formatMessage({...localeMessage['rule_filter_Exact']})}</Option>
                        <Option value={'2'}>{formatMessage({...localeMessage['rule_filter_Inexact']})}</Option>
                        <Option value={'4'}>{formatMessage({...localeMessage['rule_filter_Range']})}</Option>
                        <Option value={'1'}>{formatMessage({...localeMessage['rule_filter_Regular']})}</Option>
                    </Select>
                    {
                        this.state.filterFields[index]['ruleMatch'] === "3" && this.state.filterFields[index]['key'] === "Snmp TrapOID" ?
                        <Select mode='combobox' style={{width: '30%'}} value={filter.value} onChange={ (value) => {
                            //TODO
                            let data = this.replaceFunc(this.state.filterFields, index, 'value', value)
                            this.setState({ filterFields: [ ...data ] })
                        }}>
                            {
                                this.props.snmpTrapRules.OIDList.length > 0 ? this.props.snmpTrapRules.OIDList.map( (oid, oidIndex) => {
                                    return <Option key={oidIndex} value={oid.oid}><span title={oid.oid}>{oid.oid}</span></Option>
                                }) : []
                            }
                        </Select>
                        :
                        <Input value={filter.value} onChange={ (e) => {
                            //TODO
                            let data = this.replaceFunc(this.state.filterFields, index, 'value', e.target.value)
                            this.setState({ filterFields: [ ...data ] })
                        }}/>
                    }
                    {
                        index !== 0 ?
                        <i className={classnames(styles.shanChu, shanchuClass)} onClick={() => {
                            //TODO
                            let newFilters = this.state.filterFields.filter( (item, itemIndex) => { return itemIndex !== index })
                            this.setState({ filterFields: [ ...newFilters ] })
                        }}></i>
                        :
                        undefined
                    }
                </li>
            )
        })

        const itemLayout = {
            labelCol: { span: 3 },
            wrapperCol: { span: 8 },
        }

        this.haveOIDChildrenList = false;
        let targetOIDList = [].concat(this.props.snmpTrapRules.OIDList);
        let oidChildrenList = [];
        this.state.filterFields.length > 0 && this.state.filterFields.forEach( (filter, index) => {
            if (filter['ruleMatch'] === "3" && filter['key'] === 'Snmp TrapOID') {
                this.haveOIDChildrenList = true;
                let status = false;
                targetOIDList.length > 0 && targetOIDList.forEach( (oid, oidIndex) => {
                    if (oid.oid === filter['value']) {
                        status = true;
                        Object.keys(oid.bindingOIDs).length > 0 && Object.keys(oid.bindingOIDs).forEach( (key) => {
                            oidChildrenList.push({'name': key, 'description': `${key} --> ${oid.bindingOIDs[key]}`})
                        })
                    }
                })
                if (status) {
                    targetOIDList = targetOIDList.filter( oid => oid.oid !== filter['value'])
                }
            }
        })
        
        return (
            <Modal
                title={<FormattedMessage {...localeMessage['addRule']} />}
                maskClosable="true"
                onCancel={ closeModal }
                visible={ isShowTrapModal }
                footer={ modalFooter }
                width={850}
            >
                <div className={styles.ruleMain}>
                    <Form className={styles.ruleForm}>
                        <Item
                            {...itemLayout}
                            label={formatMessage({...localeMessage['ruleName']})}
                            hasFeedback
                            help={isFieldValidating('ruleName') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('ruleName') || []).join(', ')}
                        >
                            {getFieldDecorator('ruleName', {
                                rules: [
                                    { required: true, message: formatMessage({...localeMessage['ruleName_placeholder']})}
                                ]
                            })(
                                <Input placeholder={formatMessage({...localeMessage['ruleName_placeholder']})}></Input>
                            )}
                        </Item>
                        <Item
                            {...itemLayout}
                            wrapperCol={{span: 20}}
                            label={formatMessage({...localeMessage['ruleDescription']})}
                            hasFeedback
                            help={isFieldValidating('description') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('description') || []).join(', ')}
                        >
                            {getFieldDecorator('description', {
                                rules: [
                                    { required: true, message: formatMessage({...localeMessage['ruleDescription_placeholder']})}
                                ]
                            })(
                                <Input type="textarea" autosize={{ minRows: 2, maxRows: 6 }} placeholder={formatMessage({...localeMessage['ruleDescription_placeholder']})}></Input>
                            )}
                        </Item>
                        <Item
                            {...itemLayout}
                            wrapperCol={{span: 12}}
                            label={formatMessage({...localeMessage['rule_dataSource']})}
                        >
                            <RadioGroup onChange={(e) => {
                                this.addOrRemoveSeverity(e.target.value)
                            }} value={this.state.dataSource}>
                                <Radio value={1}>{formatMessage({...localeMessage['rule_dataSource_netWork']})}</Radio>
                                <Radio value={2}>{formatMessage({...localeMessage['rule_dataSource_thirdParty']})}</Radio>
                            </RadioGroup>
                        </Item>
                        <Item
                            {...itemLayout}
                            wrapperCol={{span: 18}}
                            label={formatMessage({...localeMessage['rule_filter']})}
                        >
                            <ul className={styles.filterContainer}>
                                { filters }
                            </ul>
                            <div className={styles.addBtn}>
                                <Button type="primary" className={styles.appBtn} onClick={ () => {
                                    //TODO
                                    this.setState({
                                        filterFields: [
                                            ...this.state.filterFields,
                                            { key: undefined, ruleMatch: '3'}
                                        ]
                                    })
                                }}><span>{formatMessage({...localeMessage['rule_Condition']})}</span></Button>
                            </div>
                        </Item>
                        <Item
                            {...itemLayout}
                            wrapperCol={{span: 20}}
                            label={formatMessage({...localeMessage['rule_fieldMatch']})}
                        >
                            <Table 
                                className={styles.modalTable}
                                columns={[
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_OID']}/>,
                                        dataIndex: 'OID',
                                        width: '200px',
                                        key: 'OID',
                                        render: (text, record, index) => {
                                            let { OID, enitable } = this.state.matchFields[index];
                                            return (
                                                enitable ?
                                                (
                                                    this.haveOIDChildrenList ?
                                                    <Select mode='combobox' value={text} onChange={ (value) => {
                                                        //TODO
                                                        var temp = value.split('_')
                                                        if (temp[0] !== undefined) {
                                                            let data = this.replaceFunc(this.state.matchFields, index, 'OID', temp[0])
                                                            this.setState({ matchFields: [ ...data ] })
                                                        }
                                                    }}>
                                                        {
                                                            oidChildrenList.length > 0 ? oidChildrenList.map( (oid, oidIndex) => {
                                                                return <Option key={oidIndex} value={`${oid.name}_${Math.random()}`}><span title={oid.description}>{oid.description}</span></Option>
                                                            }) : []
                                                        }
                                                    </Select>
                                                    :
                                                    <Input value={text} onChange={(e) => {
                                                        //TODO
                                                        let data = this.replaceFunc(this.state.matchFields, index, 'OID', e.target.value)
                                                        this.setState({ matchFields: [ ...data ] })
                                                    }} />
                                                )
                                                :
                                                <span title={text}>{text}</span>
                                            )
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_expression']}/>,
                                        key: 'expression',
                                        render: (text, record, index) => {
                                            return <span className={styles.expression}>=</span>
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_fieldMatch_mapper']}/>,
                                        dataIndex: 'mapper',
                                        key: 'mapper',
                                        render: (text, record, index) => {
                                            let { mapper, enitable } = this.state.matchFields[index];
                                            return (
                                                enitable ?
                                                <Select showSearch optionFilterProp="children" notFoundContent='Not Found' filterOption={ (input, option) => {
                                                    return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }} value={text} onChange={(value) => {
                                                    //TODO
                                                    let data = this.replaceFunc(this.state.matchFields, index, 'mapper', value)
                                                    this.setState({ matchFields: [ ...data ] })
                                                }}>
                                                    {
                                                        this.state.__matchProps.length > 0 ? this.state.__matchProps.map( (field, index) => {
                                                            return <Option key={index} value={field}>{field}</Option>
                                                        }) : []
                                                    }
                                                </Select>
                                                :
                                                text
                                            )
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_action']}/>,
                                        width: '135px',
                                        key: 'operation',
                                        render: (text, record, index) => {
                                            let { OID, mapper, enitable } = this.state.matchFields[index];
                                            return (
                                                <span>
                                                    {
                                                        enitable ?
                                                        <Button size='small' disabled={ OID === undefined || OID === '' || mapper === undefined } className={styles.editBtn} onClick={ () => {
                                                            this.addFieldMapper(this.state.matchFields, index, 'enitable', undefined)
                                                        }}>{formatMessage({...localeMessage['rule_action_save']})}</Button>
                                                        :
                                                        <Button size='small' className={styles.editBtn} onClick={ () => {
                                                            //TODO
                                                            this.enitFieldMapper(this.state.matchFields, index, 'enitable', true)
                                                        }}>{formatMessage({...localeMessage['rule_action_edit']})}</Button>
                                                    }
                                                    &nbsp;&nbsp;
                                                    <Button size='small' className={styles.delBtn} onClick={ () => {
                                                        //TODO
                                                        this.deleFieldMapper(this.state.matchFields, index)
                                                    }}>{formatMessage({...localeMessage['rule_action_delete']})}</Button>
                                                </span>
                                            )
                                        }
                                    }
                                ]}
                                pagination={false}
                                dataSource={this.state.matchFields}
                            />
                            <div className={styles.addBtn}>
                                <Button type="primary" className={styles.appBtn} onClick={ () => {
                                    //TODO
                                    this.setState({
                                        matchFields: [
                                            ...this.state.matchFields,
                                            {'OID': undefined, 'mapper': undefined, 'enitable': true}
                                        ]
                                    })
                                }}><span>{formatMessage({...localeMessage['rule_addRow']})}</span></Button>
                            </div>
                        </Item>
                        <Item
                            {...itemLayout}
                            wrapperCol={{span: 20}}
                            label={formatMessage({...localeMessage['rule_fieldEnrich']})}
                        >
                            <Table 
                                className={styles.modalTable}
                                columns={[
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_OID']}/>,
                                        dataIndex: 'oid',
                                        width: '150px',
                                        key: 'oid',
                                        render: (text, record, index) => {
                                            let { oid, enitable } = this.state.properties[index];
                                            return (
                                                enitable ?
                                                (
                                                    this.haveOIDChildrenList ?
                                                    <Select mode='combobox' value={text} onChange={ (value) => {
                                                        //TODO
                                                        var temp = value.split('_')
                                                        if (temp[0] !== undefined) {
                                                            let data = this.replaceFunc(this.state.properties, index, 'oid', temp[0])
                                                            this.setState({ properties: [ ...data ] })
                                                        }
                                                    }}>
                                                        {
                                                            oidChildrenList.length > 0 ? oidChildrenList.map( (oid, oidIndex) => {
                                                                return <Option key={oidIndex} value={`${oid.name}_${Math.random()}`}><span title={oid.description}>{oid.description}</span></Option>
                                                            }) : []
                                                        }
                                                    </Select>
                                                    :
                                                    <Input value={text} onChange={(e) => {
                                                        //TODO
                                                        let data = this.replaceFunc(this.state.properties, index, 'oid', e.target.value)
                                                        this.setState({ properties: [ ...data ] })
                                                    }} />
                                                )
                                                :
                                                <span title={text}>{text}</span>
                                            )
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_expression']}/>,
                                        width: '95px',
                                        key: 'expression',
                                        render: (text, record, index) => {
                                            return <span className={styles.expression}>=</span>
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_fieldEnrich_newField']}/>,
                                        dataIndex: 'code',
                                        key: 'code',
                                        render: (text, record, index) => {
                                            let { code, enitable } = this.state.properties[index];
                                            return (
                                                enitable ?
                                                <Input value={text} onChange={(e) => {
                                                    //TODO
                                                    let data = this.replaceFunc(this.state.properties, index, 'code', e.target.value)
                                                    this.setState({ properties: [ ...data ] })
                                                }} />
                                                :
                                                <span title={text}>{text}</span>
                                            )
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_fieldEnrich_displayName']}/>,
                                        dataIndex: 'name',
                                        key: 'name',
                                        render: (text, record, index) => {
                                            let { name, enitable } = this.state.properties[index];
                                            return (
                                                enitable ?
                                                <Input value={text} onChange={(e) => {
                                                    //TODO
                                                    let data = this.replaceFunc(this.state.properties, index, 'name', e.target.value)
                                                    this.setState({ properties: [ ...data ] })
                                                }} />
                                                :
                                                <span title={text}>{text}</span>
                                            )
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_action']}/>,
                                        width: '135px',
                                        key: 'operation',
                                        render: (text, record, index) => {
                                            let { oid, code, name, enitable } = this.state.properties[index];
                                            return (
                                                <span>
                                                    {
                                                        enitable ?
                                                        <Button size='small' disabled={ oid === undefined || oid === '' || code === undefined || code === '' || name === undefined || name === ''} className={styles.editBtn} onClick={ () => {
                                                            //TODO
                                                            let data = this.replaceFunc(this.state.properties, index, 'enitable', undefined)
                                                            this.setState({ properties: [ ...data ] })
                                                        }}>{formatMessage({...localeMessage['rule_action_save']})}</Button>
                                                        :
                                                        <Button size='small' className={styles.editBtn} onClick={ () => {
                                                            //TODO
                                                            let data = this.replaceFunc(this.state.properties, index, 'enitable', true)
                                                            this.setState({ properties: [ ...data ] })
                                                        }}>{formatMessage({...localeMessage['rule_action_edit']})}</Button>
                                                    }
                                                    &nbsp;&nbsp;
                                                    <Button size='small' className={styles.delBtn} onClick={ () => {
                                                        //TODO
                                                        let data = this.state.properties.filter( (property, itenIndex) => itenIndex !== index )
                                                        this.setState({ properties: [ ...data ] })
                                                    }}>{formatMessage({...localeMessage['rule_action_delete']})}</Button>
                                                </span>
                                            )
                                        }
                                    }
                                ]}
                                pagination={false}
                                dataSource={this.state.properties}
                            />
                            <div className={styles.addBtn}>
                                <Button type="primary" className={styles.appBtn} onClick={ () => {
                                    //TODO
                                    this.setState({
                                        properties: [
                                            ...this.state.properties,
                                            {'oid': undefined, 'code': undefined, 'name': undefined, 'enitable': true}
                                        ]
                                    })
                                }}><span>{formatMessage({...localeMessage['rule_addRow']})}</span></Button>
                            </div>
                        </Item>
                        <Item
                            {...itemLayout}
                            wrapperCol={{span: 20}}
                            label={formatMessage({...localeMessage['rule_fieldsComposition']})}
                        >
                            <Table 
                                className={styles.modalTable}
                                columns={[
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_fieldsComposition_field']}/>,
                                        dataIndex: 'field',
                                        width: '150px',
                                        key: 'field',
                                        render: (text, record, index) => {
                                            let { enitable } = this.state.groupFieldsList[index];
                                            return (
                                                enitable ?
                                                <Select showSearch optionFilterProp="children" notFoundContent='Not Found' filterOption={ (input, option) => {
                                                    return option.props.value.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                                }} value={text} onChange={(value) => {
                                                    //TODO
                                                    let data = this.replaceFunc(this.state.groupFieldsList, index, 'field', value)
                                                    this.setState({ groupFieldsList: [ ...data ] })
                                                }}>
                                                    {
                                                        this.state.__groupFieldProps.length > 0 ? this.state.__groupFieldProps.map( (field, index) => {
                                                            return <Option key={index} value={field}>{field}</Option>
                                                        }) : []
                                                    }
                                                </Select>
                                                :
                                                text
                                            )
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_fieldsComposition_compose']}/>,
                                        dataIndex: 'compose',
                                        key: 'compose',
                                        render: (text, record, index) => {
                                            let { enitable } = this.state.groupFieldsList[index];
                                            return (
                                                enitable ?
                                                <div className={styles.composeContainer}>
                                                    <Input value={text} onChange={(e) => {
                                                        //TODO
                                                        let data = this.replaceFunc(this.state.groupFieldsList, index, 'compose', e.target.value)
                                                        this.setState({ groupFieldsList: [ ...data ] })
                                                    }} />
                                                    <Popover placement='bottomRight' overlayClassName={styles.popover} onClick={this.clickComposeByField} trigger="click" content={
                                                        <div className={styles.popoverMain}>
                                                            {
                                                                this.state.__groupComposeProps.length > 0 ? this.state.__groupComposeProps.map( (field, itemIndex) => {
                                                                    if (this.state.groupFieldsList[index]['compose'] !== undefined && this.state.groupFieldsList[index]['compose'].match(/\$\{\w*\}/g) !== null 
                                                                        && this.state.groupFieldsList[index]['compose'].match(/\$\{\w*\}/g).includes(`$\{${field}\}`)) {
                                                                            return <span className={styles.selected} key={itemIndex} data-content={field} onClick={ (e) => {
                                                                                e.stopPropagation();
                                                                                let value = this.state.groupFieldsList[index]['compose'].replace(`$\{${e.target.getAttribute('data-content')}\}`, '');
                                                                                //TODO
                                                                                let data = this.replaceFunc(this.state.groupFieldsList, index, 'compose', value)
                                                                                this.setState({ groupFieldsList: [ ...data ] })
                                                                            }}>{field}</span>
                                                                    }
                                                                    return <span key={itemIndex} data-content={field} onClick={ (e) => {
                                                                        e.stopPropagation();
                                                                        let value = `$\{${e.target.getAttribute('data-content')}\}`;
                                                                        if (this.state.groupFieldsList[index]['compose'] !== undefined )
                                                                            value = this.state.groupFieldsList[index]['compose'] + `$\{${e.target.getAttribute('data-content')}\}`;
                                                                        //TODO
                                                                        let data = this.replaceFunc(this.state.groupFieldsList, index, 'compose', value)
                                                                        this.setState({ groupFieldsList: [ ...data ] })
                                                                    }}>{field}</span>
                                                                }) : <span className={styles.noData}>{formatMessage({...localeMessage['rule_noSelectField']})}</span>
                                                            }
                                                        </div>
                                                    } >
                                                        <i className={classnames(styles.composeIcon, composeClass)}></i>
                                                    </Popover>
                                                </div>
                                                :
                                                <span title={text}>{text}</span>
                                            )
                                        }
                                    },
                                    {
                                        title: <FormattedMessage {...localeMessage['rule_action']}/>,
                                        width: '135px',
                                        key: 'operation',
                                        render: (text, record, index) => {
                                            let { compose, field, enitable } = this.state.groupFieldsList[index];
                                            return (
                                                <span>
                                                    {
                                                        enitable ?
                                                        <Button size='small' disabled={ field === undefined || compose === undefined || compose === ''} className={styles.editBtn} onClick={ () => {
                                                            //TODO
                                                            this.addComposeField(this.state.groupFieldsList, index, 'enitable', undefined)
                                                        }}>{formatMessage({...localeMessage['rule_action_save']})}</Button>
                                                        :
                                                        <Button size='small' className={styles.editBtn} onClick={ () => {
                                                            //TODO
                                                            this.editComposeField(this.state.groupFieldsList, index, 'enitable', true)
                                                        }}>{formatMessage({...localeMessage['rule_action_edit']})}</Button>
                                                    }
                                                    &nbsp;&nbsp;
                                                    <Button size='small' className={styles.delBtn} onClick={ () => {
                                                        //TODO
                                                        this.deleComposeField(this.state.groupFieldsList, index)
                                                    }}>{formatMessage({...localeMessage['rule_action_delete']})}</Button>
                                                </span>
                                            )
                                        }
                                    }
                                ]}
                                pagination={false}
                                dataSource={this.state.groupFieldsList}
                            />
                            <div className={styles.addBtn}>
                                <Button type="primary" className={styles.appBtn} onClick={ () => {
                                    //TODO
                                    this.setState({
                                        groupFieldsList: [
                                            ...this.state.groupFieldsList,
                                            {'field': undefined, 'compose': undefined, 'enitable': true}
                                        ]
                                    })
                                }}><span>{formatMessage({...localeMessage['rule_addRow']})}</span></Button>
                            </div>
                        </Item>
                        <Item
                            {...itemLayout}
                            label={formatMessage({...localeMessage['rule_mergeKeys']})}
                            wrapperCol={{span: 18}}
                        >
                            <div className={styles.mergeInput}>
                                {getFieldDecorator('mergeKey', {})(
                                    <div className={styles.composeContainer}>
                                        <Input value={this.state.mergeKey} placeholder='$entity_name,$name' onChange={(e) => {
                                            //TODO
                                            this.setState({ mergeKey: e.target.value })
                                        }} />
                                        <Popover placement='bottomRight' overlayClassName={styles.popover} onClick={ this.clickCompose } trigger="click" content={
                                            <div className={styles.popoverMain}>
                                                {
                                                    this.state.__mergeProps.length > 0 ? this.state.__mergeProps.map( (field, itemIndex) => {
                                                        if (this.state.mergeKey !== '' && this.state.mergeKey.match(/\$\{\w*\}/g) !== null && this.state.mergeKey.match(/\$\{\w*\}/g).includes(`$\{${field}\}`)) {
                                                            return <span className={styles.selected} key={itemIndex} data-content={field} onClick={ (e) => {
                                                                //TODO
                                                                e.stopPropagation();
                                                                let value = this.state.mergeKey.replace(`$\{${e.target.getAttribute('data-content')}\}`, '');
                                                                this.setState({ mergeKey: value })
                                                            }}>{field}</span>
                                                        }
                                                        return <span key={itemIndex} data-content={field} onClick={ (e) => {
                                                            //TODO
                                                            e.stopPropagation();
                                                            let value = `$\{${e.target.getAttribute('data-content')}\}`;
                                                            if (this.state.mergeKey !== '' )
                                                                value = this.state.mergeKey + `$\{${e.target.getAttribute('data-content')}\}`;
                                                            this.setState({ mergeKey: value })
                                                        }}>{field}</span>
                                                    }) : <span className={styles.noData}>{formatMessage({...localeMessage['rule_noSelectField']})}</span>
                                                }
                                            </div>
                                        } >
                                            <i className={classnames(styles.composeIcon, composeClass)}></i>
                                        </Popover>
                                    </div>
                                )}
                            </div>
                            <span className={styles.mergeMessage}>{formatMessage({...localeMessage['rule_mergeKeys_message']})}</span>
                        </Item>
                        <Item
                            {...itemLayout}
                            label={formatMessage({...localeMessage['rule_bindCMDB']})}
                            hasFeedback
                            help={isFieldValidating('classCode') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('classCode') || []).join(', ')}
                        >
                            {getFieldDecorator('classCode', {
                                rules: [
                                    { required: true, message: formatMessage({...localeMessage['rule_bindCMDB_placeholder']}) }
                                ]
                            })(
                                <Select placeholder={formatMessage({...localeMessage['rule_bindCMDB_placeholder']})}>
                                    {
                                        snmpTrapRules.CMDBClass.length > 0 ? snmpTrapRules.CMDBClass.map( (item, index) => {
                                            return <Option key={index} value={item.code}>{item.name}</Option>
                                        }) : []
                                    }
                                </Select>
                            )}
                        </Item>
                        {
                            this.state.dataSource == 1 ?
                            <Item
                                {...itemLayout}
                                label={formatMessage({...localeMessage['rule_severityMapper_severity']})}
                                hasFeedback
                                help={isFieldValidating('severity') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('severity') || []).join(', ')}
                            >
                                {getFieldDecorator('severity', {
                                    rules: [
                                        { required: true, message: formatMessage({...localeMessage['rule_severityMapper_placeholder']}) }
                                    ]
                                })(
                                    <Select placeholder={formatMessage({...localeMessage['rule_severityMapper_placeholder']})}>
                                        <Option value="0">{window['_severity']['0']}</Option>
                                        <Option value="1">{window['_severity']['1']}</Option>
                                        <Option value="2">{window['_severity']['2']}</Option>
                                        <Option value="3">{window['_severity']['3']}</Option>
                                    </Select>
                                )}
                            </Item>
                            :
                            <Item
                                {...itemLayout}
                                wrapperCol={{span: 20}}
                                label={formatMessage({...localeMessage['rule_severityMapper']})}
                            >
                                <Table 
                                    className={styles.modalTable}
                                    columns={[
                                        {
                                            title: <FormattedMessage {...localeMessage['rule_severityMapper_trap']}/>,
                                            dataIndex: 'trap',
                                            key: 'trap',
                                            render: (text, record, index) => {
                                                let { trap, enitable } = this.state.levelList[index];
                                                return (
                                                    enitable ?
                                                    <Input value={text} onChange={(e) => {
                                                        //TODO
                                                        let data = this.replaceFunc(this.state.levelList, index, 'trap', e.target.value)
                                                        this.setState({ levelList: [ ...data ] })
                                                    }} />
                                                    :
                                                    <span title={text}>{text}</span>
                                                )
                                            }
                                        },
                                        {
                                            title: <FormattedMessage {...localeMessage['rule_expression']}/>,
                                            key: 'expression',
                                            render: (text, record, index) => {
                                                return <span className={styles.expression}>=</span>
                                            }
                                        },
                                        {
                                            title: <FormattedMessage {...localeMessage['rule_severityMapper_alert']}/>,
                                            dataIndex: 'severity',
                                            key: 'severity',
                                            render: (text, record, index) => {
                                                let { severity, enitable } = this.state.levelList[index];
                                                return (
                                                    enitable ?
                                                    <Select notFoundContent='Not Found' value={text} onChange={(value) => {
                                                        //TODO
                                                        let data = this.replaceFunc(this.state.levelList, index, 'severity', value)
                                                        this.setState({ levelList: [ ...data ] })
                                                    }}>
                                                        <Option value="0">{window['_severity']['0']}</Option>
                                                        <Option value="1">{window['_severity']['1']}</Option>
                                                        <Option value="2">{window['_severity']['2']}</Option>
                                                        <Option value="3">{window['_severity']['3']}</Option>
                                                    </Select>
                                                    :
                                                    text
                                                )
                                            }
                                        },
                                        {
                                            title: <FormattedMessage {...localeMessage['rule_action']}/>,
                                            width: '135px',
                                            key: 'operation',
                                            render: (text, record, index) => {
                                                let { trap, severity, enitable } = this.state.levelList[index];
                                                return (
                                                    <span>
                                                        {
                                                            enitable ?
                                                            <Button size='small' disabled={ trap === undefined || trap === '' || severity === undefined } className={styles.editBtn} onClick={ () => {
                                                                //TODO
                                                                let data = this.replaceFunc(this.state.levelList, index, 'enitable', undefined)
                                                                this.setState({ levelList: [ ...data ] })
                                                            }}>{formatMessage({...localeMessage['rule_action_save']})}</Button>
                                                            :
                                                            <Button size='small' className={styles.editBtn} onClick={ () => {
                                                                //TODO
                                                                let data = this.replaceFunc(this.state.levelList, index, 'enitable', true)
                                                                this.setState({ levelList: [ ...data ] })
                                                            }}>{formatMessage({...localeMessage['rule_action_edit']})}</Button>
                                                        }
                                                        &nbsp;&nbsp;
                                                        <Button size='small' className={styles.delBtn} onClick={ () => {
                                                            //TODO
                                                            let data = this.state.levelList.filter( (level, itenIndex) => itenIndex !== index )
                                                            this.setState({ levelList: [ ...data ] })
                                                        }}>{formatMessage({...localeMessage['rule_action_delete']})}</Button>
                                                    </span>
                                                )
                                            }
                                        }
                                    ]}
                                    pagination={false}
                                    dataSource={this.state.levelList}
                                />
                                <span className={styles.alertMessage}>{formatMessage({...localeMessage['rule_severityMapper_message']})}</span>
                                <div className={styles.addBtn}>
                                    <Button type="primary" className={styles.appBtn} onClick={ () => {
                                        //TODO
                                        this.setState({
                                            levelList: [
                                                ...this.state.levelList,
                                                {'trap': undefined, 'severity': undefined, 'enitable': true}
                                            ]
                                        })
                                    }}><span>{formatMessage({...localeMessage['rule_addRow']})}</span></Button>
                                </div>
                            </Item>
                        }
                    </Form>
                </div>
            </Modal>
        )
    }
}

ruleModal.defaultProps = {
    
}

ruleModal.propTypes = {

}

export default injectIntl(Form.create({
    mapPropsToFields: (props) => {
        return {
            ruleName: {
                value: props.snmpTrapRules.operateAppRules.name || undefined
            },
            description: {
                value: props.snmpTrapRules.operateAppRules.description || undefined
            },
            severity: {
                value: typeof props.snmpTrapRules.operateAppRules.severity !== 'undefined' ? `${props.snmpTrapRules.operateAppRules.severity}` : undefined
            },
            classCode: {
                value: typeof props.snmpTrapRules.operateAppRules.classCode !== 'undefined' ? `${props.snmpTrapRules.operateAppRules.classCode}` : undefined
            }
        }
    }
})(ruleModal))