import React, { PropTypes, Component } from 'react'
import { connect } from 'dva'
import { Modal, Button, Form, Row, Col, Input } from 'antd';
import styles from './index.less'
import { classnames } from '../../../utils'
import NotificationList from '../notificationList/index.js'
import { injectIntl, FormattedMessage, defineMessages } from 'react-intl';
import _ from 'lodash';

class notifyModal extends Component {
    constructor(props) {
        super(props)
        this.state = {
            email: false,
            sms: false,
            chatops: false
        }
        this.changeAction = this.changeAction.bind(this)
        this.formatDate = this.formatDate.bind(this)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.isShowNotifyModal) {
            this.setState({
                email: false,
                sms: false,
                chatops: false,
                recipients: [],
                actionNotification: {}
            })
        }
    }

    formatDate(time){
      const d = new Date(+time);
      let year = d.getFullYear();
      let month = d.getMonth() + 1;
      let date = d.getDate();
      let hours = d.getHours();
      let mins = d.getMinutes();

      hours = hours < 10 ? '0' + hours : hours
      mins = mins < 10 ? '0' + mins : mins

      return year + '/' + month + '/' + date + ' ' + hours + ':' + mins
    }

    changeAction(value) {
        const _action = _.cloneDeep(this.state);
        const { notifyIncident, notifyUsers } = this.props
        if (!_action.actionNotification || (_action.actionNotification && Object.keys(_action.actionNotification).length === 0)) {
            _action.actionNotification = {
                recipients: [],
                notificationMode: {
                    notificationMode: [],
                    emailTitle: `${notifyIncident.entityName}:${notifyIncident.name}`,
                    emailMessage: `${window['_severity'][notifyIncident.severity]}, ${notifyIncident.entityName}, ${this.formatDate(notifyIncident.firstOccurTime)}, ${notifyIncident.description}`,
                    smsMessage: `${window['_severity'][notifyIncident.severity]}, ${notifyIncident.entityName}, ${this.formatDate(notifyIncident.firstOccurTime)}, ${notifyIncident.description}`,
                }
            };
        }
        let mode = _action.actionNotification.notificationMode;
        if (_.isArray(value)) { // 通知对象
            let arr = [];
            notifyUsers.forEach((item, index) => {
                for (let i = value.length; i >= 0; i -= 1) {
                    if (value[i] === item.userId) {
                        arr.push({
                            userId: item.userId,
                            realName: item.realName,
                            mobile: item.mobile,
                            email: item.email
                        });
                    }
                }
            });
            _action.actionNotification.recipients = arr;
            this.setState({
                recipients: arr.map(item => item.userId)
            });
        } else if (value.target.type === 'checkbox') { // 通知方式
            if (value.target.checked) { // 选中此通知方式
                mode.notificationMode.push(value.target.value);
                mode.notificationMode = _.uniq(mode.notificationMode);
                this.setState({
                    [value.target.id]: true
                });
            } else { // 移除此通知方式
                mode.notificationMode = mode.notificationMode.filter(item => item !== value.target.value);
                this.setState({
                    [value.target.id]: false
                });
            }
        } else { // 文本
            mode[value.target.id] = value.target.value;
        }
        _action.actionNotification.notificationMode.notificationMode = mode.notificationMode;
        this.setState({
            actionNotification: _action.actionNotification
        });
    }

    render() {
        const {isShowNotifyModal, notifyIncident, notifyUsers, onOk, onCancel, intl: {formatMessage}} = this.props;
        const { email, sms, chatops, recipients } = this.state;

        const checkedState = {
            email, sms, chatops
        };
        const localeMessage = defineMessages({
            modal_cancel: {
                id: 'modal.cancel',
                defaultMessage: '取消'
            },
            modal_notifyIncident: {
                id: 'modal.notifyIncident',
                defaultMessage: '告警通知'
            },
            modal_submit: {
                id: 'modal.submit',
                defaultMessage: '提交'
            },
        })

        const modalFooter = []
        modalFooter.push(<div className={styles.modalFooter} key={ 1 }>
        <Button type="primary" onClick={ () => {
            let data = {
                actionNotification: this.state.actionNotification
            }
            onOk(data)
        }} ><FormattedMessage {...localeMessage['modal_submit']} /></Button>
        <Button type="ghost" className={styles.ghostBtn} onClick={ () => {
            onCancel()
        }}><FormattedMessage {...localeMessage['modal_cancel']} /></Button>
        </div>
        )

        return (
            <Modal
                title={<FormattedMessage {...localeMessage['modal_notifyIncident']} />}
                maskClosable="true"
                onCancel={ () => { onCancel() } }
                visible={ isShowNotifyModal }
                footer={ modalFooter }
            >
                <NotificationList
                    action={this.state}
                    recipients={recipients}
                    checkedState={checkedState}
                    notifyIncident={notifyIncident}
                    notifyUsers={notifyUsers}
                    changeAction={this.changeAction}
                    disableChatOps={this.props.disableChatOps}
                />
            </Modal>
        )
    }
}

notifyModal.defaultProps = {

}

notifyModal.propTypes = {

}

export default injectIntl(notifyModal)