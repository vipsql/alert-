import React, { PropTypes, Component } from 'react';
import { default as cls } from 'classnames';
import {
    Form,
    Input,
    Radio,
    Select,
    Tabs,
    Popover,
    Checkbox
} from 'antd';

import styles from './notificationList.less';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const CheckboxGroup = Checkbox.Group;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class NotificationList extends Component {
    changeAction(type, value) {
        const {
            changeAction
        } = this.props;

        changeAction(type, value);
    }

    render() {
        const {
            checkedState,
            action,
            emailVarContent
        } = this.props;
        return (
            <Tabs animated={false} className={styles.notificationTabs}>
                <TabPane tab={
                    <div>
                        <Checkbox 
                            id="email" 
                            checked={checkedState.email} 
                            value={1} 
                            onChange={this.changeAction.bind(this, 3)} 
                        />
                        <span>{window.__alert_appLocaleData.messages['ruleEditor.email']}</span>
                    </div>
                } key="1">

                    <div>
                        <FormItem
                            label={window.__alert_appLocaleData.messages['ruleEditor.emailTitle']}
                            className={styles.mailTitle}
                        >
                            <Input id="emailTitle"
                                value={action.actionNotification ? action.actionNotification.notificationMode.emailTitle : '${entityName}:${name}'}
                                onChange={this.changeAction.bind(this, 3)}
                            // placeholder={window.__alert_appLocaleData.messages['ruleEditor.phTitle']}
                            />

                        </FormItem>
                        <FormItem
                            label={window.__alert_appLocaleData.messages['ruleEditor.emailCon']}
                            className={styles.msgContent}
                        >
                            <Input id="emailMessage"
                                value={action.actionNotification ? action.actionNotification.notificationMode.emailMessage : '${severity}, ${entityName}, ${firstOccurTime}, ${description}'}
                                onChange={this.changeAction.bind(this, 3)} type="textarea"
                            // placeholder={window.__alert_appLocaleData.messages['ruleEditor.phBody']}
                            />

                            <Popover overlayStyle={{ width: '45%' }} overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={emailVarContent}>
                                <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
                            </Popover>
                        </FormItem>

                    </div>
                </TabPane>
                <TabPane tab={
                    <div>
                        <Checkbox 
                            id="sms" 
                            checked={checkedState.sms} 
                            value={2} 
                            onChange={this.changeAction.bind(this, 3)} 
                        />
                        <span>{window.__alert_appLocaleData.messages['ruleEditor.sms']}</span>
                    </div>
                } key="2">
                    <div>
                        <FormItem
                            label={window.__alert_appLocaleData.messages['ruleEditor.smsCon']}
                            className={styles.msgContent}
                        >
                            <Input id="smsMessage"
                                value={action.actionNotification ? action.actionNotification.notificationMode.smsMessage : undefined}
                                onChange={this.changeAction.bind(this, 3)} type="textarea" placeholder={window.__alert_appLocaleData.messages['ruleEditor.phBody']} />

                            <Popover overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={this.smsVarContent}>
                                <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
                            </Popover>
                        </FormItem>
                    </div>
                </TabPane>
                {
                    window.__alert_appLocaleData.locale === 'zh-cn' &&
                    <TabPane disabled={this.props.alertAssociationRules.rooms.length === 0 ? true : false} tab={
                        <div>
                            <Checkbox 
                                disabled={this.props.alertAssociationRules.rooms.length === 0 ? true : false} 
                                id="chatops" 
                                checked={checkedState.chatops} 
                                value={3}
                                onChange={this.changeAction.bind(this, 3)} 
                            />
                            <span>{window.__alert_appLocaleData.messages['ruleEditor.chatops']}</span>
                        </div>
                    } key="3" />
                }
            </Tabs>
        );
    }
}

NotificationList.defaultProps = {};

NotificationList.propsTypes = {};

export default NotificationList;
