import React, { PropTypes, Component } from 'react'
import { Button, Input, Form } from 'antd';
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../../utils'
import AlertOperation from '../alertOperation/index.js'

const alertDetail = ({extraProps, operateProps, form, closeDeatilModal, editForm, openForm, closeForm, openRemark, editRemark, closeRemark}) => {

    const { currentAlertDetail, isSowOperateForm, operateForm, isShowRemark, operateRemark } = extraProps;
    const { getFieldDecorator, getFieldsValue } = form;
    
    const dateTransfer = (begin, end) => {
        let date = {};
        let beginTime = new Date(+begin);
        let endTime = new Date(+end);
        date.continueTime = Math.round(((+end) - (+begin)) / 1000 / 60 / 60); // hours
        date.begin = beginTime.getFullYear() + '/' + (beginTime.getMonth() + 1) + '/' + beginTime.getDate() + ' ' + beginTime.getHours() + ':' + beginTime.getMinutes();
        date.end = endTime.getFullYear() + '/' + (endTime.getMonth() + 1) + '/' + endTime.getDate() + ' ' + endTime.getHours() + ':' + endTime.getMinutes();
        return date
    }

    // 目前只有完成，后期可根据状态改变class
    const setClass = classnames(
      styles['iconfont'],
      styles['icon-wancheng']
    )

    const shanchuClass = classnames(
      styles['iconfont'],
      styles['icon-shanchux']
    )

    const bianjiClass = classnames(
      styles['iconfont'],
      styles['icon-yijianfankui']
    )

    // 根据severity选择不同的颜色
    const severityColor = currentAlertDetail.severity === '紧急' ? styles.jjLevel 
                            : currentAlertDetail.severity === '主要' ? styles.zyLevel 
                                : currentAlertDetail.severity === '次要' ? styles.cyLevel 
                                    : currentAlertDetail.severity === '告警' ? styles.gjLevel 
                                        : currentAlertDetail.severity === '提醒' ? styles.txLevel : styles.jjLevel

    return (
        <div className={styles.main}>
            <div className={styles.detailHead}>
                <p>{currentAlertDetail.alertName}</p>
                <i className={classnames(styles.shanChu, shanchuClass)} onClick={closeDeatilModal}></i>
                <AlertOperation position="detail" {...operateProps}/>
            </div>
            <div className={styles.detailBody}>
                <div className={styles.infoBody}>
                    <p>基本信息</p>
                    <ul>
                        <li><span>ID:</span><span>{currentAlertDetail.alertId}</span></li>
                        <li><span>状态:</span><span>{currentAlertDetail.status}<i className={classnames(setClass, styles.stateClass)}></i></span></li>
                        <li><span>级别:</span><span className={severityColor}>{currentAlertDetail.severity}</span></li>
                        <li><span>来源:</span><span>{currentAlertDetail.entityName}</span></li>
                        <li><span>描述:</span><span>{currentAlertDetail.description}</span></li>
                        <li><span>首次发生:</span><span>{dateTransfer(currentAlertDetail.firstOccurtime, currentAlertDetail.lastOccurtime).begin}</span></li>
                        <li><span>最后发生:</span><span>{dateTransfer(currentAlertDetail.firstOccurtime, currentAlertDetail.lastOccurtime).end}</span></li>
                        <li><span>持续时间:</span><span>{dateTransfer(currentAlertDetail.firstOccurtime, currentAlertDetail.lastOccurtime).continueTime}小时</span></li>
                        <li><span>报警次数:</span><span>{currentAlertDetail.count}</span></li>
                        <li><span>负责人:</span><span>{currentAlertDetail.responsiblePerson ? currentAlertDetail.responsiblePerson : '暂无'}</span></li>
                        <li><span>负责部门:</span><span>{currentAlertDetail.responsibleDepartment ? currentAlertDetail.responsibleDepartment : '暂无'}</span></li>
                        <li className={styles.gongDan}>
                            <span>工单:</span>
                            {
                                !isSowOperateForm ?
                                <div className={styles.formMain}>
                                    <span className={operateForm !== undefined && operateForm != '' && styles.content}>{operateForm}</span>
                                    <span className={styles.editForm} onClick={openForm}>编辑</span>
                                </div>
                                :
                                <Form>
                                    <Form.Item>
                                        {getFieldDecorator('formContent', {
                                            initialValue: operateForm
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <div className={styles.formMain}>
                                        <Button type="primary" onClick={ () => {
                                            const formData = form.getFieldsValue();
                                            editForm(formData)
                                        }}>保存</Button>
                                        &nbsp;
                                        <Button type="ghost" onClick={closeForm}>取消</Button>
                                    </div>
                                </Form>
                            }
                        </li>
                    </ul>
                </div>
                <div className={styles.infoBody}>
                    <p>丰富信息</p>
                    <ul>
                        {
                            currentAlertDetail.propertys !== undefined && Array.isArray(currentAlertDetail.propertys) && currentAlertDetail.propertys.length !== 0 && currentAlertDetail.propertys.map( (item, index) => {
                                return <li key={index}><span>{item.code}</span><span>{item.value}</span></li>
                            })
                        }
                    </ul>
                </div>
                <div className={styles.infoBody}>
                    <p className={styles.remarkTitle}>备注信息</p>
                    <div className={styles.remark} onClick={openRemark}>
                        <i className={classnames(styles.bianji, bianjiClass)}></i>
                        <span>添加备注</span>
                    </div>
                    {
                        isShowRemark ?
                        <Form>
                            <Form.Item>
                                {getFieldDecorator('remark', {
                                    initialValue: operateRemark
                                })(
                                    <Input type="textarea" placeholder="请输入备注信息" autosize={ true } />
                                )}
                            </Form.Item>
                            <div className={styles.remarkOperate}>
                                <Button type="primary" onClick={ () => {
                                    const formData = form.getFieldsValue();
                                    editRemark(formData)
                                }}>保存</Button>
                                &nbsp;
                                <Button type="ghost" onClick={ closeRemark }>取消</Button>
                            </div>
                        </Form>
                        :
                        undefined
                    }
                </div>
            </div>
        </div>
    )
}

alertDetail.defaultProps = {
    extraProps: {}, 
    closeDeatilModal: () => {}, 
    editForm: () => {}, 
    openForm: () => {}, 
    closeForm: () => {}, 
    openRemark: () => {}, 
    editRemark: () => {}, 
    closeRemark: () => {}
}

alertDetail.propTypes = {

}

export default Form.create()(alertDetail)