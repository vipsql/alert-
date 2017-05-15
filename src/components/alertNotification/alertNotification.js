import React, {
    PropTypes,
    Component
} from 'react';
import { default as cls } from 'classnames';
import {
    Form,
    Tabs,
    Select,
    Input,
    Popover
} from 'antd';

import styles from './alertNotification.less';

const FormItem = Form.Item;
const TabPane = Tabs.TabPane;
const Option = Select.Option;

class AlertNotification extends Component {
    render() {
        return (
            <div>
                <span className={styles.notificationTabsLabel}>{window.__alert_appLocaleData.messages['ruleEditor.notifyMode']}</span>
                <FormItem
                    {...desLayout}
                    label={window.__alert_appLocaleData.messages['ruleEditor.notifyObj']}
                >
                    <Select
                        mode="multiple"
                        style={{ width: 200 }}
                        placeholder={window.__alert_appLocaleData.messages['ruleEditor.notifySelectObj']}
                        onChange={this.changeAction.bind(this, 3)}
                        className={styles.recipients}
                        value={this.state.recipients}
                    >
                        {
                            this.props.alertAssociationRules.users.map((item, index) => <Option key={item.userId} value={item.userId}>{item.realName}</Option>)
                        }
                    </Select>
                </FormItem>
                <Tabs animated={false} className={styles.notificationTabs}>
                    <TabPane tab={
                        <div>
                            <Checkbox id="email" checked={this.state.email} value={1} onChange={this.changeAction.bind(this, 3)} />
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
                                />

                            </FormItem>
                            <FormItem
                                label={window.__alert_appLocaleData.messages['ruleEditor.emailCon']}
                                className={styles.msgContent}
                            >
                                <Input id="emailMessage"
                                    value={action.actionNotification ? action.actionNotification.notificationMode.emailMessage : '${severity}, ${entityName}, ${firstOccurTime}, ${description}'}
                                    onChange={this.changeAction.bind(this, 3)} type="textarea"
                                />

                                <Popover overlayStyle={{ width: '45%' }} overlayClassName={styles.varsWrap} placement="bottomLeft" trigger="click" content={this.emailVarContent}>
                                    <div className={styles.insertVar}>{window.__alert_appLocaleData.messages['ruleEditor.vars']}</div>
                                </Popover>
                            </FormItem>

                        </div>
                    </TabPane>
                    <TabPane tab={<div><Checkbox id="sms" checked={this.state.sms} value={2} onChange={this.changeAction.bind(this, 3)} /><span>{window.__alert_appLocaleData.messages['ruleEditor.sms']}</span></div>} key="2">
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
                                    checked={this.state.chatops}
                                    value={3}
                                    onChange={this.changeAction.bind(this, 3)}
                                />
                                <span>{window.__alert_appLocaleData.messages['ruleEditor.chatops']}</span>
                            </div>
                        } key="3" />
                    }
                </Tabs>
            </div>
        );
    }
}

AlertNotification.defaultProps = {};

AlertNotification.propsTypes = {};

export default AlertNotification;