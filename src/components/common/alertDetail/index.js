import React, { PropTypes, Component } from 'react'
import { Button, Input, Form, Timeline } from 'antd';
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../../utils'
import AlertOperation from '../alertOperation/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';

const alertDetail = ({extraProps, operateProps, form, closeDeatilModal, clickTicketFlow, editForm, openForm, closeForm, openRemark, editRemark, closeRemark, intl: {formatMessage}}) => {

    const { currentAlertDetail, isShowOperateForm, operateForm, isShowRemark, operateRemark, ciUrl } = extraProps;
    const { getFieldDecorator, getFieldsValue } = form;
    const { incidentLog } = currentAlertDetail;

    // <div className={styles.infoBody}>
    //     <p className={styles.remarkTitle}>备注信息</p>
    //     <div className={styles.remark} onClick={openRemark}>
    //         <i className={classnames(styles.bianji, bianjiClass)}></i>
    //         <span>添加备注</span>
    //     </div>
    //     {
    //         isShowRemark ?
    //         <Form>
    //             <Form.Item>
    //                 {getFieldDecorator('remark', {
    //                     initialValue: operateRemark
    //                 })(
    //                     <Input type="textarea" placeholder="请输入备注信息" autosize={ true } />
    //                 )}
    //             </Form.Item>
    //             <div className={styles.remarkOperate}>
    //                 <Button type="primary" onClick={ () => {
    //                     const formData = form.getFieldsValue();
    //                     editRemark(formData)
    //                 }}>保存</Button>
    //                 &nbsp;
    //                 <Button type="ghost" onClick={ closeRemark }>取消</Button>
    //             </div>
    //         </Form>
    //         :
    //         undefined
    //     }
    // </div>

    // <i className={classnames(setClass, styles.stateClass)}></i>

    // <li><span>{formatMessage({...localeMessage['owner']})}:</span><span>{currentAlertDetail.responsiblePerson ? currentAlertDetail.responsiblePerson : formatMessage({...localeMessage['unknown']})}</span></li>
    // <li><span>{formatMessage({...localeMessage['department']})}:</span><span>{currentAlertDetail.responsibleDepartment ? currentAlertDetail.responsibleDepartment : formatMessage({...localeMessage['unknown']})}</span></li>
    
    const dateTransfer = (begin, end) => {
        let date = {};
        let beginTime = new Date(+begin);
        let endTime = new Date(+end);

        // date.continueTime = Math.round(((+end) - (+begin)) / 1000 / 60 / 60); // hours
        date.begin = beginTime.getFullYear() + '/' + (beginTime.getMonth() + 1) + '/' + beginTime.getDate() + ' ' + beginTime.getHours() + ':' + beginTime.getMinutes();
        date.end = endTime.getFullYear() + '/' + (endTime.getMonth() + 1) + '/' + endTime.getDate() + ' ' + endTime.getHours() + ':' + endTime.getMinutes();
        return date
    }

    const durationFunc = (duration) => {
        if(duration > 3600000){
            return (duration / 3600000).toFixed(1)     
        }else{
            return (duration / 60000).toFixed(1)
        }
    }
    // 目前只有完成，后期可根据状态改变class
    const setClass = classnames(
      'iconfont',
      'icon-wancheng'
    )

    const shanchuClass = classnames(
      'iconfont',
      'icon-shanchux'
    )

    const bianjiClass = classnames(
      'iconfont',
      'icon-yijianfankui'
    )

    // 根据severity选择不同的颜色
    const severityColor = currentAlertDetail.severity == 3 ? styles.jjLevel 
                            : currentAlertDetail.severity == 2 ? styles.gjLevel 
                                : currentAlertDetail.severity == 1 ? styles.txLevel 
                                    : currentAlertDetail.severity == 0 ? styles.hfLevel : false

    const localeMessage = defineMessages({
        unknown: {
            id: 'alertList.unknown',
            defaultMessage: '未知',
        },
        severity: {
            id: 'alertList.title.severity',
            defaultMessage: '告警级别',
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
        duration:{
            id: 'alertQuery.label.duration',
            defaultMessage: '持续时间',
        },
        firstOccurred:{
            id: 'alertList.title.firstOccurred',
            defaultMessage: '首次发生时间',
        },
        lastOccurTime:{
            id: 'alertList.title.lastOccurTime',
            defaultMessage: '最后发生时间',
        },
        basic: {
            id: 'alertDetail.basic',
            defaultMessage: '基本信息',
        },
        enrich: {
            id: 'alertDetail.enrich',
            defaultMessage: '丰富信息',
        },
        owner: {
            id: 'alertDetail.owner',
            defaultMessage: '负责人',
        },
        department: {
            id: 'alertDetail.department',
            defaultMessage: '负责部门',
        },
        hour: {
            id: 'alertDetail.hour',
            defaultMessage: '小时',
        },
        min: {
            id: 'alertDetail.min',
            defaultMessage: '分钟',
        },
        ticket: {
            id: 'alertDetail.ticket',
            defaultMessage: '工单',
        },
        edit: {
            id: 'alertDetail.edit',
            defaultMessage: '编辑',
        },
        save: {
            id: 'alertDetail.save',
            defaultMessage: '保存',
        },
        cancel: {
            id: 'alertDetail.cancel',
            defaultMessage: '取消',
        },
        text: {
            id: 'alertDetail.text',
            defaultMessage: '文本',
        },
        tags: {
            id: 'alertQuery.label.tags',
            defaultMessage: '标签',
        },
        ci: {
            id: 'alertDetail.ciInfo',
            defaultMessage: 'CI信息',
        },
        link:{
            id: 'alertDetail.link',
            defaultMessage: '链接',
        },
        ciDetail: {
            id: 'alertDetail.link.ciDetail',
            defaultMessage: '查看CI详情',
        },
        log: {
            id: 'alertOperate.log',
            defaultMessage: '审计日志'
        },
        remark: {
            id: 'alertDetail.remark',
            defaultMessage: '备注'
        },
        operator: {
            id: 'alertDetail.operator',
            defaultMessage: '处理人'
        },
        operateType: {
            10: {
                id: 'alertDetail.action.t10',
                defaultMessage: '新告警创建'
            },
            30: {
                id: 'alertDetail.action.t30',
                defaultMessage: '新告警创建'
            },
            50: {
                id: 'alertDetail.action.t50',
                defaultMessage: '新告警创建'
            },
            70: {
                id: 'alertDetail.action.t70',
                defaultMessage: '告警删除'
            },
            90: {
                id: 'alertDetail.action.t90',
                defaultMessage: '通知'
            },
            110: {
                id: 'alertDetail.action.t110',
                defaultMessage: 'chatOps群组'
            },
            130: {
                id: 'alertDetail.action.t130',
                defaultMessage: '派发工单'
            },
            150: {
                id: 'alertDetail.action.t150',
                defaultMessage: '派发cross工单'
            }
        }
    })

    const statusType = {
        1: window._status["0"],
        2: window._status["40"],
        3: window._status["150"],
        4: window._statue["190"],
        5: window._statue["255"]
    },

    return (
        <div className={styles.main}>
            <div className={styles.detailHead}>
                <p>{currentAlertDetail.name ? currentAlertDetail.name : formatMessage({...localeMessage['unknown']}) }</p>
                <i className={classnames(styles.shanChu, shanchuClass)} onClick={closeDeatilModal}></i>
                <AlertOperation position="detail" {...operateProps}/>
            </div>
            <div className={styles.detailBody}>
                <div className={styles.infoBody}>
                    <p>{formatMessage({...localeMessage['basic']})}</p>
                    <ul>
                        <li><span>{formatMessage({...localeMessage['status']})}:</span><span>{window['_status'][currentAlertDetail.status]}</span></li>
                        <li><span>{formatMessage({...localeMessage['severity']})}:</span><span className={severityColor}>{window['_severity'][currentAlertDetail.severity]}</span></li>
                        <li><span>{formatMessage({...localeMessage['source']})}:</span><span>{currentAlertDetail.source ? currentAlertDetail.source : formatMessage({...localeMessage['unknown']})}</span></li>
                        {
                            currentAlertDetail.tags !== null && currentAlertDetail.tags.length !== 0 ?
                            <li><span>{formatMessage({...localeMessage['tags']})}:</span>
                                {
                                    currentAlertDetail.tags.map( (tag, index) => {
                                        if (tag.key == 'severity' || tag.key == 'status') {
                                            return <span title={`${tag.keyName} : ` + window[`_${tag.key}`][tag.value]} key={index} className={styles.tag}>{`${tag.keyName} : ` + window[`_${tag.key}`][tag.value]}</span>
                                        } else if (tag.value == '') {
                                            return <span title={tag.keyName} key={index} className={styles.tag}>{tag.keyName}</span>
                                        } else {
                                            return <span title={`${tag.keyName} : ${tag.value}`} key={index} className={styles.tag}>{`${tag.keyName} : ${tag.value}`}</span>
                                        }
                                        
                                    })
                                }
                            </li>
                            :
                            <li><span>{formatMessage({...localeMessage['tags']})}:</span><span>{formatMessage({...localeMessage['unknown']})}</span></li>
                        }
                        <li><span>{formatMessage({...localeMessage['description']})}:</span><span>{currentAlertDetail.description ? currentAlertDetail.description : formatMessage({...localeMessage['unknown']})}</span></li>
                        <li><span>{formatMessage({...localeMessage['firstOccurred']})}:</span><span>{dateTransfer(currentAlertDetail.firstOccurTime, currentAlertDetail.lastOccurTime).begin}</span></li>
                        <li><span>{formatMessage({...localeMessage['lastOccurTime']})}:</span><span>{dateTransfer(currentAlertDetail.firstOccurTime, currentAlertDetail.lastOccurTime).end}</span></li>
                        <li><span>{formatMessage({...localeMessage['duration']})}:</span><span>{durationFunc(currentAlertDetail.lastTime)}&nbsp;{currentAlertDetail.lastTime  > 3600000 ? formatMessage({...localeMessage['hour']}) : formatMessage({...localeMessage['min']})}</span></li>
                        <li><span>{formatMessage({...localeMessage['count']})}:</span><span>{currentAlertDetail.count}</span></li>
                        <li className={styles.gongDan}>
                            <span>{formatMessage({...localeMessage['ticket']})}:</span>
                            {
                                !isShowOperateForm ?
                                <div className={styles.formMain}>
                                    <span className={operateForm !== undefined && operateForm != '' && classnames(styles.content, styles.ticketFlow)} onClick={ () => {clickTicketFlow(operateForm)} }>{operateForm}</span>
                                    <span className={styles.editForm} onClick={openForm}>{formatMessage({...localeMessage['edit']})}</span>
                                </div>
                                :
                                <Form>
                                    <Form.Item>
                                        {getFieldDecorator('formContent', {
                                            initialValue: operateForm
                                        })(
                                            <Input placeholder={formatMessage({...localeMessage['text']})}/>
                                        )}
                                    </Form.Item>
                                    <div className={styles.formMain}>
                                        <Button type="primary" onClick={ () => {
                                            const formData = form.getFieldsValue();
                                            editForm(formData)
                                        }}>{formatMessage({...localeMessage['save']})}</Button>
                                        &nbsp;
                                        <Button type="ghost" onClick={closeForm}>{formatMessage({...localeMessage['cancel']})}</Button>
                                    </div>
                                </Form>
                            }
                        </li>
                    </ul>
                </div>
                {
                    currentAlertDetail.properties !== undefined && Array.isArray(currentAlertDetail.properties) && currentAlertDetail.properties.length !== 0 ?
                    <div className={styles.infoBody}>
                        <p>{formatMessage({...localeMessage['enrich']})}</p>
                        <ul>
                            {
                                currentAlertDetail.properties.map( (item, index) => {
                                    return <li key={index}><span>{item.name}</span><span>{item.val}</span></li>
                                })
                            }
                        </ul>
                    </div>
                    :
                    undefined
                }              
                {
                    ciUrl !== '' ?
                    <div className={classnames(styles.infoBody)}>
                        <p>{formatMessage({...localeMessage['ci']})}</p>
                        <ul>
                            <li><span>{formatMessage({...localeMessage['link']})}:</span><span><a href={ciUrl} target={'_blank'}>{formatMessage({...localeMessage['ciDetail']})}</a></span></li>
                        </ul>
                    </div>
                    :
                    undefined
                }
                <div className={classnames(styles.infoBody)}>
                    <p>{formatMessage({...localeMessage['log']})}</p>
                    <Timeline>
                    {
                        incidentLog.map((log) => {
                            const date = new Date(log.operateTime);
                            return (
                                <Timeline.Item key={ log.incidentId }>
                                    <div className={ classnames(styles.timeLineLabel) }>
                                        {
                                            date.getFullYear() + "-" + date.getMonth() + "-" + date.getDay()
                                        }
                                    </div>
                                    <p>
                                        { formatMessage({...localeMessage['operateType']['t' + log.operateType]}) }
                                        <span>{ formatMessage({...localeMessage['operator']}) }:{ log.operatorName }</span>
                                    </p>
                                    {
                                        log.attribute && log.attribute['new_value']?
                                        (
                                            <p>
                                                { formatMessage({...localeMessage['status']}) }:{ statusType[log.attribute['new_value']] }
                                            </p>
                                        )
                                        :
                                        ''
                                    }
                                    {
                                        log.attribute && log.attribute['flowNo']?
                                        (
                                            <p>
                                                { formatMessage({...localeMessage['ticket']}) }:{ log.attribute['flowNo'] }
                                            </p>
                                        )
                                        :
                                        ''
                                    }
                                    {
                                        log.attribute && log.attribute['flowNo']?
                                        (
                                            <p>
                                                { formatMessage({...localeMessage['ticket']}) }:{ log.attribute['flowNo'] }
                                            </p>
                                        )
                                        :
                                        ''
                                    }
                                    {
                                        log.attribute && log.attribute['message']?
                                        (
                                            <p>
                                                { formatMessage({...localeMessage['remark']}) }:{ log.attribute['message'] }
                                            </p>
                                        )
                                        :
                                        ''
                                    }
                                    
                                    { log.operatorName }
                                </Timeline.Item>
                            )
                        })
                    }
                    </Timeline>
                </div>
            </div>
        </div>
    )
}

alertDetail.defaultProps = {
    extraProps: {}, 
    closeDeatilModal: () => {},
    clickTicketFlow: () => {},
    editForm: () => {}, 
    openForm: () => {}, 
    closeForm: () => {}, 
    openRemark: () => {}, 
    editRemark: () => {}, 
    closeRemark: () => {}
}

alertDetail.propTypes = {

}

export default injectIntl(Form.create()(alertDetail))