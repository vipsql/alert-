import React, { PropTypes, Component } from 'react'
import { Select, Popover, Checkbox, Dropdown, Menu, Button } from 'antd';
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../../utils'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const Option = Select.Option;
const DropdownButton = Dropdown.Button;
const alertOperation = ({position, 
    columnList, 
    selectGroup, 
    extendColumnList, 
    checkCloumFunc, 
    relieveFunc, 
    dispatchFunc, 
    closeFunc, 
    mergeFunc, 
    groupFunc, 
    noGroupFunc,
    showChatOpsFunc,
    dispatchDisabled,
    closeDisabled,
    intl: {formatMessage} }) => {

    const localeMessage = defineMessages({
        operate_dispatch: {
            id: 'alertOperate.dispatch',
            defaultMessage: '派发工单'
        },
        operate_close: {
            id: 'alertOperate.close',
            defaultMessage: '关闭告警'
        },
        operate_merge: {
            id: 'alertOperate.merge',
            defaultMessage: '合并告警'
        },
        operate_relieve: {
            id: 'alertOperate.relieve',
            defaultMessage: '解除告警'
        },
        entityName:{
            id: 'alertList.title.enityName',
            defaultMessage: '对象',
        },
        name: {
            id: 'alertList.title.name',
            defaultMessage: '告警名称',
        },
        source: {
            id: 'alertList.title.source',
            defaultMessage: '告警来源',
        },
        status:{
            id: 'alertList.title.status',
            defaultMessage: '告警状态',
        },
        description:{
            id: 'alertList.title.description',
            defaultMessage: '告警描述',
        },
        count:{
            id: 'alertList.title.count',
            defaultMessage: '次数',
        },
        lastTime:{
            id: 'alertList.title.lastTime',
            defaultMessage: '持续时间',
        },
        lastOccurTime:{
            id: 'alertList.title.lastOccurTime',
            defaultMessage: '最后发送时间',
        },
        basic: {
            id: 'alertList.title.basic',
            defaultMessage: '常规',
        },
        additional: {
            id: 'alertList.title.additional',
            defaultMessage: '扩展',
        },
        moreOperate: {
            id: 'alertOperate.moreAcitons',
            defaultMessage: '更多操作',
        },
        chatOps: {
            id: 'alertOperate.shareChatOps',
            defaultMessage: '分享到ChatOps',
        },
        columns: {
            id: 'alertOperate.columns',
            defaultMessage: '列定制',
        },
        groupBy: {
            id: 'alertOperate.groupBy',
            defaultMessage: '分组显示',
        },
        groupByEnityName: {
            id: 'alertOperate.groupByEnityName',
            defaultMessage: '按对象分组',
        },
        groupBySource: {
            id: 'alertOperate.groupBySource',
            defaultMessage: '按来源分组',
        },
        groupByStatus: {
            id: 'alertOperate.groupByStatus',
            defaultMessage: '按状态分组',
        },
        groupByOther: {
            id: 'alertOperate.groupByOther',
            defaultMessage: '按{other}分组',
        }
    })

    const setClass = classnames(
        'icon',
        'iconfont',
        'icon-bushu'
    )

    // <Select className={styles.selectSingle} defaultValue="0">
    //     <Option value="0">抑制告警</Option>
    //     <Option value="1">5分钟内不再提醒</Option>
    //     <Option value="2">10分钟内不再提醒</Option>
    //     <Option value="3">半小时内不再提醒</Option>
    // </Select>

    const switchClass = classnames(
        'icon',
        'iconfont',
        'icon-anonymous-iconfont'
    )

    const popoverContent = position === 'list' ?
            <div className={styles.popoverMain}>
                {
                    columnList.map( (group, index) => {
                        return (
                            <div key={index} className={styles.colGroup}>
                                <p>{group.type == 0 ? <FormattedMessage {...localeMessage['basic']} /> : <FormattedMessage {...localeMessage['additional']} />}</p>
                                {
                                    group.cols.map( (item, index) => {
                                        if (item.id === 'entityName' || item.id === 'name') {
                                            return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={true} disabled={true} >
                                                    { item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}
                                                   </Checkbox></div>
                                        } else {
                                            return <div key={index} className={styles.inlineItem}><Checkbox value={item.id} checked={item.checked} onChange={ (e) => {
                                                checkCloumFunc(e)
                                            }}>{ item.name === undefined ? <FormattedMessage {...localeMessage[item.id]} /> : item.name}</Checkbox></div>
                                        }
                                    })
                                }
                            </div>
                        )
                    })
                }
            </div>
            :
            undefined
    const menu = (
        <Menu onClick={ relieveFunc }>
            <Menu.Item key="1" className={styles.menuItem}><FormattedMessage {...localeMessage['operate_relieve']} /></Menu.Item>
        </Menu>
    )
    return (
        <div className={styles.operateMain}>
            <Button className={styles.myButton} disabled={dispatchDisabled} onClick={ () => {
                dispatchFunc(position)
            } } ><FormattedMessage {...localeMessage['operate_dispatch']} /></Button>
            <Button className={styles.myButton} disabled={closeDisabled} onClick={ () => {
                closeFunc(position)
            }} ><FormattedMessage {...localeMessage['operate_close']} /></Button>
            {
                position !== 'detail' ?
                <DropdownButton overlay={menu} className={styles.myDropdown} trigger={['click']} onClick={ mergeFunc }>
                    <FormattedMessage {...localeMessage['operate_merge']} />
                </DropdownButton>
                :
                undefined
            }
            <Select className={styles.showChatOps} allowClear placeholder={formatMessage({...localeMessage['moreOperate']})} onChange={ (operate) => {
                switch (operate) {
                    case 'ChatOps':
                        showChatOpsFunc(position)
                    break;
                    default:
                        () => {}
                    break;
                }
            }}>
                <Option value="ChatOps"><FormattedMessage {...localeMessage['chatOps']} /></Option>
            </Select>
            {
                position !== 'detail' ?
                <div className={styles.groupMain}>
                    <Select className={classnames(styles.setGroup, styles.selectSingle)} placeholder={formatMessage({...localeMessage['groupBy']})} value={selectGroup} onChange={ (value) => {
                        groupFunc(value)
                    }}>
                        <Option key={0} className={styles.menuItem} value="entityName"><FormattedMessage {...localeMessage['groupByEnityName']} /></Option>
                        <Option key={1} className={styles.menuItem} value="source"><FormattedMessage {...localeMessage['groupBySource']} /></Option>
                        <Option key={2} className={styles.menuItem} value="status"><FormattedMessage {...localeMessage['groupByStatus']} /></Option>
                        {
                            extendColumnList.length > 0 ? extendColumnList.map( (col, index) => {
                                return <Option key={index + 3} className={styles.menuItem} value={col.id}><FormattedMessage {...localeMessage['groupByOther']} values={{other: col.name}}/></Option>
                            }) : []
                        }
                    </Select>
                    <i className={selectGroup !== window['_groupBy'] && classnames(switchClass, styles.switch)} onClick={noGroupFunc}></i>
                </div>
                :
                undefined
            }
            { position === 'list' 
                ? <Popover placement='bottomRight' trigger="click" content={popoverContent} >
                    <div className={classnames(styles.button, styles.rightBtn)}>
                        <i className={classnames(setClass, styles.setCol)}></i>
                        <p className={styles.col}> <FormattedMessage {...localeMessage['columns']} /></p>
                    </div>
                  </Popover>
                : undefined
            }
        </div>
    )
}

alertOperation.defaultProps = {
    position: 'list',
    columnList: [],
    selectGroup: '',
    extendColumnList: [],
    checkCloumFunc: () => {},
    relieveFunc: () => {},
    dispatchFunc: () => {},
    closeFunc: () => {},
    mergeFunc: () => {},
    groupFunc: () => {},
    noGroupFunc: () => {},
    showChatOpsFunc: () => {},
    dispatchDisabled: false,
    closeDisabled: false,
}

alertOperation.propTypes = {
    position: React.PropTypes.oneOf(['list', 'timeAxis', 'detail']).isRequired,
    columnList: React.PropTypes.array,
}

export default injectIntl(alertOperation)