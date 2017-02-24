import React, { PropTypes, Component } from 'react'
import { Button, Input, Form } from 'antd';
import { connect } from 'dva'
import styles from './index.less'
import { classnames } from '../../utils'
import AlertOperation from './alertOperation'

const alertDetail = ({alertDetail, dispatch, form}) => {

    const { currentAlertDetail, isSowOperateForm, isShowRemark } = alertDetail;
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

    return (
        <div className={styles.main}>
            <div className={styles.detailHead}>
                <p>{currentAlertDetail.alertName}</p>
                <i className={classnames(styles.shanChu, shanchuClass)} onClick={ () => {
                    dispatch({
                        type: 'alertDetail/toggleDetailModal',
                        payload: false
                    })
                    // dispatch({
                    //     type: 'alertDetail/toggleViewDetailAlertId',
                    //     payload: false
                    // })
                }}></i>
                <AlertOperation position="detail" />
            </div>
            <div className={styles.detailBody}>
                <div className={styles.infoBody}>
                    <p>基本信息</p>
                    <ul>
                        <li><span>ID:</span><span>{currentAlertDetail.alertId}</span></li>
                        <li><span>状态:</span><span>{currentAlertDetail.status}<i className={classnames(setClass, styles.stateClass)}></i></span></li>
                        <li><span>级别:</span><span className={styles.level}>{currentAlertDetail.severity}</span></li>
                        <li><span>来源:</span><span>{currentAlertDetail.entityName}</span></li>
                        <li><span>描述:</span><span>{currentAlertDetail.description}</span></li>
                        <li><span>首次发生:</span><span>{dateTransfer(currentAlertDetail.firstOccurtime, currentAlertDetail.lastOccurtime).begin}</span></li>
                        <li><span>最后发生:</span><span>{dateTransfer(currentAlertDetail.firstOccurtime, currentAlertDetail.lastOccurtime).end}</span></li>
                        <li><span>持续时间:</span><span>{dateTransfer(currentAlertDetail.firstOccurtime, currentAlertDetail.lastOccurtime).continueTime}小时</span></li>
                        <li><span>报警次数:</span><span>{currentAlertDetail.count}</span></li>
                        <li><span>负责人:</span><span>{currentAlertDetail.responsiblePerson}</span></li>
                        <li><span>负责部门:</span><span>{currentAlertDetail.responsibleDepartment}</span></li>
                        <li className={styles.gongDan}>
                            <span>工单:</span>
                            {
                                !isSowOperateForm ?
                                <div className={styles.formMain}>
                                    <span className={alertDetail.operateForm !== undefined && alertDetail.operateForm != '' && styles.content}>{alertDetail.operateForm}</span>
                                    <span className={styles.editForm} onClick={ () => {
                                        dispatch({
                                            type: 'alertDetail/toggleFormModal',
                                            payload: true
                                        })
                                    }}>编辑</span>
                                </div>
                                :
                                <Form>
                                    <Form.Item>
                                        {getFieldDecorator('formContent', {
                                            initialValue: alertDetail.operateForm
                                        })(
                                            <Input />
                                        )}
                                    </Form.Item>
                                    <div className={styles.formMain}>
                                        <Button type="primary" onClick={ () => {
                                            const formData = form.getFieldsValue();
                                            dispatch({
                                                type: 'alertDetail/setFormData',
                                                payload: formData.formContent
                                            })
                                            dispatch({
                                                type: 'alertDetail/toggleFormModal',
                                                payload: false
                                            })
                                        }}>保存</Button>
                                        &nbsp;
                                        <Button type="ghost" onClick={ () => {
                                            dispatch({
                                                type: 'alertDetail/toggleFormModal',
                                                payload: false
                                            })
                                        }}>取消</Button>
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
                            currentAlertDetail.propertys.map( (item, index) => {
                                return <li key={index}><span>{item.code}</span><span>{item.value}</span></li>
                            })
                        }
                    </ul>
                </div>
                <div className={styles.infoBody}>
                    <p className={styles.remarkTitle}>备注信息</p>
                    <div className={styles.remark} onClick={ () => {
                        dispatch({
                            type: 'alertDetail/toggleRemarkModal',
                            payload: true
                        })
                    } }>
                        <i className={classnames(styles.bianji, bianjiClass)}></i>
                        <span>添加备注</span>
                    </div>
                    {
                        isShowRemark ?
                        <Form>
                            <Form.Item>
                                {getFieldDecorator('remark', {
                                    initialValue: alertDetail.operateRemark
                                })(
                                    <Input type="textarea" placeholder="请输入备注信息" autosize={ true } />
                                )}
                            </Form.Item>
                            <div className={styles.remarkOperate}>
                                <Button type="primary" onClick={ () => {
                                    const formData = form.getFieldsValue();
                                    dispatch({
                                        type: 'alertDetail/setRemarkData',
                                        payload: formData.remark
                                    })
                                    dispatch({
                                        type: 'alertDetail/toggleRemarkModal',
                                        payload: false
                                    })
                                }}>保存</Button>
                                &nbsp;
                                <Button type="ghost" onClick={ () => {
                                    dispatch({
                                        type: 'alertDetail/toggleRemarkModal',
                                        payload: false
                                    })
                                }}>取消</Button>
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
    
}

alertDetail.propTypes = {

}

export default Form.create()(
    connect((state) => {
        return {
            alertDetail: state.alertDetail
        }
    })(alertDetail)
)