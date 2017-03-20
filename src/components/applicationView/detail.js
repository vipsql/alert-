import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import styles from './index.less'
import { Row, Col, Button, Input, Form} from 'antd'
import { classnames } from '../../utils'

const Item = Form.Item;
const applicationView = (props) => {

    const {type, iconType, headerName, appkey, headerMessage, urlMessage, urlExample, form, onOk, keyCreate} = props;
    
    const { getFieldDecorator, getFieldsValue } = form;

    const switchClass = classnames(
        styles['icon'],
        styles.iconfont,
        styles['icon-anonymous-iconfont']
    )

    return (
        <div className={styles.detailView}>
            <div className={styles.viewHeader}>
                <i className={classnames(switchClass, styles.headerIcon)}></i>
                <span className={styles.headerContent}>
                    {`${headerName}：`}
                    <span>
                        {`${headerMessage}`}
                        <a href='#'>API使用文档</a>
                    </span>
                </span>
            </div>
            <div className={styles.viewContent}>
                <div className={styles.step1}>
                    <span className={styles.step1Icon}></span>
                    <p className={styles.stepName}>设定显示名</p>
                    <p className={styles.stepMessage}>设定一个显示名用于标识应用</p>
                    <Form className={styles.viewForm}>
                        <Item>
                            {getFieldDecorator('displayName', {
                                rules: [
                                    { required: true, message: '必须输入应用名称'}
                                ]
                            })(
                                <Input className={styles.nameInput} placeholder='请输入应用名称'></Input>
                            )}
                        </Item>
                    </Form>
                    {
                        appkey === undefined ? 
                        <Button type="primary" className={styles.createBtn} onClick={keyCreate}>点击生成AppKey</Button>
                        :
                        <Input className={styles.readOnlyInput} readOnly value={`App key：${appkey}`} onClick={keyCreate}></Input>
                    }
                </div>
                {
                    type !== undefined && type == 0 ?
                    <div className={styles.step2}>
                        <span className={styles.step2Icon}></span>
                        <p className={styles.stepName}>{`配置${headerName}`}</p>
                        <p className={styles.stepMessage}>{urlMessage}</p>
                        <p className={styles.stepExample}>{urlExample}</p>
                    </div>
                    :
                    undefined
                }
                {
                    type !== undefined && type == 0 ?
                    <span className={styles.stepLine}></span>
                    :
                    undefined
                }
                <Button type="primary" htmlType='submit' onClick={(e) => {onOk(e, form)}}>保存</Button>
            </div>
        </div>
    )
}

export default Form.create({
    mapPropsToFields: (props) => {
        return {
            displayName: {
                value: props.displayName || undefined
            }
        }
    }
})(applicationView)