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
            __groupComposeProps: [],
            __mergeProps: [],
        }
        this.replaceFunc = this.replaceFunc.bind(this)
        this.addFieldMapper = this.addFieldMapper.bind(this)
        this.enitFieldMapper = this.enitFieldMapper.bind(this)
        this.deleFieldMapper = this.deleFieldMapper.bind(this)
        this.addComposeField = this.addComposeField.bind(this)
        this.editComposeField = this.editComposeField.bind(this)
        this.deleComposeField = this.deleComposeField.bind(this)
        this.clickCompose = this.clickCompose.bind(this)
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
            if (field['enitable'] === undefined && field['mapper'] !== undefined)
                !__newMergeProps.includes(field['mapper']) && __newMergeProps.push(field['mapper'])
        })
        this.state.properties.forEach( (field) => {
            if (field['enitable'] === undefined && field['code'] !== undefined && field['code'] !== '')
                !__newMergeProps.includes(field['code']) && __newMergeProps.push(field['code'])
        })
        this.state.groupFieldsList.forEach( (field) => {
            if (field['enitable'] === undefined  && field['field'] !== undefined)
                !__newMergeProps.includes(field['field']) && __newMergeProps.push(field['field'])
        })
        this.setState({ __mergeProps: [...__newMergeProps]})
    }

    // 在增加映射字段时 --> 减少字段组合中的可选字段，增加组合的可选项目
    addFieldMapper(data, targetIndex, key, targetValue) {
        //TODO
        let newMatchFields = []
        let __newMatchProps = []
        let __newGroupComposeProps = []
        
        data.forEach( (item, itemIndex) => {
            if (targetIndex === itemIndex) {
                item[key] = targetValue 
            }
            !__newGroupComposeProps.includes(item['mapper']) && __newGroupComposeProps.push(item['mapper'])

            // 重复的置为undefined
            if (item['enitable'] && item['mapper'] === data[targetIndex]['mapper']) {
                item['mapper'] = undefined
            }
            newMatchFields.push(item)
        })
        
        this.state.__matchProps.forEach( (child) => {
            if (data[targetIndex]['mapper'] !== child) { __newMatchProps.push(child) }
        })
        this.setState({ matchFields: [ ...newMatchFields ], __matchProps: __newMatchProps, __groupComposeProps: __newGroupComposeProps })
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
        let __newGroupComposeProps = []
        
        let newMatchFields = data.filter( (item, itemIndex) => {
            if (itemIndex !== targetIndex) {
                !__newGroupComposeProps.includes(item['mapper']) && __newGroupComposeProps.push(item['mapper']);
            }
            if (itemIndex === targetIndex && item['enitable'] === undefined) {
                if ( item['mapper'] !== undefined) { __newMatchProps.unshift(item['mapper'])}
            }
            return itemIndex !== targetIndex 
        })

        this.setState({ matchFields: [ ...newMatchFields ], __matchProps: __newMatchProps, __groupComposeProps: __newGroupComposeProps })
    }

    // 在编辑字段组合时 --> 将内容补到__matchProps中
    editComposeField(data, targetIndex, key, targetValue) {
        //TODO
        let newGroupFieldsList = []
        let __newMatchProps = [].concat(this.state.__matchProps)
        data.forEach( (item, itemIndex) => {
            if (targetIndex === itemIndex) {
                item[key] = targetValue 
            }
            newGroupFieldsList.push(item)
        })
        if (data[targetIndex]['field'] !== undefined && !__newMatchProps.includes(data[targetIndex]['field'])) { 
            __newMatchProps.push(data[targetIndex]['field']) 
        }

        this.setState({ groupFieldsList: [ ...newGroupFieldsList ], __matchProps: __newMatchProps })
    }

    // 在新增字段组合时 --> 除掉已经选择的
    addComposeField(data, targetIndex, key, targetValue) {
        //TODO
        let __newMatchProps = []
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
        
        this.state.__matchProps.forEach( (child) => {
            if (data[targetIndex]['field'] !== child) { __newMatchProps.push(child) }
        })
        this.setState({ groupFieldsList: [ ...newGroupFieldsList ], __matchProps: __newMatchProps })
    }

    // 在删除字段组合时 --> 补全删除的
    deleComposeField(data, targetIndex) {
        let __newMatchProps = [].concat(this.state.__matchProps)
        let newGroupFieldsList = data.filter( (item, itemIndex) => {
            if (itemIndex === targetIndex && item['enitable'] === undefined) {
                if ( item['field'] !== undefined) { __newMatchProps.unshift(item['field'])}
            }
            return itemIndex !== targetIndex 
        })

        this.setState({ groupFieldsList: [ ...newGroupFieldsList ], __matchProps: __newMatchProps })
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
                        <Option value={'3'}>精确匹配</Option>
                        <Option value={'2'}>模糊匹配</Option>
                        <Option value={'4'}>范围</Option>
                        <Option value={'1'}>正则表达式</Option>
                    </Select>
                    <Input value={filter.value} onChange={ (e) => {
                        //TODO
                        let data = this.replaceFunc(this.state.filterFields, index, 'value', e.target.value)
                        this.setState({ filterFields: [ ...data ] })
                    }}/>
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
                            label={'数据源'}
                        >
                            <RadioGroup onChange={(e) => {
                                this.setState({ dataSource: e.target.value })
                            }} value={this.state.dataSource}>
                                <Radio value={1}>网络设备</Radio>
                                <Radio value={2}>第三方监控系统</Radio>
                            </RadioGroup>
                        </Item>
                        <div className={styles.paramBlock}>
                            <span>过滤条件:</span>
                            <ul>
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
                                }}><span>添加条件</span></Button>
                            </div>
                        </div>
                        <div className={styles.paramBlock}>
                            <span>字段匹配:</span>
                            <Table 
                                className={styles.modalTable}
                                columns={[
                                    {
                                        title: 'OID',
                                        dataIndex: 'OID',
                                        key: 'OID',
                                        render: (text, record, index) => {
                                            let { OID, enitable } = this.state.matchFields[index];
                                            return (
                                                enitable ?
                                                <Input value={text} onChange={(e) => {
                                                    //TODO
                                                    let data = this.replaceFunc(this.state.matchFields, index, 'OID', e.target.value)
                                                    this.setState({ matchFields: [ ...data ] })
                                                }} />
                                                :
                                                text
                                            )
                                        }
                                    },
                                    {
                                        title: '表达式',
                                        key: 'expression',
                                        render: (text, record, index) => {
                                            return <span className={styles.expression}>=</span>
                                        }
                                    },
                                    {
                                        title: '字段映射',
                                        width: '150px',
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
                                        title: '操作',
                                        width: '125px',
                                        key: 'operation',
                                        render: (text, record, index) => {
                                            let { OID, mapper, enitable } = this.state.matchFields[index];
                                            return (
                                                <span>
                                                    {
                                                        enitable ?
                                                        <Button size='small' disabled={ OID === undefined || OID === '' || mapper === undefined } className={styles.editBtn} onClick={ () => {
                                                            this.addFieldMapper(this.state.matchFields, index, 'enitable', undefined)
                                                        }}>保存</Button>
                                                        :
                                                        <Button size='small' className={styles.editBtn} onClick={ () => {
                                                            //TODO
                                                            this.enitFieldMapper(this.state.matchFields, index, 'enitable', true)
                                                        }}>编辑</Button>
                                                    }
                                                    &nbsp;&nbsp;
                                                    <Button size='small' className={styles.delBtn} onClick={ () => {
                                                        //TODO
                                                        this.deleFieldMapper(this.state.matchFields, index)
                                                    }}>删除</Button>
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
                                }}><span>添加行</span></Button>
                            </div>
                        </div>
                        <div className={styles.paramBlock}>
                            <span>字段扩展:</span>
                            <Table 
                                className={styles.modalTable}
                                columns={[
                                    {
                                        title: 'OID',
                                        dataIndex: 'oid',
                                        key: 'oid',
                                        render: (text, record, index) => {
                                            let { oid, enitable } = this.state.properties[index];
                                            return (
                                                enitable ?
                                                <Input value={text} onChange={(e) => {
                                                    //TODO
                                                    let data = this.replaceFunc(this.state.properties, index, 'oid', e.target.value)
                                                    this.setState({ properties: [ ...data ] })
                                                }} />
                                                :
                                                text
                                            )
                                        }
                                    },
                                    {
                                        title: '表达式',
                                        width: '70px',
                                        key: 'expression',
                                        render: (text, record, index) => {
                                            return <span className={styles.expression}>=</span>
                                        }
                                    },
                                    {
                                        title: '新字段名',
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
                                                text
                                            )
                                        }
                                    },
                                    {
                                        title: '显示名',
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
                                                text
                                            )
                                        }
                                    },
                                    {
                                        title: '操作',
                                        width: '125px',
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
                                                        }}>保存</Button>
                                                        :
                                                        <Button size='small' className={styles.editBtn} onClick={ () => {
                                                            //TODO
                                                            let data = this.replaceFunc(this.state.properties, index, 'enitable', true)
                                                            this.setState({ properties: [ ...data ] })
                                                        }}>编辑</Button>
                                                    }
                                                    &nbsp;&nbsp;
                                                    <Button size='small' className={styles.delBtn} onClick={ () => {
                                                        //TODO
                                                        let data = this.state.properties.filter( (property, itenIndex) => itenIndex !== index )
                                                        this.setState({ properties: [ ...data ] })
                                                    }}>删除</Button>
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
                                }}><span>添加行</span></Button>
                            </div>
                        </div>
                        <div className={styles.paramBlock}>
                            <span>字段组合:</span>
                            <Table 
                                className={styles.modalTable}
                                columns={[
                                    {
                                        title: '字段',
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
                                        title: '组合',
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
                                                    <Popover placement='bottomRight' overlayClassName={styles.popover} trigger="click" content={
                                                        <div className={styles.popoverMain}>
                                                            {
                                                                this.state.__groupComposeProps.length > 0 ? this.state.__groupComposeProps.map( (field, itemIndex) => {
                                                                    if (this.state.groupFieldsList[index]['compose'] !== undefined && this.state.groupFieldsList[index]['compose'].split('$').includes(field)) {
                                                                        return <span className={styles.selected} key={itemIndex} data-content={field} onClick={ (e) => {
                                                                            e.stopPropagation();
                                                                            let value = this.state.groupFieldsList[index]['compose'].replace(`$${e.target.getAttribute('data-content')}`, '');
                                                                            //TODO
                                                                            let data = this.replaceFunc(this.state.groupFieldsList, index, 'compose', value)
                                                                            this.setState({ groupFieldsList: [ ...data ] })
                                                                        }}>{field}</span>
                                                                    }
                                                                    return <span key={itemIndex} data-content={field} onClick={ (e) => {
                                                                        e.stopPropagation();
                                                                        let value = `$${e.target.getAttribute('data-content')}`;
                                                                        if (this.state.groupFieldsList[index]['compose'] !== undefined )
                                                                            value = this.state.groupFieldsList[index]['compose'] + `$${e.target.getAttribute('data-content')}`;
                                                                        //TODO
                                                                        let data = this.replaceFunc(this.state.groupFieldsList, index, 'compose', value)
                                                                        this.setState({ groupFieldsList: [ ...data ] })
                                                                    }}>{field}</span>
                                                                }) : <span className={styles.noData}>没有可选字段</span>
                                                            }
                                                        </div>
                                                    } >
                                                        <i className={classnames(styles.composeIcon, shanchuClass)}></i>
                                                    </Popover>
                                                </div>
                                                :
                                                text
                                            )
                                        }
                                    },
                                    {
                                        title: '操作',
                                        width: '125px',
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
                                                        }}>保存</Button>
                                                        :
                                                        <Button size='small' className={styles.editBtn} onClick={ () => {
                                                            //TODO
                                                            this.editComposeField(this.state.groupFieldsList, index, 'enitable', true)
                                                        }}>编辑</Button>
                                                    }
                                                    &nbsp;&nbsp;
                                                    <Button size='small' className={styles.delBtn} onClick={ () => {
                                                        //TODO
                                                        this.deleComposeField(this.state.groupFieldsList, index)
                                                    }}>删除</Button>
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
                                }}><span>添加行</span></Button>
                            </div>
                        </div>
                        <Item
                            {...itemLayout}
                            label='合并原则'
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
                                                        if (this.state.mergeKey !== '' && this.state.mergeKey.split('$').includes(field)) {
                                                            return <span className={styles.selected} key={itemIndex} data-content={field} onClick={ (e) => {
                                                                //TODO
                                                                e.stopPropagation();
                                                                let value = this.state.mergeKey.replace(`$${e.target.getAttribute('data-content')}`, '');
                                                                this.setState({ mergeKey: value })
                                                            }}>{field}</span>
                                                        }
                                                        return <span key={itemIndex} data-content={field} onClick={ (e) => {
                                                            //TODO
                                                            e.stopPropagation();
                                                            let value = `$${e.target.getAttribute('data-content')}`;
                                                            if (this.state.mergeKey !== '' )
                                                                value = this.state.mergeKey + `$${e.target.getAttribute('data-content')}`;
                                                            this.setState({ mergeKey: value })
                                                        }}>{field}</span>
                                                    }) : <span className={styles.noData}>没有可选字段</span>
                                                }
                                            </div>
                                        } >
                                            <i className={classnames(styles.composeIcon, shanchuClass)}></i>
                                        </Popover>
                                    </div>
                                )}
                            </div>
                            <span className={styles.mergeMessage}>指定合并告警的关键字段</span>
                        </Item>
                        <Item
                            {...itemLayout}
                            label='绑定CMDB类'
                            hasFeedback
                            help={isFieldValidating('classCode') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('classCode') || []).join(', ')}
                        >
                            {getFieldDecorator('classCode', {
                                rules: [
                                    { required: true, message: '请选择需要绑定CMDB类' }
                                ]
                            })(
                                <Select placeholder={'请选择需要绑定CMDB类'}>
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
                                label='告警等级'
                                hasFeedback
                                help={isFieldValidating('severity') ? formatMessage({...localeMessage['modal_validating']}) : (getFieldError('severity') || []).join(', ')}
                            >
                                {getFieldDecorator('severity', {
                                    rules: [
                                        { required: true, message: '请输入告警等级' }
                                    ]
                                })(
                                    <Select placeholder={'请输入告警等级'}>
                                        <Option value="0">{window['_severity']['0']}</Option>
                                        <Option value="1">{window['_severity']['1']}</Option>
                                        <Option value="2">{window['_severity']['2']}</Option>
                                        <Option value="3">{window['_severity']['3']}</Option>
                                    </Select>
                                )}
                            </Item>
                            :
                            <div className={styles.paramBlock}>
                                <span>级别映射:</span>
                                <Table 
                                    className={styles.modalTable}
                                    columns={[
                                        {
                                            title: 'Trap级别',
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
                                                    text
                                                )
                                            }
                                        },
                                        {
                                            title: '表达式',
                                            key: 'expression',
                                            render: (text, record, index) => {
                                                return <span className={styles.expression}>=</span>
                                            }
                                        },
                                        {
                                            title: 'Alert级别',
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
                                            title: '操作',
                                            width: '125px',
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
                                                            }}>保存</Button>
                                                            :
                                                            <Button size='small' className={styles.editBtn} onClick={ () => {
                                                                //TODO
                                                                let data = this.replaceFunc(this.state.levelList, index, 'enitable', true)
                                                                this.setState({ levelList: [ ...data ] })
                                                            }}>编辑</Button>
                                                        }
                                                        &nbsp;&nbsp;
                                                        <Button size='small' className={styles.delBtn} onClick={ () => {
                                                            //TODO
                                                            let data = this.state.levelList.filter( (level, itenIndex) => itenIndex !== index )
                                                            this.setState({ levelList: [ ...data ] })
                                                        }}>删除</Button>
                                                    </span>
                                                )
                                            }
                                        }
                                    ]}
                                    pagination={false}
                                    dataSource={this.state.levelList}
                                />
                                <span className={styles.alertMessage}>Alert级别定义：紧急 - 3，警告 - 2，提醒 - 1，正常 - 0</span>
                                <div className={styles.addBtn}>
                                    <Button type="primary" className={styles.appBtn} onClick={ () => {
                                        //TODO
                                        this.setState({
                                            levelList: [
                                                ...this.state.levelList,
                                                {'trap': undefined, 'severity': undefined, 'enitable': true}
                                            ]
                                        })
                                    }}><span>添加行</span></Button>
                                </div>
                            </div>
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